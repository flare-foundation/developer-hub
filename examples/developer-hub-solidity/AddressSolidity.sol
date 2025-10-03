// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IAddressValidity} from "@flarenetwork/flare-periphery-contracts/coston2/IAddressValidity.sol";

interface IAddressRegistry {
    function registerAddress(
        IAddressValidity.Proof memory _transaction
    ) external;
}

contract AddressRegistry is IAddressRegistry {
    string[] public verifiedAddresses;

    function registerAddress(
        IAddressValidity.Proof memory _transaction
    ) public {
        // 1. FDC Logic
        // Check that this AddressValidity has indeed been confirmed by the FDC
        require(
            isAddressValidityProofValid(_transaction),
            "Invalid transaction proof"
        );

        // 2. Business logic
        string memory provedAddress = _transaction.data.requestBody.addressStr;

        verifiedAddresses.push(provedAddress);
    }

    function isAddressValidityProofValid(
        IAddressValidity.Proof memory transaction
    ) public view returns (bool) {
        // Use the library to get the verifier contract and verify that this transaction was proved by state connector
        IFdcVerification fdc = ContractRegistry.getFdcVerification();
        return fdc.verifyAddressValidity(transaction);
    }
}
