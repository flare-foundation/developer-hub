// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IAddressValidity} from "@flarenetwork/flare-periphery-contracts/coston2/IAddressValidity.sol";

contract AddressVerifier {
    // On-chain business logic: stores the verification status of an address string.
    mapping(string => bool) public isAddressVerified;

    event AddressVerified(
        string indexed addressStr,
        string standardAddress,
        bytes32 standardAddressHash
    );

    function processAddressProof(
        IAddressValidity.Proof calldata _proof
    ) external {
        // 1. FDC Logic: Verify the proof's authenticity with the Flare network.
        require(isProofValid(_proof), "Invalid address validity proof");

        // 2. Business Logic: Execute actions based on the verified proof data.
        bool isValid = _proof.data.responseBody.isValid;
        string calldata originalAddress = _proof.data.requestBody.addressStr;

        // Only take action if the FDC confirms the address is valid.
        if (isValid) {
            // Take action: update state and emit an event.
            isAddressVerified[originalAddress] = true;

            emit AddressVerified(
                originalAddress,
                _proof.data.responseBody.standardAddress,
                _proof.data.responseBody.standardAddressHash
            );
        }
    }

    function isProofValid(
        IAddressValidity.Proof memory _proof
    ) public view returns (bool) {
        IFdcVerification fdcVerification = ContractRegistry
            .getFdcVerification();
        return fdcVerification.verifyAddressValidity(_proof);
    }
}
