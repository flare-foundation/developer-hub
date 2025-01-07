// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEVMTransactionVerification} from "@flarenetwork/flare-periphery-contracts/coston/IEVMTransactionVerification.sol";
import {IEVMTransaction} from "@flarenetwork/flare-periphery-contracts/coston/IEVMTransaction.sol";
import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston/ContractRegistry.sol";

struct EventInfo {
    address sender;
    uint256 value;
    bytes data;
}

struct TokenTransfer {
    address from;
    address to;
    uint256 value;
}

contract TransferEventListener {
    TokenTransfer[] public tokenTransfers;
    address public USDC_CONTRACT = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238; // USDC contract address on sepolia

    function isEVMTransactionProofValid(
        IEVMTransaction.Proof calldata transaction
    ) public view returns (bool) {
        // Use the library to get the verifier contract and verify that this transaction was proved by state connector
        return
            ContractRegistry
                .auxiliaryGetIEVMTransactionVerification()
                .verifyEVMTransaction(transaction);
    }

    function collectTransferEvents(
        IEVMTransaction.Proof calldata _transaction
    ) external {
        // 1. FDC Logic
        // Check that this EVMTransaction has indeed been confirmed by the FDC
        require(
            isEVMTransactionProofValid(_transaction),
            "Invalid transaction proof"
        );

        // 2. Business logic
        // Go through all events
        for (
            uint256 i = 0;
            i < _transaction.data.responseBody.events.length;
            i++
        ) {
            // Get current event
            IEVMTransaction.Event memory _event = _transaction
                .data
                .responseBody
                .events[i];

            // Disregard events that are not from the USDC contract
            if (_event.emitterAddress != USDC_CONTRACT) {
                continue;
            }

            // Disregard non Transfer events
            if (
                _event.topics.length == 0 || // No topics
                // The topic0 doesn't match the Transfer event
                _event.topics[0] !=
                keccak256(abi.encodePacked("Transfer(address,address,uint256)"))
            ) {
                continue;
            }

            // We now know that this is a Transfer event from the USDC contract - and therefore know how to decode topics and data
            // Topic 1 is the sender
            address sender = address(uint160(uint256(_event.topics[1])));
            // Topic 2 is the receiver
            address receiver = address(uint160(uint256(_event.topics[2])));
            // Data is the amount
            uint256 value = abi.decode(_event.data, (uint256));

            // Add the transfer to the list
            tokenTransfers.push(
                TokenTransfer({from: sender, to: receiver, value: value})
            );
        }
    }

    function getTokenTransfers()
        external
        view
        returns (TokenTransfer[] memory)
    {
        TokenTransfer[] memory result = new TokenTransfer[](
            tokenTransfers.length
        );
        for (uint256 i = 0; i < tokenTransfers.length; i++) {
            result[i] = tokenTransfers[i];
        }
        return result;
    }
}
