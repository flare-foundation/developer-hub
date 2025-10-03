// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IEVMTransaction} from "@flarenetwork/flare-periphery-contracts/coston2/IEVMTransaction.sol";

contract EVMTransactionVerifier {
    // A struct to hold the data from a verified ERC-20 transfer
    struct VerifiedTransfer {
        address tokenContract;
        address from;
        address to;
        uint256 amount;
        bytes32 transactionHash;
    }

    // An array to store all transfers verified by this contract
    VerifiedTransfer[] public verifiedTransfers;

    // The signature of the ERC-20 Transfer event
    bytes32 private constant EVENT_TRANSFER_SIGNATURE =
        keccak256(abi.encodePacked("Transfer(address,address,uint256)"));

    event TransferVerified(
        bytes32 indexed transactionHash,
        address indexed tokenContract,
        address from,
        address to,
        uint256 amount
    );

    function processTransactionProof(
        IEVMTransaction.Proof calldata _proof,
        address _tokenContract
    ) external {
        // 1. FDC Logic: Verify the proof's authenticity with the Flare network.
        require(isProofValid(_proof), "Invalid EVM transaction proof");
        require(
            _proof.data.responseBody.status == 1,
            "Transaction reverted or not found"
        );

        // 2. Business Logic: Iterate through events to find and record ERC-20 transfers.
        IEVMTransaction.Event[] memory events = _proof.data.responseBody.events;
        bytes32 txHash = _proof.data.requestBody.transactionHash;

        for (uint i = 0; i < events.length; i++) {
            IEVMTransaction.Event memory evt = events[i];

            // Filter for the specific token contract if provided
            if (
                _tokenContract != address(0) &&
                evt.emitterAddress != _tokenContract
            ) {
                continue;
            }

            // Check if the event is an ERC-20 Transfer: Transfer(address,address,uint256)
            if (
                evt.topics.length == 3 &&
                evt.topics[0] == EVENT_TRANSFER_SIGNATURE
            ) {
                // Decode the event data
                address from = address(uint160(uint256(evt.topics[1])));
                address to = address(uint160(uint256(evt.topics[2])));
                uint256 amount = abi.decode(evt.data, (uint256));

                // Record the verified transfer
                verifiedTransfers.push(
                    VerifiedTransfer({
                        tokenContract: evt.emitterAddress,
                        from: from,
                        to: to,
                        amount: amount,
                        transactionHash: txHash
                    })
                );

                emit TransferVerified(
                    txHash,
                    evt.emitterAddress,
                    from,
                    to,
                    amount
                );
            }
        }
    }

    function isProofValid(
        IEVMTransaction.Proof memory _proof
    ) public view returns (bool) {
        IFdcVerification fdcVerification = ContractRegistry
            .getFdcVerification();
        return fdcVerification.verifyEVMTransaction(_proof);
    }
}
