// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9;

// TODO: Replace this minimal interface with the full import once flare-smart-contracts-v2
// is published as a package:
//   import { ITeeExtensionRegistry } from "flare-smart-contracts-v2/contracts/userInterfaces/tee/ITeeExtensionRegistry.sol";
interface ITeeExtensionRegistry {
    struct TeeInstructionParams {
        bytes32 opType;
        bytes32 opCommand;
        bytes message;
        address[] cosigners;
        uint64 cosignersThreshold;
        address claimBackAddress;
    }

    function sendInstructions(
        address[] calldata _teeIds,
        TeeInstructionParams calldata _instructionParams
    ) external payable returns (bytes32 _instructionId);

    function extensionsCounter() external view returns (uint256);

    function getTeeExtensionInstructionsSender(uint256 _extensionId)
        external view returns (address);
}
