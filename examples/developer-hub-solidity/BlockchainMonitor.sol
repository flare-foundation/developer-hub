// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IConfirmedBlockHeightExists} from "@flarenetwork/flare-periphery-contracts/coston2/IConfirmedBlockHeightExists.sol";

contract BlockchainMonitor {
    uint64 public latestAverageBlockTimeSeconds;

    event BlockTimeCalculated(
        uint64 indexed blockNumber,
        uint64 averageBlockTime
    );

    function processBlockHeightProof(
        IConfirmedBlockHeightExists.Proof calldata _proof
    ) external {
        // 1. FDC Logic: Verify the proof's authenticity with the Flare network.
        require(isProofValid(_proof), "Invalid block height proof");

        // 2. Business Logic: Execute actions based on the verified proof data.
        uint64 blockNumber = _proof.data.requestBody.blockNumber;
        uint64 blockTimestamp = _proof.data.responseBody.blockTimestamp;
        uint64 lowestNumber = _proof
            .data
            .responseBody
            .lowestQueryWindowBlockNumber;
        uint64 lowestTimestamp = _proof
            .data
            .responseBody
            .lowestQueryWindowBlockTimestamp;

        uint64 avgBlockTimeSeconds = 0;
        if (blockNumber > lowestNumber) {
            uint64 blocksProduced = blockNumber - lowestNumber;
            uint64 timeElapsed = blockTimestamp - lowestTimestamp;
            avgBlockTimeSeconds = timeElapsed / blocksProduced;
        }

        // Take action: update state and emit an event with the new data.
        latestAverageBlockTimeSeconds = avgBlockTimeSeconds;
        emit BlockTimeCalculated(blockNumber, avgBlockTimeSeconds);
    }

    function isProofValid(
        IConfirmedBlockHeightExists.Proof memory _proof
    ) public view returns (bool) {
        IFdcVerification fdcVerification = ContractRegistry
            .getFdcVerification();
        return fdcVerification.verifyConfirmedBlockHeightExists(_proof);
    }
}
