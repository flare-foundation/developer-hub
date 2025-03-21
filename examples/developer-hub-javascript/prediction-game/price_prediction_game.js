class PricePredictionGame {
    constructor(minimumBet) {
        this.owner = null;
        this.bettingEndTime = 0;
        this.minimumBet = minimumBet;
        this.marketClosed = false;
        this.totalStake = 0;
        this.bets = [];
        this.hasBet = new Map(); // Address -> boolean
    }

    // Initialize the game with an owner
    initialize() {

    }

    // Set the betting duration
    setBettingDuration(durationInSeconds) {

        if (this.bettingEndTime !== 0) {
            throw new Error("Betting duration already set");
        }
        if (durationInSeconds <= 0) {
            throw new Error("Duration must be greater than 0");
        }

        this.bettingEndTime = Math.floor(Date.now() / 1000) + durationInSeconds;
    }

    // Place a bet
    async placeBet(betterAddress, predictedPrice, betAmount) {
        // Verify betting period is active
        if (this.bettingEndTime === 0) {
            throw new Error("Betting duration not set");
        }
        if (this.marketClosed) {
            throw new Error("Betting market is closed");
        }
        if (Math.floor(Date.now() / 1000) >= this.bettingEndTime) {
            throw new Error("Betting period has ended");
        }
        if (betAmount < this.minimumBet) {
            throw new Error("Bet amount too low");
        }
        if (this.hasBet.get(betterAddress)) {
            throw new Error("Already placed a bet");
        }

        // Create and store the bet
        const bet = {
            predictedPrice: predictedPrice,
            amount: betAmount,
            bettor: betterAddress
        };

        this.bets.push(bet);
        this.hasBet.set(betterAddress, true);
        this.totalStake += betAmount;

        return {
            bettor: betterAddress,
            predictedPrice: predictedPrice,
            amount: betAmount
        };
    }

    async fetchAnchorFeeds(feedIds, votingRoundId = null) {
        const BASE_URL = "https://flr-data-availability.flare.network/";
        const API_KEY = " ";
        const url = votingRoundId
            ? `${BASE_URL}api/v0/ftso/anchor-feeds-with-proof?voting_round_id=${votingRoundId}`
            : `${BASE_URL}api/v0/ftso/anchor-feeds-with-proof`;

        return await (
            await fetch(url, {
                method: "POST",
                headers: {
                    "X-API-KEY": API_KEY,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    feed_ids: feedIds,
                }),
            })
        ).json();
    }

    // Determine winner using Flare price feed
    async determineWinner() {

        if (Math.floor(Date.now() / 1000) < this.bettingEndTime) {
            throw new Error("Betting period not ended");
        }
        if (this.marketClosed) {
            throw new Error("Market already closed");
        }

        try {

            const FEED_IDS=["0x01464c522f55534400000000000000000000000000"] // FLR/USD
            // Fetch current FLR/USD price from Flare Network
            const priceFeeds = await this.fetchAnchorFeeds(FEED_IDS);
            const value = priceFeeds[0].body.value
            const decimals = priceFeeds[0].body.decimals
            const flrUsdPrice = value / (10 ** decimals);

            if (!flrUsdPrice) {
                throw new Error("Could not fetch FLR/USD price");
            }

            const actualPrice = flrUsdPrice;
            let closestDiff = Number.MAX_SAFE_INTEGER;
            let winner = null;

            // Find the closest prediction
            for (const bet of this.bets) {
                const diff = Math.abs(bet.predictedPrice - actualPrice);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    winner = bet.bettor;
                }
            }

            this.marketClosed = true;

            if (winner) {
                return {
                    winner: winner,
                    totalbetamount: this.totalStake,
                    actualPrice: actualPrice
                };
            } else {
                return {
                    winner: "No winner",
                    totalbetamount: this.totalStake,
                    actualPrice: actualPrice
                };
            }

        } catch (error) {
            throw new Error(`Error determining winner: ${error.message}`);
        }
    }

    // Get the number of bets
    getBetsCount() {
        return this.bets.length;
    }

    // Get details of a specific bet
    getBetDetails(index) {
        if (index >= this.bets.length) {
            throw new Error("Invalid index");
        }
        const bet = this.bets[index];
        return {
            bettor: bet.bettor,
            predictedPrice: bet.predictedPrice,
            amount: bet.amount
        };
    }

    // Get game status
    getGameStatus() {
        return {
            bettingEndTime: this.bettingEndTime,
            minimumBet: this.minimumBet,
            marketClosed: this.marketClosed,
            totalStake: this.totalStake,
            numberOfBets: this.bets.length
        };
    }
}

// Example usage
async function runGame() {
    try {
        // Initialize game
        const game = new PricePredictionGame(0.01); // Minimum bet 0.01
        game.initialize();

        // Set betting duration 90 seconds
        game.setBettingDuration(90);

        // Place some bets
        await game.placeBet("player1", 0.0172, 10); // Predicting FLR/USD at $1.50
        await game.placeBet("player2", 0.0175, 20); // Predicting FLR/USD at $1.45
        await game.placeBet("player3", 0.0175, 30); // Predicting FLR/USD at $1.55

        // Display current game status
        console.log("Game Status:", game.getGameStatus());

        // Display all bets
        for (let i = 0; i < game.getBetsCount(); i++) {
            console.log(`Bet ${i + 1}:`, game.getBetDetails(i));
        }

        console.log(`Betting period ends in ${game.bettingEndTime - Math.floor(Date.now() / 1000)} seconds`);
        setTimeout(async () => {
            console.log("Betting period ended");
            const result = await game.determineWinner();
            console.log("Game Result:", result);
        }, 90000);

    } catch (error) {
        console.error("Error running game:", error.message);
    }
}

runGame();