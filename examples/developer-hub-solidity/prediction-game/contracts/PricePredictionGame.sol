// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * A PricePrediction Smart Contract
 */
contract PricePredictionGame {
    struct Bet {
        uint256 predictedPrice;  // Price in 6 decimals (e.g., 16602 for $0.016602)
        uint256 amount;
        address bettor;
        bool exists;
    }

    struct Winners{
        address bettor;
        uint256 prizeAmount;
    }

    address public owner;// Owner's address
    uint256 public roundId;
    uint256 public bettingEndTime;
    uint256 public minimumBet;
    uint256 public totalStake;

    bool public roundActive;
    mapping(uint256 => Bet[]) public roundBets;
    mapping(uint256 => Winners[]) public roundWinners;
    mapping(uint256 => mapping(address => bool)) public hasPlacedBet;
    mapping(uint256 => bool) public roundFinished;

    event BetPlaced(uint256 roundId, address bettor, uint256 predictedPrice, uint256 amount);
    event RoundStarted(uint256 roundId, uint256 endTime, uint256 minimumBet);
    event WinnerDetermined(uint256 roundId, address[] winners, uint256 actualPrice, uint256 prizeAmount);
    event NewRoundStarted(uint256 roundId, uint256 startTime, uint256 endTime);
    event NoWinner(uint256 roundId, uint256 actualPrice, uint256 transferredAmount);

    constructor(uint256 _minimumBet) {
        owner = msg.sender;
        minimumBet = _minimumBet;
        roundId = 1;
        roundActive = false; // Ensure we start with no active round
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Start new game round.
     * @param _duration Duration of the round in seconds
     */
    function startNewRound(uint256 _duration) external {
        require(!roundActive, "Current round still active");
        require(_duration > 0, "Duration must be greater than 0");

        // Clear previous round data if exists
        if (roundId > 1) {
            require(roundFinished[roundId - 1], "Previous round not finished");
        }

        bettingEndTime = block.timestamp + _duration;
        roundActive = true;
        totalStake = 0;

        emit RoundStarted(roundId, bettingEndTime, minimumBet);
    }

    /**
     * @dev Allows players to predict price and stake bet.
     * @param _predictedPrice Price prediction in 6 decimals (e.g., 16602 for $0.016602)
     */
    function placeBet(uint256 _predictedPrice) external payable {
        require(roundActive, "No active round");
        require(block.timestamp < bettingEndTime, "Betting period ended");
        require(msg.value >= minimumBet, "Bet amount below minimum");
        require(!hasPlacedBet[roundId][msg.sender], "Already placed bet in this round");
        require(_predictedPrice > 0, "Invalid price prediction");

        // Store bet
        roundBets[roundId].push(Bet({
            predictedPrice: _predictedPrice,
            amount: msg.value,
            bettor: msg.sender,
            exists: true
        }));

        hasPlacedBet[roundId][msg.sender] = true;
        totalStake += msg.value;

        emit BetPlaced(roundId, msg.sender, _predictedPrice, msg.value);
    }

    /**
     * @dev Compares actual price with predicted price to determine winner.
     * @param _actualPrice The actual price in 6 decimals to compare with predictions
     */
    function determineWinner(uint256 _actualPrice) external {
        require(roundActive, "No active round");
        require(block.timestamp >= bettingEndTime, "Betting period not ended");
        require(_actualPrice > 0, "Invalid actual price");

        Bet[] storage bets = roundBets[roundId];
        uint256 currentRoundId = roundId; // Store current round ID

        // Find exact matches
        uint256 winnerCount = 0;
        for (uint256 i = 0; i < bets.length; i++) {
            if (bets[i].predictedPrice == _actualPrice) {
                winnerCount++;
            }
        }

        // Mark round as finished first
        roundFinished[currentRoundId] = true;
        roundActive = false;

        // Handle winner distribution
        if (winnerCount == 0) {
            // No winners - send all stake to owner
            (bool success, ) = owner.call{value: totalStake}("");
            require(success, "Transfer failed");

            // Create empty winners array for the event
            address[] memory noWinners = new address[](0);

            emit NoWinner(currentRoundId, _actualPrice, totalStake);
            roundId++;
            totalStake = 0;
            return;
        } else {
            // We have winners
            address[] memory winners = new address[](winnerCount);

            // Fill winners array
            uint256 winnerIndex = 0;
            for (uint256 i = 0; i < bets.length; i++) {
                if (bets[i].predictedPrice == _actualPrice) {
                    winners[winnerIndex] = bets[i].bettor;
                    winnerIndex++;
                }
            }

            uint256 sharedAmount = totalStake / winnerCount;

            // Distribute prizes
            for (uint256 i = 0; i < winners.length; i++) {
                roundWinners[currentRoundId].push(Winners({
                    bettor: winners[i],
                    prizeAmount: sharedAmount
                }));

                (bool success, ) = winners[i].call{value: sharedAmount}("");
                require(success, "Transfer failed");
            }

            emit WinnerDetermined(currentRoundId, winners, _actualPrice, sharedAmount);
        }

        // Increment round ID and reset stake
        roundId++;
        totalStake = 0;
    }

    /**
     * @dev Retrieve Game round information.
     * @return _roundId Current round ID
     * @return _endTime Time when betting ends for current round
     * @return _totalStake Total amount staked in the current round
     * @return _numBets Number of bets placed in the current round
     * @return _isActive Whether the round is currently active
     */
    function getCurrentRoundInfo() external view returns (
        uint256 _roundId,
        uint256 _endTime,
        uint256 _totalStake,
        uint256 _numBets,
        bool _isActive
    ) {
        return (
            roundId,
            bettingEndTime,
            totalStake,
            roundBets[roundId].length,
            roundActive
        );
    }

    /**
     * @dev Retrieve bets in each game round.
     * @param _roundId The ID of the round to get bets for
     * @return bettors Array of addresses that placed bets
     * @return predictions Array of price predictions
     * @return amounts Array of bet amounts
     */
    function getBetsInRound(uint256 _roundId) external view returns (
        address[] memory bettors,
        uint256[] memory predictions,
        uint256[] memory amounts
    ) {
        Bet[] storage bets = roundBets[_roundId];
        uint256 length = bets.length;

        bettors = new address[](length);
        predictions = new uint256[](length);
        amounts = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            bettors[i] = bets[i].bettor;
            predictions[i] = bets[i].predictedPrice;
            amounts[i] = bets[i].amount;
        }

        return (bettors, predictions, amounts);
    }
}