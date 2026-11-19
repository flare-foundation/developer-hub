// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ExtensionBase } from "fcc-extension-scaffold/src/ExtensionBase.sol";

/// @title InstructionSender
/// @notice The extension's entrypoint contract: it sends the extension's instructions to its
/// TEE machines.
/// @dev NOTE: the deployer owns this contract, with the project fee and its withdrawal, and,
/// through fce deploy, the extension in the registry, which decides what code its machines run.
/// Secure that key, or move both (for example to a multisig), before production.
/// TODO: replace the placeholder command with your extension's.
contract InstructionSender is ExtensionBase {
    /// @notice The extension's op type, the Go side's OPTypeMyExtension.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_TYPE_MY_EXTENSION = bytes32("MY_EXTENSION");

    /// @notice MY_COMMAND, the Go side's OPCommandMyCommand.
    // forge-lint: disable-next-line(unsafe-typecast)
    bytes32 public constant OP_COMMAND_MY_COMMAND = bytes32("MY_COMMAND");

    /// @param _flareTeeManager The FlareTeeManager diamond's address.
    constructor(address _flareTeeManager) ExtensionBase(_flareTeeManager) { }

    /// @notice Sends MY_COMMAND with `_message`. Pay at least
    /// quoteFee(OP_TYPE_MY_EXTENSION, OP_COMMAND_MY_COMMAND); the contract keeps any excess.
    /// @dev The payload carries the caller: tee-node doesn't pass it to the extension.
    function myCommand(bytes calldata _message) external payable chargesFees returns (bytes32) {
        return _send(OP_TYPE_MY_EXTENSION, OP_COMMAND_MY_COMMAND, abi.encode(msg.sender, _message));
    }
}
