// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IPayment} from "@flarenetwork/flare-periphery-contracts/coston2/IPayment.sol";

contract PaymentVerifier {
    // A struct to store the details of a successfully verified payment.
    struct VerifiedPayment {
        bytes32 transactionId;
        bytes32 sourceAddressHash;
        bytes32 receivingAddressHash;
        int256 receivedAmount;
        bytes32 standardPaymentReference;
    }

    // A public array to keep a log of all payments verified by this contract.
    VerifiedPayment[] public verifiedPayments;
    // A mapping to prevent the same transaction proof from being processed more than once.
    mapping(bytes32 => bool) public processedTransactions;

    event PaymentVerified(
        bytes32 indexed transactionId,
        bytes32 indexed sourceAddressHash,
        bytes32 indexed receivingAddressHash,
        int256 receivedAmount,
        bytes32 standardPaymentReference
    );

    function processPaymentProof(IPayment.Proof calldata _proof) external {
        // 1. FDC Logic: Verify the proof's authenticity with the Flare network.
        require(isProofValid(_proof), "Invalid payment proof");

        // 2. Business Logic: Execute actions based on the verified proof data.
        bytes32 transactionId = _proof.data.requestBody.transactionId;
        IPayment.ResponseBody memory response = _proof.data.responseBody;

        // Ensure the payment was successful (status 0) and hasn't been processed before.
        require(response.status == 0, "Payment status not successful");
        require(
            !processedTransactions[transactionId],
            "Payment already processed"
        );

        // Take action: update state, store the payment details, and emit an event.
        processedTransactions[transactionId] = true;

        verifiedPayments.push(
            VerifiedPayment({
                transactionId: transactionId,
                sourceAddressHash: response.sourceAddressHash,
                receivingAddressHash: response.receivingAddressHash,
                receivedAmount: response.receivedAmount,
                standardPaymentReference: response.standardPaymentReference
            })
        );

        emit PaymentVerified(
            transactionId,
            response.sourceAddressHash,
            response.receivingAddressHash,
            response.receivedAmount,
            response.standardPaymentReference
        );
    }

    function isProofValid(
        IPayment.Proof memory _proof
    ) public view returns (bool) {
        IFdcVerification fdcVerification = ContractRegistry
            .getFdcVerification();
        return fdcVerification.verifyPayment(_proof);
    }
}
