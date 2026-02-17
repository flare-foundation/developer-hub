// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

// OpenZeppelin: SafeERC20, ECDSA, EIP712, Ownable, ReentrancyGuard
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Flare Contract Registry and FAsset interface
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/flare/ContractRegistry.sol";
import {IAssetManager} from "@flarenetwork/flare-periphery-contracts/flare/IAssetManager.sol";
import {IFAsset} from "@flarenetwork/flare-periphery-contracts/flare/IFAsset.sol";

/**
 * @title GaslessPaymentForwarder
 * @notice Enables gasless FXRP transfers using EIP-712 signed meta-transactions
 * @dev Users sign payment requests off-chain, relayers submit them on-chain.
 *      FXRP from Flare Contract Registry: getAssetManagerFXRP() -> fAsset().
 *
 * Flow: (1) User approves this contract to spend FXRP once.
 *       (2) User signs PaymentRequest off-chain. (3) Relayer calls executePayment().
 *       (4) Contract verifies signature and executes transfer.
 */
contract GaslessPaymentForwarder is EIP712, Ownable, ReentrancyGuard {
    // 1. Define the necessary libraries and contract variables
    using SafeERC20 for IFAsset;
    using ECDSA for bytes32;

    mapping(address => uint256) public nonces; // replay protection per sender
    mapping(address => bool) public authorizedRelayers; // relayer allowlist

    uint256 public relayerFee; // default fee (owner-configurable)

    // EIP-712 type hash for PaymentRequest
    bytes32 public constant PAYMENT_REQUEST_TYPEHASH =
        keccak256(
            "PaymentRequest(address from,address to,uint256 amount,uint256 fee,uint256 nonce,uint256 deadline)"
        );

    // 2. Contract events
    event PaymentExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        uint256 fee,
        uint256 nonce
    );
    event RelayerAuthorized(address indexed relayer, bool authorized); // relayer allowlist changed
    event RelayerFeeUpdated(uint256 newFee); // default fee changed

    // 3. Custom errors
    error InvalidSignature(); // signer != from
    error ExpiredRequest(); // block.timestamp > deadline
    error InvalidNonce(); // nonce mismatch (replay)
    error UnauthorizedRelayer(); // caller not in allowlist
    error InsufficientAllowance(); // user approval < amount + fee
    error ZeroAddress(); // zero address passed

    // 4. Constructor that initializes the relayer fee
    constructor(
        uint256 _relayerFee
    ) EIP712("GaslessPaymentForwarder", "1") Ownable(msg.sender) {
        relayerFee = _relayerFee; // set initial default fee
    }

    // 5. Returns FXRP token from Flare Contract Registry
    function fxrp() public view returns (IFAsset) {
        IAssetManager assetManager = ContractRegistry.getAssetManagerFXRP();
        return IFAsset(address(assetManager.fAsset())); // FXRP token from registry
    }

    // 6. Execute a gasless payment
    function executePayment(
        address from,
        address to,
        uint256 amount,
        uint256 fee,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant {
        if (block.timestamp > deadline) revert ExpiredRequest(); // validate deadline

        uint256 currentNonce = nonces[from];

        // 7. Hash the payment request
        bytes32 structHash = keccak256(
            abi.encode(
                PAYMENT_REQUEST_TYPEHASH,
                from,
                to,
                amount,
                fee,
                currentNonce,
                deadline
            )
        );

        // 8. Recover the signer from the hash
        bytes32 hash = _hashTypedDataV4(structHash);
        address signer = hash.recover(signature);

        // 9. Check if the signer is the from address
        if (signer != from) revert InvalidSignature();

        nonces[from] = currentNonce + 1; // increment nonce (prevents replay)

        IFAsset _fxrp = fxrp();

        // 10. Check if the allowance is sufficient
        uint256 totalAmount = amount + fee;
        if (_fxrp.allowance(from, address(this)) < totalAmount) {
            revert InsufficientAllowance();
        }

        // 11. Transfer the amount to the recipient
        _fxrp.safeTransferFrom(from, to, amount);

        // 12. Transfer the fee to the relayer
        if (fee > 0) {
            _fxrp.safeTransferFrom(from, msg.sender, fee);
        }

        emit PaymentExecuted(from, to, amount, fee, currentNonce); // log success
    }

    // 13. Views for off-chain signing / validation
    function getNonce(address account) external view returns (uint256) {
        return nonces[account]; // current nonce for off-chain signing
    }

    // Get the EIP-712 domain separator
    function getDomainSeparator() external view returns (bytes32) {
        return _domainSeparatorV4(); // EIP-712 domain separator
    }

    // Compute the hash of a payment request for signing
    function getPaymentRequestHash(
        address from,
        address to,
        uint256 amount,
        uint256 fee,
        uint256 nonce,
        uint256 deadline
    ) external view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                PAYMENT_REQUEST_TYPEHASH,
                from,
                to,
                amount,
                fee,
                nonce,
                deadline
            )
        );
        return _hashTypedDataV4(structHash); // full EIP-712 typed-data hash
    }

    // 15. Set relayer authorization status
    function setRelayerAuthorization(
        address relayer,
        bool authorized
    ) external onlyOwner {
        authorizedRelayers[relayer] = authorized; // update allowlist
        emit RelayerAuthorized(relayer, authorized);
    }

    // 15. Update the default relayer fee
    function setRelayerFee(uint256 _relayerFee) external onlyOwner {
        relayerFee = _relayerFee; // update default fee
        emit RelayerFeeUpdated(_relayerFee);
    }
}
