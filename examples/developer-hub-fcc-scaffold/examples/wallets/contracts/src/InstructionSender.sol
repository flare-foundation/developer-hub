// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ExtensionBase } from "fcc-extension-scaffold/src/ExtensionBase.sol";
import { IInstructions } from "flare-periphery/src/coston2/IInstructions.sol";
import { TeeIdKeyIdPair } from "flare-periphery/src/coston2/ITeeIdKeyIdPair.sol";
import { IWalletKeyManager } from "flare-periphery/src/coston2/IWalletKeyManager.sol";
import { IWalletManager } from "flare-periphery/src/coston2/IWalletManager.sol";
import { IWalletProjectManager } from "flare-periphery/src/coston2/IWalletProjectManager.sol";

/// @title InstructionSender
/// @notice The wallets example's entrypoint contract: the TEEs holding a wallet's key sign EVM
/// transactions with it, for the one signer the wallet's project owner names. The contract numbers
/// each wallet's transactions per chain; each TEE posts the signed transaction to its proxy.
/// @dev NOTE: the deployer owns this contract, with the project fee and its withdrawal, and,
/// through fce deploy, the extension in the registry, which decides what code its machines run.
/// Secure that key, or move both (for example to a multisig), before production.
contract InstructionSender is ExtensionBase {
    /// @notice The extension's op type, the Go side's OPTypeWallets.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_TYPE_WALLETS = bytes32("WALLETS");

    /// @notice SIGN_TRANSACTION, the Go side's OPCommandSignTransaction.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_SIGN_TRANSACTION = bytes32("SIGN_TRANSACTION");

    /// @notice The key type of a wallet that signs EVM transactions.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant KEY_TYPE_EVM = bytes32("EVM");

    /// @notice The signing algorithm of a wallet that signs EVM transactions.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant SIGNING_ALGO_ECDSA = bytes32("keccak256-secp256k1-ecdsa");

    /// @notice An EIP-1559 transaction, without its nonce: the contract numbers it.
    struct Transaction {
        uint256 chainId;
        address to;
        uint256 value;
        bytes data;
        uint64 gas;
        uint256 maxFeePerGas;
        uint256 maxPriorityFeePerGas;
    }

    /// @notice Who may have each wallet sign, as its project owner set it.
    mapping(bytes32 walletId => address) public signers;

    /// @notice The nonce of each wallet's next transaction on each chain, from 0: one key is one
    /// address on every chain, and each chain counts its own nonce.
    mapping(bytes32 walletId => mapping(uint256 chainId => uint64)) public nextNonce;

    event SignerSet(bytes32 indexed walletId, address signer);
    event TransactionSent(
        bytes32 indexed instructionId, bytes32 indexed walletId, uint256 indexed chainId, uint64 nonce
    );

    error OnlyProjectOwner(bytes32 walletId);
    error OnlySigner(bytes32 walletId);
    error NotThisExtension(bytes32 walletId);
    error NotAnEvmSigningKey(bytes32 walletId);
    error WalletNotInProduction(bytes32 walletId);
    error NotOneKey(bytes32 walletId, uint256 keys);
    error ChainIdRequired();
    error NotNumberedYet(uint64 nonce);

    /// @param _flareTeeManager The FlareTeeManager diamond's address.
    constructor(address _flareTeeManager) ExtensionBase(_flareTeeManager) { }

    /// @notice Names the one address that may have `_walletId` sign; the zero address stops it.
    /// Only the owner of the wallet's project may call it.
    function setSigner(bytes32 _walletId, address _signer) external {
        bytes32 projectId = IWalletManager(flareTeeManager).getWalletProjectId(_walletId);
        require(msg.sender == IWalletProjectManager(flareTeeManager).getOwner(projectId), OnlyProjectOwner(_walletId));
        signers[_walletId] = _signer;
        emit SignerSet(_walletId, _signer);
    }

    /// @notice The price of signTransaction or replaceTransaction for `_walletId`: the fee is per TEE
    /// holding its key, so it rises when a restored key gains a holder.
    function quoteSignTransaction(bytes32 _walletId) external view returns (uint256) {
        address[] memory teeIds = IWalletKeyManager(flareTeeManager).getReceivingTeeIds(_walletId);
        return _protocolFee(OP_TYPE_WALLETS, OP_COMMAND_SIGN_TRANSACTION, teeIds) + projectFee;
    }

    /// @notice Has the TEEs holding `_walletId`'s key sign `_transaction` with the next nonce of that
    /// wallet on its chain; each posts it, signed, to its proxy. Pay at least
    /// quoteSignTransaction(_walletId); the contract keeps any excess.
    /// @dev Only the wallet's signer may call it. A transaction that never lands blocks every later
    /// one on its chain: replaceTransaction signs that nonce again.
    function signTransaction(bytes32 _walletId, Transaction calldata _transaction)
        external
        payable
        chargesFees
        returns (bytes32 _instructionId, uint64 _nonce)
    {
        _nonce = nextNonce[_walletId][_transaction.chainId]++;
        _instructionId = _sign(_walletId, _nonce, _transaction);
    }

    /// @notice Signs `_transaction` again at `_nonce`, one signTransaction already took on its
    /// chain: to raise the fee of one still pending, or to replace one that never landed.
    /// Pay at least quoteSignTransaction(_walletId); the contract keeps any excess.
    function replaceTransaction(bytes32 _walletId, uint64 _nonce, Transaction calldata _transaction)
        external
        payable
        chargesFees
        returns (bytes32 _instructionId)
    {
        require(_nonce < nextNonce[_walletId][_transaction.chainId], NotNumberedYet(_nonce));
        _instructionId = _sign(_walletId, _nonce, _transaction);
    }

    /// @dev Sends the transaction to every TEE in production holding the wallet's one key, with the
    /// wallet's cosigners, which each TEE checks against the key's.
    function _sign(bytes32 _walletId, uint64 _nonce, Transaction calldata _transaction) internal returns (bytes32 _id) {
        require(msg.sender == signers[_walletId], OnlySigner(_walletId));
        require(_transaction.chainId != 0, ChainIdRequired());
        address manager = flareTeeManager;
        bytes32 projectId = IWalletManager(manager).getWalletProjectId(_walletId);
        require(IWalletProjectManager(manager).getExtensionId(projectId) == extensionId, NotThisExtension(_walletId));
        require(
            IWalletProjectManager(manager).getKeyType(projectId) == KEY_TYPE_EVM
                && IWalletProjectManager(manager).getSigningAlgo(projectId) == SIGNING_ALGO_ECDSA,
            NotAnEvmSigningKey(_walletId)
        );
        // also refuses a paused wallet
        require(
            IWalletManager(manager).getWalletStatus(_walletId) == IWalletManager.WalletStatus.PRODUCTION,
            WalletNotInProduction(_walletId)
        );
        // each key is its own address: two keys would sign from two addresses
        (, uint64[] memory keyIds,) = IWalletKeyManager(manager).getWalletKeysInfo(_walletId);
        require(keyIds.length == 1, NotOneKey(_walletId, keyIds.length));

        // reverts ThresholdNotMet when no TEE holding the key is in production
        TeeIdKeyIdPair[] memory pairs = IWalletKeyManager(manager).receivingTeesAndKeys(_walletId);
        address[] memory teeIds = new address[](pairs.length);
        for (uint256 i; i < pairs.length; ++i) {
            teeIds[i] = pairs[i].teeId;
        }
        (address[] memory cosigners, uint64 threshold) =
            IWalletManager(manager).getWalletCosignersAndThreshold(_walletId);
        _id = _send(
            teeIds,
            IInstructions.TeeInstructionParams({
                opType: OP_TYPE_WALLETS,
                opCommand: OP_COMMAND_SIGN_TRANSACTION,
                message: abi.encode(_walletId, keyIds[0], _nonce, _transaction),
                cosigners: cosigners,
                cosignersThreshold: threshold,
                claimBackAddress: msg.sender
            })
        );
        emit TransactionSent(_id, _walletId, _transaction.chainId, _nonce);
    }
}
