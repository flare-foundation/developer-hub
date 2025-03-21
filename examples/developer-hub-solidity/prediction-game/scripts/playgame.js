import { ethers } from "ethers";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join } from "path";

dotenv.config();

class PricePredictionGame {
  constructor(contractAddress, wallet) {
    this.contractAddress = contractAddress;
    this.wallet = wallet;
    this.contract = null;
  }

  async initialize() {
    try {
      // Load contract ABI
      const __dirname = fileURLToPath(new URL(".", import.meta.url));
      const contractPath = join(
        __dirname,
        "../artifacts/contracts/PricePredictionGame.sol/PricePredictionGame.json",
      );
      const contractArtifact = JSON.parse(readFileSync(contractPath, "utf8"));

      // Initialize contract instance with wallet directly
      this.contract = new ethers.Contract(
        this.contractAddress,
        contractArtifact.abi,
        this.wallet,
      );

      // Setup event listeners
      this.setupEventListeners();

      console.log("\nGame initialized!");
      await this.printGameStatus();
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }

  setupEventListeners() {
    this.contract.on("BetPlaced", (roundId, bettor, predictedPrice, amount) => {
      console.log("\nNew Bet Placed:");
      console.log("Round:", roundId.toString());
      console.log("Bettor:", bettor);
      console.log("Predicted Price:", this.formatPrice(predictedPrice));
      console.log("Amount:", ethers.formatEther(amount.toString()), "FLR");
    });

    this.contract.on(
      "WinnerDetermined",
      (roundId, winners, actualPrice, prize) => {
        console.log("\nWinner Determined!");
        console.log("Round:", roundId.toString());
        console.log("Winner:", winners);
        console.log("Actual Price:", this.formatPrice(actualPrice));
        console.log("Prize:", ethers.formatEther(prize.toString()), "FLR");
      },
    );

    this.contract.on("RoundStarted", (roundId, endTime, minimumBet) => {
      console.log("\nNew Round Started!");
      console.log("Round:", roundId.toString());
      console.log(
        "End Time:",
        new Date(Number(endTime) * 1000).toLocaleString(),
      );
      console.log(
        "Minimum Bet:",
        ethers.formatEther(minimumBet.toString()),
        "FLR",
      );
    });
    this.contract.on("NoWinner", (roundId, actualPrice, transferedAmount) => {
      console.log("\nNo Winner Determined!");
      console.log("Round:", roundId.toString());
      console.log("Actual Price:", this.formatPrice(actualPrice));
      console.log("Total Stake", transferedAmount);
    });
  }

  formatPrice(price) {
    return `$${(Number(price) / 1000000).toFixed(6)}`;
  }

  async placeBet(predictedPrice, betAmount) {
    try {
      // Convert price to contract format (6 decimals)
      const priceInContract = Math.floor(parseFloat(predictedPrice) * 1000000);
      const amountInWei = ethers.parseEther(betAmount);

      console.log("\nPlacing bet...");
      const tx = await this.contract.placeBet(priceInContract, {
        value: amountInWei,
      });
      await tx.wait();

      console.log("Bet placed successfully!");
      await this.printGameStatus();
      return true;
    } catch (error) {
      console.error("Error placing bet:", error.message);
      return false;
    }
  }

  async printGameStatus() {
    try {
      const roundInfo = await this.contract.getCurrentRoundInfo();
      const timeRemaining =
        Number(roundInfo[1]) - Math.floor(Date.now() / 1000);

      console.log("\nCurrent Game Status:");
      console.log("Round:", roundInfo[0].toString());
      console.log(
        "End Time:",
        new Date(Number(roundInfo[1]) * 1000).toLocaleString(),
      );
      console.log(
        "Time Remaining:",
        timeRemaining > 0 ? `${timeRemaining} seconds` : "Round Ended",
      );
      console.log(
        "Total Stake:",
        ethers.formatEther(roundInfo[2].toString()),
        "FLR",
      );
      console.log("Number of Bets:", roundInfo[3].toString());
      console.log("Round Active:", roundInfo[4]);

      return {
        roundId: roundInfo[0],
        endTime: roundInfo[1],
        totalStake: roundInfo[2],
        numBets: roundInfo[3],
        isActive: roundInfo[4],
        timeRemaining,
      };
    } catch (error) {
      console.error("Error getting game status:", error);
      return { isActive: false, timeRemaining: 0 };
    }
  }

  async fetchCurrentPrice() {
    const BASE_URL = "https://flr-data-availability.flare.network/";
    const FEED_IDS = ["0x01464c522f55534400000000000000000000000000"]; // FLR/USD

    try {
      const response = await fetch(
        `${BASE_URL}api/v0/ftso/anchor-feeds-with-proof`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ feed_ids: FEED_IDS }),
        },
      );

