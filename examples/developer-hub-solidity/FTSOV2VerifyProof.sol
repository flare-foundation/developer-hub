// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/FtsoV2Interface.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title FtsoV2FeedVerifier
 * @notice A contract to verify the validity of feed data against a confirmed Merkle tree.
 */
contract FtsoV2FeedVerifier {
    FtsoV2Interface internal ftsoV2;

    /**
     * Constructor initializes the FTSOv2 contract.
     */
    constructor() {
        // THIS IS A TEST METHOD, in production use: ftsoV2 = ContractRegistry.getFtsoV2();
        ftsoV2 = ContractRegistry.getTestFtsoV2();
    }

    /**
     * @notice Verify if the provided feed data is valid based on the Merkle proof.
     * @param _feedData The FeedDataWithProof structure containing feed data and proof.
     * @return isValid Returns true if the feed data is valid, false otherwise.
     */
    function verifyFeedData(FtsoV2Interface.FeedDataWithProof calldata _feedData)
        external
        view
        returns (bool isValid)
    {
        // Pack the relevant feed data fields into a hash
        bytes32 leaf = keccak256(abi.encodePacked(
            _feedData.body.votingRoundId,
            _feedData.body.id,
            _feedData.body.value,
            _feedData.body.turnoutBIPS,
            _feedData.body.decimals
        ));

        // Verify the Merkle proof against the leaf and root
        isValid = MerkleProof.verify(_feedData.proof, _feedData.merkleRoot, leaf);
    }

}