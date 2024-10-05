// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;

import {RandomNumberV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/RandomNumberV2Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
/**
 * @title LotteryWithRandomNumber
 * @notice A lottery contract that utilizes a secure random number for determining winners.
 */
contract LotteryWithRandomNumber {
    RandomNumberV2Interface internal randomNumberGenerator;

    address[] public participants;
    uint256 public lotteryId;
    uint256 public lotteryEndTimestamp;

    // Event to log lottery results
    event LotteryDrawn(uint256 indexed lotteryId, address winner, uint256 randomNumber, uint256 timestamp);

    /**
     * @notice Initializes the contract with the address of the random number generator.
     * @param _randomNumberGenerator The address of the RandomNumberV2Interface contract.
     */
    constructor(address _randomNumberGenerator) {
        randomNumberGenerator = RandomNumberV2Interface(_randomNumberGenerator);
    }

    /**
     * @notice Enter the lottery.
     * Participants can enter the lottery before it ends.
     */
    function enterLottery() external {
        require(block.timestamp < lotteryEndTimestamp, "Lottery has ended");
        participants.push(msg.sender);
    }

    /**
     * @notice Start a new lottery round.
     * This resets participants and sets the lottery end time.
     * @param duration The duration of the lottery in seconds.
     */
    function startLottery(uint256 duration) external {
        require(participants.length == 0, "Previous lottery must be concluded first");
        lotteryId++;
        lotteryEndTimestamp = block.timestamp + duration;
    }

    /**
     * @notice Draw the winner of the lottery.
     * Requires the lottery to be over and retrieves a secure random number to select the winner.
     */
    function drawLottery() external {
        require(block.timestamp >= lotteryEndTimestamp, "Lottery is still ongoing");
        require(participants.length > 0, "No participants in the lottery");

        // Get the current random number and its properties
        (uint256 randomNumber, bool isSecureRandom, uint256 randomTimestamp) = randomNumberGenerator.getRandomNumber();

        // Use the random number to select a winner
        uint256 winnerIndex = randomNumber % participants.length;
        address winner = participants[winnerIndex];

        // Emit the lottery result
        emit LotteryDrawn(lotteryId, winner, randomNumber, randomTimestamp);

        // Reset participants for the next lottery round
        delete participants;
    }

    /**
     * @notice Get the current number of participants.
     * @return count The number of participants currently in the lottery.
     */
    function getParticipantCount() external view returns (uint256 count) {
        return participants.length;
    }

    /**
     * @notice Get the current lottery status.
     * @return currentLotteryId The current lottery ID.
     * @return endTimestamp The timestamp when the lottery ends.
     */
    function getLotteryStatus() external view returns (uint256 currentLotteryId, uint256 endTimestamp) {
        return (lotteryId, lotteryEndTimestamp);
    }
}