      const data = await response.json();
      const price = Math.floor(
        (data[0].body.value / 10 ** data[0].body.decimals) * 1000000,
      );
      console.log(`Current FLR/USD price: ${this.formatPrice(price)}`);
      return price;
    } catch (error) {
      console.error("Error fetching price:", error);
      return null;
    }
  }

  async determineWinner() {
    try {
      const status = await this.printGameStatus();

      if (!status.isActive || status.timeRemaining > 0) {
        console.log(
          "Cannot determine winner: round is either inactive or time hasn't expired yet",
        );
        return false;
      }

      const currentPrice = await this.fetchCurrentPrice();
      if (!currentPrice) {
        console.error("Failed to fetch current price");
        return false;
      }

      console.log(
        `\nDetermining winner with actual price: ${this.formatPrice(currentPrice)}`,
      );
      const tx = await this.contract.determineWinner(currentPrice);
      console.log("Transaction hash:", tx.hash);
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);

      // Wait a moment and verify round state has changed
      console.log("Verifying round state change...");
      await new Promise((resolve) => setTimeout(resolve, 15000)); // Wait 15 seconds

      const postTxStatus = await this.printGameStatus();
      if (postTxStatus.isActive) {
        console.log(
          "WARNING: Round still appears active after transaction confirmation",
        );
        return false;
      }

      console.log("Winner determination complete, round is now inactive");
      return true;
    } catch (error) {
      console.error("Error determining winner:", error.message);
      // Check if the error indicates the round is already finalized
      if (
        error.message.includes("Round not active") ||
        error.message.includes("already finalized")
      ) {
        console.log("Round appears to be already finalized");
        return true; // Consider this a success case
      }
      return false;
    }
  }
  async startNewRound(duration) {
    try {
      console.log(`\nStarting new round with duration: ${duration} seconds`);
      const tx = await this.contract.startNewRound(duration);
      await tx.wait();
      console.log("New round started successfully");
      await this.printGameStatus();
      return true;
    } catch (error) {
      console.error("Error starting new round:", error.message);
      return false;
    }
  }
}

async function runGame(predictedPrice, betAmount) {
  try {
    // Create provider with specific network configuration
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

    // Create wallet with provider
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Create game instance with wallet only
    const game = new PricePredictionGame(process.env.CONTRACT_ADDRESS, wallet);

    await game.initialize();
    console.log("\nWelcome to the Price Prediction Game!");

    // Get current game status
    const status = await game.printGameStatus();

    // Handle different scenarios

    if (status.isActive) {
      // If round is active
      if (status.timeRemaining <= 0) {
        // Round is active but betting period has ended - need to determine winner
        console.log(
          "\nRound is active but betting period has ended. Determining winner first...",
        );
        const winnerDetermined = await game.determineWinner();

        if (winnerDetermined) {
          // Add more delay to ensure the blockchain state updates
          console.log("Waiting for blockchain to update...");
          await new Promise((resolve) => setTimeout(resolve, 10000)); // Increase to 10 seconds

          // Check game status again to confirm round is no longer active
          const updatedStatus = await game.printGameStatus();

          if (!updatedStatus.isActive) {
            // Only start a new round if the previous one is confirmed inactive
            console.log("\nStarting a new round after determining winner...");
            const roundStarted = await game.startNewRound(BigInt(90));
            if (roundStarted) {
              // Place bet in the new round
              await game.placeBet(predictedPrice, betAmount);
              console.log("Winner will be determined in 90 seconds");
              setTimeout(async () => {
                await game.determineWinner();
              }, 90000);
            }
          } else {
            console.log(
              "\nPrevious round still appears active after determining winner. Please try again later.",
            );
          }
        }
      } else {
        // Round is active and betting period is still open
        console.log("\nJoining active round with open betting period...");
        await game.placeBet(predictedPrice, betAmount);
        console.log("Winner will be determined in 90 seconds");
        setTimeout(async () => {
          await game.determineWinner();
        }, 90000);
      }
    } else {
      // No active round, start a new one
      console.log("\nNo active round. Starting a new one...");
      const roundStarted = await game.startNewRound(BigInt(90));
      if (roundStarted) {
        // Place bet in the new round
        await game.placeBet(predictedPrice, betAmount);
        console.log("Winner will be determined in 90 seconds");
        setTimeout(async () => {
          await game.determineWinner();
        }, 90000);
      }
    }
    // Print final status
    await game.printGameStatus();
  } catch (error) {
    console.error("Game error:", error.message);
    process.exit(1);
  }
}

runGame("0.01606", "2").catch(console.error);
