// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { IFlareContractRegistry } from "flare-periphery/src/coston2/IFlareContractRegistry.sol";
import { Script } from "forge-std/src/Script.sol";
import { InstructionSender } from "../src/InstructionSender.sol";

/// @title Deploy
/// @notice Deploys the extension's contracts and writes their addresses, as JSON, to
/// DEPLOY_OUTPUT, a path under deployments/: forge may write only there, and creates only
/// deployments/ itself.
/// FLARE_TEE_MANAGER overrides the FlareTeeManager address found in Flare's contract
/// registry; a chain without the registry, such as anvil, needs it.
contract Deploy is Script {
    /// @notice Flare's contract registry, at the same address on every Flare network.
    IFlareContractRegistry public constant REGISTRY =
        IFlareContractRegistry(0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019);

    function run() external {
        address manager = vm.envOr("FLARE_TEE_MANAGER", address(0));
        if (manager == address(0)) {
            manager = REGISTRY.getContractAddressByName("FlareTeeManager");
        }

        vm.startBroadcast();
        InstructionSender sender = deploy(manager);
        vm.stopBroadcast();

        vm.createDir("deployments", true);
        vm.writeJson(vm.serializeAddress("deploy", "instructionSender", address(sender)), vm.envString("DEPLOY_OUTPUT"));
    }

    /// @notice Deploys the contracts against the FlareTeeManager at `_manager`.
    function deploy(address _manager) public returns (InstructionSender) {
        return new InstructionSender(_manager);
    }
}
