// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IReferencedPaymentNonexistence} from "@flarenetwork/flare-periphery-contracts/coston2/IReferencedPaymentNonexistence.sol";

contract PaymentDeadlineEnforcer {
    struct Agreement {
        bytes32 destinationAddressHash;
        uint256 amount;
        bytes32 paymentReference;
        uint64 startBlockNumber;
        uint64 deadlineBlockNumber;
        uint64 deadlineTimestamp;
        bool checkSourceAddresses;
        bytes32 sourceAddressesRoot;
        bool liquidated;
    }

    mapping(uint256 => Agreement) public agreements;
    uint256 public nextAgreementId;

    event AgreementCreated(
        uint256 indexed agreementId,
        bytes32 indexed paymentReference
    );
    event AgreementLiquidated(
        uint256 indexed agreementId,
        bytes32 indexed paymentReference
    );

    function createAgreement(
        bytes32 destinationAddressHash,
        uint256 amount,
        bytes32 paymentReference,
        uint64 startBlockNumber,
        uint64 deadlineBlockNumber,
        uint64 deadlineTimestamp,
        bool checkSourceAddresses,
        bytes32 sourceAddressesRoot
    ) external returns (uint256 agreementId) {
        require(
            paymentReference != bytes32(0),
            "Payment reference cannot be zero"
        );
        agreementId = nextAgreementId++;

        agreements[agreementId] = Agreement({
            destinationAddressHash: destinationAddressHash,
            amount: amount,
            paymentReference: paymentReference,
            startBlockNumber: startBlockNumber,
            deadlineBlockNumber: deadlineBlockNumber,
            deadlineTimestamp: deadlineTimestamp,
            checkSourceAddresses: checkSourceAddresses,
            sourceAddressesRoot: sourceAddressesRoot,
            liquidated: false
        });

        emit AgreementCreated(agreementId, paymentReference);
        return agreementId;
    }
    function processMissedPaymentProof(
        uint256 _agreementId,
        IReferencedPaymentNonexistence.Proof calldata _proof
    ) external {
        Agreement storage agreement = agreements[_agreementId];
        require(!agreement.liquidated, "Agreement already liquidated");

        // 1. FDC Logic: Verify the proof's authenticity with the Flare network.
        require(isProofValid(_proof), "Invalid payment non-existence proof");

        // 2. Business Logic: Ensure the proof corresponds to the correct on-chain agreement.
        IReferencedPaymentNonexistence.RequestBody memory request = _proof
            .data
            .requestBody;
        require(
            request.standardPaymentReference == agreement.paymentReference,
            "Proof reference mismatch"
        );
        require(
            request.destinationAddressHash == agreement.destinationAddressHash,
            "Proof destination mismatch"
        );
        require(request.amount == agreement.amount, "Proof amount mismatch");
        require(
            request.deadlineBlockNumber == agreement.deadlineBlockNumber,
            "Proof deadline block mismatch"
        );
        require(
            request.deadlineTimestamp == agreement.deadlineTimestamp,
            "Proof deadline timestamp mismatch"
        );

        // Take action: liquidate the agreement.
        agreement.liquidated = true;
        emit AgreementLiquidated(_agreementId, agreement.paymentReference);
    }
    function isProofValid(
        IReferencedPaymentNonexistence.Proof memory _proof
    ) public view returns (bool) {
        IFdcVerification fdcVerification = ContractRegistry
            .getFdcVerification();
        return fdcVerification.verifyReferencedPaymentNonexistence(_proof);
    }
}
