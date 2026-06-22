// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// TODO: Replace local interfaces with imports from flare-smart-contracts-v2 once published as a package.
import { ITeeExtensionRegistry } from "./interfaces/ITeeExtensionRegistry.sol";
import { ITeeMachineRegistry } from "./interfaces/ITeeMachineRegistry.sol";
import { SettlementTime } from "./SettlementTime.sol";

/// @notice Minimal ERC-20 surface used for premiums and payouts.
interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title WeatherInsurance
/// @author Flare Foundation
/// @notice Parametric rainfall insurance settled by a Flare Confidential Compute
/// (FCC) TEE extension. A policyholder buys cover for a specific date; from 00:00 UTC
/// on the day after that date a keeper asks the TEE to fetch the day's rainfall from
/// OpenWeatherMap's One Call `day_summary` endpoint. The TEE returns a signed
/// settlement and `settle()` verifies the TEE signature on-chain (ecrecover
/// against the registered TEE address) before paying out if the measured
/// precipitation met the policy threshold.
///
/// Premiums and payouts are denominated in an ERC-20 `payToken` (set by the
/// owner). Native value is only used for the TEE instruction fee forwarded to
/// the registry in requestSettlement/getWeather.
///
/// This contract also doubles as the FCC InstructionSender: it owns the
/// extension registration and routes WEATHER/{FETCH,SETTLE,BUY} instructions
/// through the Flare TEE Manager diamond.
///
/// DO NOT MODIFY: the registry wiring in the constructor, setExtensionId(),
/// and _getExtensionId().
contract WeatherInsurance {
    // --- FCC operation identifiers (must match internal/config/config.go) ---

    /// @notice Operation type for weather-data actions.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_TYPE_WEATHER = bytes32("WEATHER");

    /// @notice Command for the ad-hoc current-weather FETCH action.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_FETCH = bytes32("FETCH");

    /// @notice Command for the policy SETTLE action (fetch daily rainfall).
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_SETTLE = bytes32("SETTLE");

    /// @notice Command for a private policy BUY action (ECIES-encrypted params).
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_BUY = bytes32("BUY");

    // --- Registries ---

    /// @notice Reference to the TEE extension registry contract.
    ITeeExtensionRegistry public immutable TEE_EXTENSION_REGISTRY;
    /// @notice Reference to the TEE machine registry contract.
    ITeeMachineRegistry public immutable TEE_MACHINE_REGISTRY;

    uint256 private _extensionId;

    // --- Policy state ---

    /// @notice A parametric rainfall policy. Amounts are in `payToken` units.
    struct Policy {
        address policyholder;       // who gets paid on trigger
        string date;                // coverage date, "YYYY-MM-DD" (OpenWeatherMap day_summary)
        uint256 rainThresholdMmE2;  // payout iff measured precipitation (mm × 100) >= this
        uint256 payout;             // payToken paid to the holder on trigger
        uint256 premium;            // payToken paid at purchase
        uint256 measuredMmE2;       // precipitation reported by the TEE (mm × 100), set on settle
        bool settled;
        bool paidOut;
        bool isPrivate;             // if true, rain threshold is not stored on-chain (TEE-held)
        bytes32 termsCommitment;    // keccak256(abi.encode PrivateBuyParams); links TEE memory to policy
        string lat;                 // decimal latitude for One Call day_summary (set at buy)
        string lon;                 // decimal longitude for One Call day_summary (set at buy)
        uint64 settlementUnlockAt;  // unix sec: 00:00 UTC on the day after coverage date
    }

    /// @notice ABI payload of a SETTLE instruction (decoded by the TEE).
    struct SettleMessage {
        uint256 policyId;
        address contractAddr;       // this contract — echoed back so settle() can bind the result
        string date;                // coverage date (on-chain for all policies)
        string lat;
        string lon;
        bytes32 termsCommitment;    // nonzero => TEE loads coverage terms from private BUY memory
    }

    /// @notice ABI payload of an ad-hoc FETCH instruction (decoded by the TEE).
    struct GetWeatherMessage {
        string city;
    }

    /// @notice Decrypted by the TEE; not sent on-chain in plaintext during buyPolicyPrivate.
    struct PrivateBuyParams {
        address holder;
        address contractAddr;
        string date;
        uint256 rainThresholdMmE2;
        uint256 payout;
        uint256 premium;
        string lat;
        string lon;
    }

    /// @notice Contract owner (deployer). Funds the pool and registers the TEE address.
    address public owner;

    /// @notice Registered TEE signing address; settlements must be signed by it.
    address public teeAddress;

    /// @notice ERC-20 used for premiums and payouts. Set by the owner before use.
    IERC20 public payToken;

    /// @notice payToken reserved to cover payouts of unsettled policies.
    uint256 public reserved;

    Policy[] public policies;

    event PayTokenSet(address indexed token);
    event PolicyBought(uint256 indexed policyId, address indexed holder, string date, uint256 rainThresholdMmE2, uint256 payout, uint256 premium);
    /// @notice Emitted for private buys instead of PolicyBought (no coverage terms in logs).
    event PrivatePolicyRelayed(uint256 indexed policyId, address indexed holder, bytes32 indexed termsCommitment);
    event PrivateBuyRequested(bytes32 indexed instructionId, address indexed holder);
    event SettlementRequested(uint256 indexed policyId, bytes32 instructionId);
    event Settled(uint256 indexed policyId, uint256 measuredMmE2, bool paidOut);
    event TeeAddressSet(address indexed teeAddress);
    event PoolFunded(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    /// @notice Initializes the contract with registry addresses.
    /// @param _teeExtensionRegistry Address of the TEE extension registry.
    /// @param _teeMachineRegistry Address of the TEE machine registry.
    constructor(
        ITeeExtensionRegistry _teeExtensionRegistry,
        ITeeMachineRegistry _teeMachineRegistry
    ) {
        require(address(_teeExtensionRegistry) != address(0), "TeeExtensionRegistry cannot be zero address");
        require(address(_teeMachineRegistry) != address(0), "TeeMachineRegistry cannot be zero address");
        require(address(_teeExtensionRegistry).code.length > 0, "TeeExtensionRegistry has no code");
        require(address(_teeMachineRegistry).code.length > 0, "TeeMachineRegistry has no code");
        TEE_EXTENSION_REGISTRY = _teeExtensionRegistry;
        TEE_MACHINE_REGISTRY = _teeMachineRegistry;
        owner = msg.sender;
    }

    /// @notice Finds and sets this contract's extension id. Can only be set once.
    /// DO NOT MODIFY this function.
    function setExtensionId() external {
        require(_extensionId == 0, "Extension ID already set.");

        uint256 c = TEE_EXTENSION_REGISTRY.extensionsCounter();
        for (uint256 i = 0; i < c; ++i) {
            if (TEE_EXTENSION_REGISTRY.getTeeExtensionInstructionsSender(i) == address(this)) {
                _extensionId = i;
                return;
            }
        }
        revert("Extension ID not found.");
    }

    // --- Pool funding (payToken) ---

    /// @notice Set the ERC-20 used for premiums and payouts. Owner only.
    function setPayToken(address _token) external onlyOwner {
        require(_token != address(0), "zero token");
        payToken = IERC20(_token);
        emit PayTokenSet(_token);
    }

    /// @notice Fund the payout pool with `_amount` payToken. Caller must approve first.
    function fundPool(uint256 _amount) external {
        require(address(payToken) != address(0), "payToken not set");
        require(payToken.transferFrom(msg.sender, address(this), _amount), "fund transfer failed");
        emit PoolFunded(msg.sender, _amount);
    }

    /// @notice Owner withdraws unreserved payToken liquidity (premiums + unclaimed pool).
    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= availableLiquidity(), "exceeds unreserved liquidity");
        require(payToken.transfer(owner, _amount), "withdraw failed");
    }

    /// @notice payToken liquidity not reserved against outstanding policy payouts.
    function availableLiquidity() public view returns (uint256) {
        if (address(payToken) == address(0)) {
            return 0;
        }
        return payToken.balanceOf(address(this)) - reserved;
    }

    // --- Policy lifecycle ---

    /// @notice Buy a rainfall policy for `_date`. The premium is pulled in payToken,
    ///         so the caller must `approve` this contract for `_premium` first.
    /// @param _date Coverage date as "YYYY-MM-DD".
    /// @param _rainThresholdMmE2 Trigger threshold in mm × 100 (e.g. 100 = 1.00 mm).
    /// @param _payout payToken paid to the holder if the threshold is met. Must be
    ///        covered by currently unreserved liquidity (after the premium is added).
    /// @param _premium payToken pulled from the caller at purchase.
    /// @return policyId The new policy's id.
    function buyPolicy(
        string calldata _date,
        uint256 _rainThresholdMmE2,
        uint256 _payout,
        uint256 _premium,
        string calldata _lat,
        string calldata _lon
    ) external returns (uint256 policyId) {
        policyId = _createPolicy(msg.sender, _date, _rainThresholdMmE2, _payout, _premium, _lat, _lon, false);
    }

    /// @notice Request a private policy buy. Policy parameters are ECIES-encrypted under
    ///         the TEE public key and passed as opaque bytes; only the ciphertext is visible
    ///         in this transaction. After the TEE processes the instruction, call
    ///         `relayPrivateBuy` with the signed ActionResult.
    /// @param _encryptedPolicy ECIES ciphertext of ABI-encoded PrivateBuyParams.
    function buyPolicyPrivate(bytes calldata _encryptedPolicy) external payable {
        require(_encryptedPolicy.length > 0, "empty ciphertext");

        address[] memory teeIds = TEE_MACHINE_REGISTRY.getRandomTeeIds(_getExtensionId(), 1);
        address[] memory cosigners = new address[](0);

        ITeeExtensionRegistry.TeeInstructionParams memory params = ITeeExtensionRegistry.TeeInstructionParams({
            opType: OP_TYPE_WEATHER,
            opCommand: OP_COMMAND_BUY,
            message: _encryptedPolicy,
            cosigners: cosigners,
            cosignersThreshold: 0,
            claimBackAddress: msg.sender
        });

        bytes32 instructionId = TEE_EXTENSION_REGISTRY.sendInstructions{value: msg.value}(teeIds, params);
        emit PrivateBuyRequested(instructionId, msg.sender);
    }

    /// @notice Finalize a private buy with a TEE-signed result from the BUY instruction.
    /// @dev The TEE node signs `ActionResult.Hash()` with its registered key using the
    ///      EIP-191 personal-sign prefix. We reconstruct that hash from the result
    ///      fields the proxy returned and recover the signer, requiring it to equal
    ///      `teeAddress`. `_resultData` is the exact bytes the TEE returned in
    ///      ActionResult.Data:
    ///      abi.encode(address holder, address contractAddr, string date,
    ///      uint256 rainThresholdMmE2, uint256 payout, uint256 premium, string lat,
    ///      string lon).
    ///      - holder: policy buyer; must equal msg.sender.
    ///      - contractAddr: target WeatherInsurance; must equal address(this).
    ///      - date: coverage date as "YYYY-MM-DD".
    ///      - rainThresholdMmE2: rainfall trigger threshold in mm × 100 (e.g. 100 = 1.00 mm).
    ///      - payout: payToken paid to holder if triggered; must be covered by pool liquidity.
    ///      - premium: payToken pulled from holder at relay (caller must approve first).
    ///      - lat: latitude for settlement weather fetch.
    ///      - lon: longitude for settlement weather fetch.
    ///      A `termsCommitment` over those fields is stored on the policy; threshold and
    ///      coordinates stay off-chain until settlement reveals them.
    /// @param _resultData     Raw `ActionResult.Data` returned by the TEE extension after it
    ///                        decrypts the ECIES ciphertext from `buyPolicyPrivate`, validates
    ///                        the terms, and ABI-encodes them. Must be the exact byte string
    ///                        the proxy signed (do not re-encode). Decoded as:
    ///                        `(holder, contractAddr, date, rainThresholdMmE2, payout, premium,
    ///                        lat, lon)` — see @dev above. `holder` must be `msg.sender`;
    ///                        `contractAddr` must be `address(this)`.
    /// @param _actionId       `ActionResult.ID`: the instruction id emitted by
    ///                        `buyPolicyPrivate` / `sendInstructions`. Binds this relay to one
    ///                        FCC instruction so the signed result cannot be replayed against
    ///                        another action. Included in `ActionResult.Hash()` as a plain
    ///                        `bytes32` (not hashed again).
    /// @param _submissionTag  `ActionResult.SubmissionTag` from the original action payload
    ///                        (typically `"submit"`). Hashed as `keccak256(bytes(tag))` inside
    ///                        `ActionResult.Hash()`. Must match the tag the TEE node signed.
    /// @param _status         `ActionResult.Status` reported by the extension: `0` = error,
    ///                        `1` = success, `2` = still processing. Only `1` is accepted;
    ///                        any other value reverts with `"TEE reported failure"`. Part of
    ///                        the signed hash so a failed TEE result cannot be relayed.
    /// @param _signature      ECDSA signature from the registered TEE node over
    ///                        `ActionResult.Hash()` = `keccak256(abi.encodePacked(
    ///                        keccak256(_resultData), _actionId,
    ///                        keccak256(bytes(_submissionTag)), _status))`, wrapped with the
    ///                        EIP-191 `"\x19Ethereum Signed Message:\n32"` prefix. Recovered
    ///                        signer must equal `teeAddress`.
    /// @return policyId The new policy's id.
    function relayPrivateBuy(
        bytes calldata _resultData,
        bytes32 _actionId,
        string calldata _submissionTag,
        uint8 _status,
        bytes calldata _signature
    ) external returns (uint256 policyId) {
        require(teeAddress != address(0), "TEE address not set");
        require(_status == 1, "TEE reported failure");

        // Reconstruct ActionResult.Hash() = keccak256(keccak256(data) || id || keccak256(tag) || status).
        bytes32 resultHash = keccak256(
            abi.encodePacked(
                keccak256(_resultData),
                _actionId,
                keccak256(bytes(_submissionTag)),
                _status
            )
        );

        // Recover the signer from the signature and verify it matches the TEE address.
        address signer = _recover(_ethSigned(resultHash), _signature);
        // Verify the signer matches the registered TEE address.
        require(signer == teeAddress, "bad TEE signature");

        // ActionResult.Data from the TEE BUY instruction (see @dev above for field meanings).
        (
            address holder,
            address contractAddr,
            string memory date,
            uint256 rainThresholdMmE2,
            uint256 payout,
            uint256 premium,
            string memory lat,
            string memory lon
        ) = abi.decode(_resultData, (address, address, string, uint256, uint256, uint256, string, string));

        require(contractAddr == address(this), "buy not for this contract");
        require(msg.sender == holder, "not holder");

        // Hash attested terms for settlement verification; rain threshold stays off-chain (isPrivate).
        bytes32 commitment = _privateTermsCommitment(
            holder, contractAddr, date, rainThresholdMmE2, payout, premium, lat, lon
        );
        policyId = _createPolicy(holder, date, rainThresholdMmE2, payout, premium, lat, lon, true);
        policies[policyId].termsCommitment = commitment;

        emit PrivatePolicyRelayed(policyId, holder, commitment);
    }

    /// @notice Ask the TEE to settle a policy by fetching its date's rainfall.
    /// @dev Allowed only from settlementUnlockAt onward (midnight UTC after coverage date).
    function requestSettlement(uint256 _policyId) external payable {
        Policy storage p = policies[_policyId];
        require(p.policyholder != address(0), "no such policy");
        require(!p.settled, "already settled");
        require(block.timestamp >= p.settlementUnlockAt, "settlement not open yet");

        // Pick one registered TEE for this extension; no cosigners on settlement.
        address[] memory teeIds = TEE_MACHINE_REGISTRY.getRandomTeeIds(_getExtensionId(), 1);
        address[] memory cosigners = new address[](0);

        // TEE fetches rainfall for date/lat/lon; termsCommitment links private policies to TEE-held terms.
        bytes memory message = abi.encode(SettleMessage({
            policyId: _policyId,
            contractAddr: address(this),
            date: p.date,
            lat: p.lat,
            lon: p.lon,
            termsCommitment: p.termsCommitment
        }));

        ITeeExtensionRegistry.TeeInstructionParams memory params = ITeeExtensionRegistry.TeeInstructionParams({
            opType: OP_TYPE_WEATHER,
            opCommand: OP_COMMAND_SETTLE,
            message: message,
            cosigners: cosigners,
            cosignersThreshold: 0,
            claimBackAddress: msg.sender
        });

        // After processing, call settle() with the signed ActionResult from the proxy.
        bytes32 instructionId = TEE_EXTENSION_REGISTRY.sendInstructions{value: msg.value}(teeIds, params);
        emit SettlementRequested(_policyId, instructionId);
    }

    /// @notice Finalize a policy with a TEE-signed settlement and pay out if triggered.
    /// @dev The TEE node signs `ActionResult.Hash()` with its registered key using the
    ///      EIP-191 personal-sign prefix. We reconstruct that hash from the result
    ///      fields the proxy returned and recover the signer, requiring it to equal
    ///      `teeAddress`. `_resultData` is the exact bytes the TEE returned in
    ///      ActionResult.Data: abi.encode(address contractAddr, uint256 policyId,
    ///      uint256 precipitationMmE2, string date, uint256 rainThresholdMmE2, bool triggered).
    ///      For private policies, rainThresholdMmE2 is verified against
    ///      termsCommitment and written on-chain; isPrivate is cleared before payout.
    /// @param _resultData     ActionResult.Data bytes (the settlement payload).
    /// @param _actionId       ActionResult.ID.
    /// @param _submissionTag  ActionResult.SubmissionTag (e.g. "submit").
    /// @param _status         ActionResult.Status (1 = success).
    /// @param _signature      TEE node signature over ActionResult.Hash().
    function settle(
        bytes calldata _resultData,
        bytes32 _actionId,
        string calldata _submissionTag,
        uint8 _status,
        bytes calldata _signature
    ) external {
        require(teeAddress != address(0), "TEE address not set");
        require(_status == 1, "TEE reported failure");

        // Reconstruct ActionResult.Hash() = keccak256(keccak256(data) || id || keccak256(tag) || status).
        bytes32 resultHash = keccak256(
            abi.encodePacked(
                keccak256(_resultData),
                _actionId,
                keccak256(bytes(_submissionTag)),
                _status
            )
        );
        address signer = _recover(_ethSigned(resultHash), _signature);
        require(signer == teeAddress, "bad TEE signature");

        // ActionResult.Data from the TEE SETTLE instruction (see @dev above for field meanings).
        (
            address contractAddr,
            uint256 policyId,
            uint256 precipitationMmE2,
            string memory date,
            uint256 revealedThresholdMmE2,
            bool triggered
        ) = abi.decode(_resultData, (address, uint256, uint256, string, uint256, bool));
        require(contractAddr == address(this), "settlement not for this contract");

        Policy storage p = policies[policyId];
        require(p.policyholder != address(0), "no such policy");
        require(!p.settled, "already settled");
        require(block.timestamp >= p.settlementUnlockAt, "settlement not open yet");

        // Private policy: verify revealed threshold against BUY commitment, then store on-chain.
        if (p.termsCommitment != bytes32(0)) {
            require(p.isPrivate, "not private");
            require(
                _privateTermsCommitment(
                    p.policyholder,
                    address(this),
                    date,
                    revealedThresholdMmE2,
                    p.payout,
                    p.premium,
                    p.lat,
                    p.lon
                ) == p.termsCommitment,
                "terms mismatch"
            );
            require(triggered == (precipitationMmE2 >= revealedThresholdMmE2), "triggered mismatch");
            p.date = date;
            p.rainThresholdMmE2 = revealedThresholdMmE2;
            p.isPrivate = false;
        }

        p.settled = true;
        p.measuredMmE2 = precipitationMmE2;
        reserved -= p.payout; // release payout liquidity whether or not we pay out

        bool pay = precipitationMmE2 >= p.rainThresholdMmE2;
        if (pay) {
            p.paidOut = true;
            require(payToken.transfer(p.policyholder, p.payout), "payout transfer failed");
        }

        emit Settled(policyId, precipitationMmE2, p.paidOut);
    }

    /// @notice Whether settlement may be requested now (block.timestamp >= settlementUnlockAt).
    function canRequestSettlement(uint256 _policyId) external view returns (bool) {
        Policy storage p = policies[_policyId];
        if (p.policyholder == address(0) || p.settled) {
            return false;
        }
        return block.timestamp >= p.settlementUnlockAt;
    }

    /// @notice Register the active TEE signing address (read off TeeMachineRegistry).
    function setTeeAddress(address _teeAddress) external onlyOwner {
        require(_teeAddress != address(0), "zero TEE address");
        teeAddress = _teeAddress;
        emit TeeAddressSet(_teeAddress);
    }

    // --- Ad-hoc current weather (unchanged FETCH path; handy for testing) ---

    /// @notice Request current weather for a city from the TEE (no policy involved).
    /// @param _city UTF-8 city name (e.g. "Berlin,DE").
    function getWeather(string calldata _city) external payable {
        address[] memory teeIds = TEE_MACHINE_REGISTRY.getRandomTeeIds(_getExtensionId(), 1);
        address[] memory cosigners = new address[](0);

        ITeeExtensionRegistry.TeeInstructionParams memory params = ITeeExtensionRegistry.TeeInstructionParams({
            opType: OP_TYPE_WEATHER,
            opCommand: OP_COMMAND_FETCH,
            message: abi.encode(GetWeatherMessage({city: _city})),
            cosigners: cosigners,
            cosignersThreshold: 0,
            claimBackAddress: msg.sender
        });

        TEE_EXTENSION_REGISTRY.sendInstructions{value: msg.value}(teeIds, params);
    }

    // --- Views ---

    function policyCount() external view returns (uint256) {
        return policies.length;
    }

    // --- Internal ---

    /// @notice Returns the cached extension ID, reverting if not set.
    function _getExtensionId() internal view returns (uint256) {
        require(_extensionId != 0, "Extension ID is not set.");
        return _extensionId;
    }

    /// @notice Commitment over private buy terms (matches TEE extension storage key).
    function _privateTermsCommitment(
        address holder,
        address contractAddr,
        string memory date,
        uint256 rainThresholdMmE2,
        uint256 payout,
        uint256 premium,
        string memory lat,
        string memory lon
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(holder, contractAddr, date, rainThresholdMmE2, payout, premium, lat, lon));
    }

    /// @notice Pull premium, reserve payout liquidity, and append a policy record.
    /// @param _isPrivate If true, rain threshold is kept in TEE memory only (date is stored on-chain).
    function _createPolicy(
        address _holder,
        string memory _date,
        uint256 _rainThresholdMmE2,
        uint256 _payout,
        uint256 _premium,
        string memory _lat,
        string memory _lon,
        bool _isPrivate
    ) internal returns (uint256 policyId) {
        require(address(payToken) != address(0), "payToken not set");
        require(_premium > 0, "premium required");
        require(_payout > 0, "payout required");
        require(_holder != address(0), "zero holder");
        require(bytes(_lat).length > 0, "lat required");
        require(bytes(_lon).length > 0, "lon required");
        require(bytes(_date).length > 0, "date required");
        uint64 unlockAt = uint64(SettlementTime.unlockAt(_date));

        require(payToken.transferFrom(_holder, address(this), _premium), "premium transfer failed");
        require(_payout <= availableLiquidity(), "insufficient pool liquidity for payout");

        policyId = policies.length;
        policies.push(Policy({
            policyholder: _holder,
            date: _date,
            rainThresholdMmE2: _isPrivate ? 0 : _rainThresholdMmE2,
            payout: _payout,
            premium: _premium,
            measuredMmE2: 0,
            settled: false,
            paidOut: false,
            isPrivate: _isPrivate,
            termsCommitment: bytes32(0),
            lat: _lat,
            lon: _lon,
            settlementUnlockAt: unlockAt
        }));
        reserved += _payout;

        if (!_isPrivate) {
            emit PolicyBought(policyId, _holder, _date, _rainThresholdMmE2, _payout, _premium);
        }
    }

    /// @notice EIP-191 personal-sign hash of a 32-byte digest.
    function _ethSigned(bytes32 _hash) private pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    }

    /// @notice Recover the signer of a 65-byte [r||s||v] secp256k1 signature.
    function _recover(bytes32 _digest, bytes calldata _sig) private pure returns (address) {
        require(_sig.length == 65, "bad signature length");
        bytes32 r;
        bytes32 s;
        uint8 v;
        assembly {
            r := calldataload(_sig.offset)
            s := calldataload(add(_sig.offset, 32))
            v := byte(0, calldataload(add(_sig.offset, 64)))
        }
        if (v < 27) {
            v += 27;
        }
        require(v == 27 || v == 28, "bad signature v");
        address signer = ecrecover(_digest, v, r, s);
        require(signer != address(0), "invalid signature");
        return signer;
    }
}
