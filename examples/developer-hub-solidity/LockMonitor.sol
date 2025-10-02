// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IBalanceDecreasingTransaction} from "@flarenetwork/flare-periphery-contracts/coston2/IBalanceDecreasingTransaction.sol";

contract LockMonitor {
    // Business logic: stores which addresses are being monitored
    mapping(bytes32 => bool) public lockedAddresses;
    // Business logic: prevents re-processing the same violation proof
    mapping(bytes32 => bool) public confirmedViolations;

    event ViolationConfirmed(
        bytes32 indexed transactionId,
        bytes32 indexed sourceAddressHash
    );

    function registerLockedAddress(bytes32 sourceAddressHash) external {
        lockedAddresses[sourceAddressHash] = true;
    }
    function processViolationProof(
        IBalanceDecreasingTransaction.Proof calldata _proof
    ) external {
        // 1. FDC Logic: Verify the proof's authenticity with the Flare network.
        require(isProofValid(_proof), "Invalid transaction proof");

        // 2. Business Logic: Execute actions based on the verified proof data.
        bytes32 sourceAddressHash = _proof.data.responseBody.sourceAddressHash;
        int256 spentAmount = _proof.data.responseBody.spentAmount;
        bytes32 transactionId = _proof.data.requestBody.transactionId;

        // Check if a monitored address spent funds (a violation).
        if (lockedAddresses[sourceAddressHash] && spentAmount > 0) {
            require(
                !confirmedViolations[transactionId],
                "Violation already confirmed"
            );

            // Take action: log the violation and update state.
            confirmedViolations[transactionId] = true;
            lockedAddresses[sourceAddressHash] = false; // Example: remove from monitoring after violation.

            emit ViolationConfirmed(transactionId, sourceAddressHash);
        }
    }

    function isProofValid(
        IBalanceDecreasingTransaction.Proof memory _proof
    ) public view returns (bool) {
        IFdcVerification fdcVerification = ContractRegistry
            .getFdcVerification();
        return fdcVerification.verifyBalanceDecreasingTransaction(_proof);
    }
}
