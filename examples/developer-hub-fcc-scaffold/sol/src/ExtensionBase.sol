// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Ownable, Ownable2Step } from "@openzeppelin-contracts/access/Ownable2Step.sol";
import { ECDSA } from "@openzeppelin-contracts/utils/cryptography/ECDSA.sol";
import { MessageHashUtils } from "@openzeppelin-contracts/utils/cryptography/MessageHashUtils.sol";
import { IExtensionManager } from "flare-periphery/src/coston2/IExtensionManager.sol";
import { IInstructions } from "flare-periphery/src/coston2/IInstructions.sol";
import { IMachineEmergencyPause } from "flare-periphery/src/coston2/IMachineEmergencyPause.sol";
import { IMachineManager } from "flare-periphery/src/coston2/IMachineManager.sol";
import { IOperationFees } from "flare-periphery/src/coston2/IOperationFees.sol";

/// @title ExtensionBase
/// @notice The base of an extension's entrypoint contract: it binds the contract to its
/// extension id, sends instructions to the extension's TEE machines for the protocol fee plus
/// an optional project fee, keeps any excess for the owner to withdraw, and checks a TEE's
/// signature.
/// @dev A shared part of the scaffold: forks leave it unchanged and merge fixes from upstream.
abstract contract ExtensionBase is Ownable2Step {
    /// @notice The FlareTeeManager diamond, which serves every TEE facet.
    address public immutable flareTeeManager;

    /// @notice The extension id, set once by setExtensionId; 0 until then.
    uint256 public extensionId;

    /// @notice What the contract keeps per instruction, on top of the protocol fee.
    uint256 public projectFee;

    // set by chargesFees for the function it wraps: what is left of msg.value
    bool private transient charging;
    uint256 private transient budget;

    event ExtensionIdSet(uint256 extensionId);
    event ProjectFeeSet(uint256 projectFee);
    event Withdrawn(address indexed to, uint256 amount);

    error NoCode(address account);
    error ExtensionIdAlreadySet(uint256 extensionId);
    error NotInstructionsSender(uint256 extensionId);
    error ExtensionIdNotSet();
    error InsufficientFee(uint256 price, uint256 available);
    error DuplicateTee(address teeId);
    error NotCharging();
    error NestedCharge();
    error WithdrawFailed();
    error SignerNotExtensionTee(address signer);
    error SignerNotInProduction(address signer);
    error ExtensionEmergencyPaused();

    /// @notice Lets a function send instructions: msg.value pays for every _send it makes, and
    /// the contract keeps what they leave, with the project fees. Every function that calls _send
    /// needs it; it can't be nested.
    modifier chargesFees() {
        require(!charging, NestedCharge());
        charging = true;
        budget = msg.value;
        _;
        // transient storage lasts the whole transaction, not just this call
        charging = false;
        budget = 0;
    }

    /// @param _flareTeeManager The FlareTeeManager diamond's address.
    constructor(address _flareTeeManager) Ownable(msg.sender) {
        require(_flareTeeManager.code.length > 0, NoCode(_flareTeeManager));
        flareTeeManager = _flareTeeManager;
    }

    /// @notice Binds the contract to its extension id, once, and only an id whose registered
    /// instructions sender is this contract. Owner only: anyone may register an extension naming
    /// this contract, and binding theirs would hand it their machines.
    /// @param _id The id ExtensionManager.register returned.
    function setExtensionId(uint256 _id) external onlyOwner {
        require(extensionId == 0, ExtensionIdAlreadySet(extensionId));
        require(
            IExtensionManager(flareTeeManager).getTeeExtensionInstructionsSender(_id) == address(this),
            NotInstructionsSender(_id)
        );
        extensionId = _id;
        emit ExtensionIdSet(_id);
    }

    /// @notice Sets the project fee; 0 charges only the protocol fee.
    function setProjectFee(uint256 _fee) external onlyOwner {
        projectFee = _fee;
        emit ProjectFeeSet(_fee);
    }

    /// @notice Sends the contract's whole balance, the collected project fees and any excess
    /// callers paid, to `_to`.
    function withdraw(address payable _to) external onlyOwner {
        uint256 amount = address(this).balance;
        emit Withdrawn(_to, amount);
        (bool ok,) = _to.call{ value: amount }("");
        require(ok, WithdrawFailed());
    }

    /// @notice The price of one instruction to one TEE: the protocol fee plus projectFee.
    /// A send must pay at least this; the contract keeps any excess.
    function quoteFee(bytes32 _opType, bytes32 _opCommand) public view returns (uint256) {
        return _protocolFee(_opType, _opCommand, _randomTee()) + projectFee;
    }

    /// @dev Sends `_message` as _opType / _opCommand to one random TEE of the extension, with
    /// no cosigners and the caller as claim-back address.
    function _send(bytes32 _opType, bytes32 _opCommand, bytes memory _message) internal returns (bytes32) {
        return _send(_randomTee(), _opType, _opCommand, _message);
    }

    /// @dev Sends `_message` as _opType / _opCommand to `_teeIds`, which must be distinct, with no
    /// cosigners and the caller as claim-back address.
    function _send(address[] memory _teeIds, bytes32 _opType, bytes32 _opCommand, bytes memory _message)
        internal
        returns (bytes32)
    {
        return _send(
            _teeIds,
            IInstructions.TeeInstructionParams({
                opType: _opType,
                opCommand: _opCommand,
                message: _message,
                cosigners: new address[](0),
                cosignersThreshold: 0,
                claimBackAddress: msg.sender
            })
        );
    }

    /// @dev Sends an instruction with explicit TEEs and parameters, inside a chargesFees
    /// function. It takes the price for those TEEs from what is left of msg.value, forwards
    /// exactly the protocol fee and keeps projectFee. The TEEs must be distinct.
    function _send(address[] memory _teeIds, IInstructions.TeeInstructionParams memory _params)
        internal
        returns (bytes32)
    {
        require(charging, NotCharging());
        // the platform charges a repeated TEE once but keeps all it is sent
        for (uint256 i = 1; i < _teeIds.length; ++i) {
            for (uint256 j; j < i; ++j) {
                require(_teeIds[i] != _teeIds[j], DuplicateTee(_teeIds[i]));
            }
        }
        uint256 protocolFee = _protocolFee(_params.opType, _params.opCommand, _teeIds);
        uint256 price = protocolFee + projectFee;
        require(budget >= price, InsufficientFee(price, budget));
        budget -= price;

        // sendInstructions keeps all it is sent
        return IInstructions(flareTeeManager).sendInstructions{ value: protocolFee }(_teeIds, _params);
    }

    function _protocolFee(bytes32 _opType, bytes32 _opCommand, address[] memory _teeIds)
        internal
        view
        returns (uint256)
    {
        return IOperationFees(flareTeeManager).calculateFeeByTeeIds(_opType, _opCommand, _teeIds);
    }

    function _randomTee() internal view returns (address[] memory) {
        require(extensionId != 0, ExtensionIdNotSet());
        return IMachineManager(flareTeeManager).getRandomTeeIds(extensionId, 1);
    }

    /// @dev The TEE that signed `_digest`, the keccak256 of a message the extension signed through
    /// tee-node's sign port (EIP-191), refusing any signer that isn't a production TEE of this
    /// extension, or while the extension is emergency-paused.
    function _teeSigner(bytes32 _digest, bytes memory _signature) internal view returns (address _teeId) {
        _teeId = ECDSA.recover(MessageHashUtils.toEthSignedMessageHash(_digest), _signature);
        require(
            !IMachineEmergencyPause(flareTeeManager).isExtensionEmergencyPaused(extensionId), ExtensionEmergencyPaused()
        );
        // an unknown signer reverts here, with the registry's TeeNotFound
        require(IMachineManager(flareTeeManager).getExtensionId(_teeId) == extensionId, SignerNotExtensionTee(_teeId));
        require(
            IMachineManager(flareTeeManager).getTeeMachineStatus(_teeId) == IMachineManager.TeeStatus.PRODUCTION,
            SignerNotInProduction(_teeId)
        );
    }
}
