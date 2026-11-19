// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { Script } from "forge-std/src/Script.sol";
import { InstructionSender } from "../src/InstructionSender.sol";

/// @title PostRegister
/// @notice Runs after ExtensionManager.register: binds INSTRUCTION_SENDER to EXTENSION_ID.
/// Re-running it with the same id changes nothing.
contract PostRegister is Script {
    function run() external {
        InstructionSender sender = InstructionSender(vm.envAddress("INSTRUCTION_SENDER"));
        uint256 id = vm.envUint("EXTENSION_ID");
        if (sender.extensionId() == id) return;

        vm.startBroadcast();
        sender.setExtensionId(id);
        vm.stopBroadcast();
    }
}
