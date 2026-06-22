// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title IWeatherInsurance
/// @notice Minimal surface of the deployed WeatherInsurance (InstructionSender) contract.
/// @dev Parametric rainfall insurance settled by a Flare Confidential Compute (FCC) TEE
///      extension. Premiums and payouts use an ERC-20 `payToken`; native value is only
///      required for TEE instruction fees on `buyPolicyPrivate` and `requestSettlement`.
interface IWeatherInsurance {
    /// @notice On-chain policy record. Amounts are in `payToken` units.
    struct Policy {
        address policyholder;       // who receives payout on trigger
        string date;                // coverage date "YYYY-MM-DD"
        uint256 rainThresholdMmE2;  // payout iff measured precipitation (mm × 100) >= this; 0 if private
        uint256 payout;             // payToken paid to the holder on trigger
        uint256 premium;            // payToken paid at purchase
        uint256 measuredMmE2;       // precipitation reported by the TEE (mm × 100), set on settle
        bool settled;
        bool paidOut;
        bool isPrivate;             // if true, rain threshold is TEE-held (not stored on-chain)
        bytes32 termsCommitment;    // keccak256(abi.encode PrivateBuyParams); links TEE memory to policy
        string lat;                 // decimal latitude for OpenWeatherMap day_summary
        string lon;                 // decimal longitude for OpenWeatherMap day_summary
        uint64 settlementUnlockAt;  // unix timestamp after which settlement may be requested
    }

    /// @notice Returns whether `_policyId` may have settlement requested (on-chain timing gate).
    function canRequestSettlement(uint256 _policyId) external view returns (bool);

    /// @notice Buy a public rainfall policy. Caller must approve this contract for `_premium` payToken first.
    /// @param _date Coverage date as "YYYY-MM-DD".
    /// @param _rainThresholdMmE2 Trigger threshold in mm × 100 (e.g. 100 = 1.00 mm).
    /// @param _payout payToken paid to the holder if the threshold is met.
    /// @param _premium payToken pulled from the caller at purchase.
    /// @param _lat Decimal latitude string for the coverage location.
    /// @param _lon Decimal longitude string for the coverage location.
    /// @return policyId The new policy's id.
    function buyPolicy(
        string calldata _date,
        uint256 _rainThresholdMmE2,
        uint256 _payout,
        uint256 _premium,
        string calldata _lat,
        string calldata _lon
    ) external returns (uint256 policyId);

    /// @notice Request a private policy buy. Policy terms are ECIES-encrypted under the TEE public key.
    /// @dev ECIES: https://en.wikipedia.org/wiki/Elliptic-curve_cryptography — ciphertext is decrypted only
    ///      inside the TEE; the extension validates terms and signs ActionResult for relayPrivateBuy.
    ///      Sends a WEATHER/BUY instruction via the TEE registry. Emits `PrivateBuyRequested`.
    ///      After the TEE processes the instruction, call `relayPrivateBuy` with the signed ActionResult.
    /// @param _encryptedPolicy ECIES ciphertext of ABI-encoded PrivateBuyParams.
    function buyPolicyPrivate(bytes calldata _encryptedPolicy) external payable;

    /// @notice Finalize a private buy with a TEE-signed result from the BUY instruction.
    /// @dev The TEE signs `ActionResult.Hash()` with its registered key. `_resultData` is
    ///      ActionResult.Data: abi.encode(address holder, address contractAddr, string date,
    ///      uint256 rainThresholdMmE2, uint256 payout, uint256 premium, string lat,
    ///      string lon).
    ///      - holder: policy buyer; must equal msg.sender.
    ///      - contractAddr: target WeatherInsurance; must equal address(this).
    ///      - date: coverage date as "YYYY-MM-DD".
    ///      - rainThresholdMmE2: rainfall trigger threshold in mm × 100 (e.g. 100 = 1.00 mm).
    ///      - payout: payToken paid to holder if triggered.
    ///      - premium: payToken pulled from holder at relay (caller must approve first).
    ///      - lat: latitude for settlement weather fetch.
    ///      - lon: longitude for settlement weather fetch.
    /// @param _resultData     ActionResult.Data bytes (the private-buy payload).
    /// @param _actionId       ActionResult.ID.
    /// @param _submissionTag  ActionResult.SubmissionTag (e.g. "submit").
    /// @param _status         ActionResult.Status (1 = success).
    /// @param _signature      TEE node signature over ActionResult.Hash().
    /// @return policyId The new policy's id.
    function relayPrivateBuy(
        bytes calldata _resultData,
        bytes32 _actionId,
        string calldata _submissionTag,
        uint8 _status,
        bytes calldata _signature
    ) external returns (uint256 policyId);

    /// @notice Ask the TEE to settle a policy by fetching its date's rainfall.
    /// @dev Sends a WEATHER/SETTLE instruction. Emits `SettlementRequested`.
    ///      Off-chain timing (after 18:00 Berlin on the coverage date) is enforced by the keeper.
    /// @param _policyId Id of the policy to settle.
    function requestSettlement(uint256 _policyId) external payable;

    /// @notice Finalize a policy with a TEE-signed settlement and pay out if triggered.
    /// @dev The TEE signs `ActionResult.Hash()` with its registered key. `_resultData` is
    ///      ActionResult.Data: abi.encode(address contractAddr, uint256 policyId,
    ///      uint256 precipitationMmE2, string date, bool triggered).
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
    ) external;

    /// @notice Returns the policy record for `_policyId`.
    function policies(uint256 _policyId) external view returns (Policy memory);

    /// @notice Total number of policies created (next id equals this value).
    function policyCount() external view returns (uint256);

    /// @notice ERC-20 used for premiums and payouts.
    function payToken() external view returns (address);

    /// @notice Registered TEE signing address; settlements must be signed by it.
    function teeAddress() external view returns (address);

    /// @notice Emitted when a settlement instruction is sent to the TEE.
    event SettlementRequested(uint256 indexed policyId, bytes32 instructionId);

    /// @notice Emitted when a policy is finalized on-chain after TEE settlement.
    event Settled(uint256 indexed policyId, uint256 measuredMmE2, bool paidOut);
}
