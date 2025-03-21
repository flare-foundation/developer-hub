import pkg from "hardhat";
const { ethers } = pkg;
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("PricePredictionGame", function () {
  let PricePredictionGame;
  let game;
  let owner;
  let player1;
  let player2;
  let player3;
  let minimumBet;

  beforeEach(async function () {
    // Get signers
    [owner, player1, player2, player3] = await ethers.getSigners();

    // Deploy contract
    minimumBet = ethers.parseEther("0.01");
    PricePredictionGame = await ethers.getContractFactory(
      "PricePredictionGame",
    );
    game = await PricePredictionGame.deploy(minimumBet);
    await game.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await game.owner()).to.equal(owner.address);
    });

    it("Should set the correct minimum bet", async function () {
      expect(await game.minimumBet()).to.equal(minimumBet);
    });

    it("Should start with round ID 1", async function () {
      expect(await game.roundId()).to.equal(1n);
    });
  });

  describe("Round Management", function () {
    it("Should start a new round", async function () {
      const duration = 90; // 90 seconds
      await game.startNewRound(duration);

      const roundInfo = await game.getCurrentRoundInfo();
      expect(roundInfo[4]).to.be.true; // isActive
      expect(roundInfo[0]).to.equal(1n); // roundId
    });

    it("Should not start a new round if one is active", async function () {
      await game.startNewRound(90);
      await expect(game.startNewRound(90)).to.be.revertedWith(
        "Current round still active",
      );
    });

    it("Should not start a round with zero duration", async function () {
      await expect(game.startNewRound(0)).to.be.revertedWith(
        "Duration must be greater than 0",
      );
    });
  });

  describe("Betting", function () {
    beforeEach(async function () {
      await game.startNewRound(90);
    });

    it("Should allow placing a valid bet", async function () {
      const price = 16602; // $0.016602
      const betAmount = minimumBet;

      await expect(game.connect(player1).placeBet(price, { value: betAmount }))
        .to.emit(game, "BetPlaced")
        .withArgs(1, player1.address, price, betAmount);

      const roundInfo = await game.getCurrentRoundInfo();
      expect(roundInfo[2]).to.equal(betAmount); // totalStake
      expect(roundInfo[3]).to.equal(1n); // numBets
    });

    it("Should not allow bet below minimum", async function () {
      const price = 16602;
      const betAmount = ethers.parseEther("0.009");

      await expect(
        game.connect(player1).placeBet(price, { value: betAmount }),
      ).to.be.revertedWith("Bet amount below minimum");
    });

    it("Should not allow multiple bets from same player", async function () {
      const price = 16602;
      const betAmount = minimumBet;

      await game.connect(player1).placeBet(price, { value: betAmount });
      await expect(
        game.connect(player1).placeBet(price, { value: betAmount }),
      ).to.be.revertedWith("Already placed bet in this round");
    });
  });

  describe("Winner Determination", function () {
    beforeEach(async function () {
      // Start first round
      await game.startNewRound(90);

      // Place bets
      await game.connect(player1).placeBet(16602, { value: minimumBet });
      await game.connect(player2).placeBet(16700, { value: minimumBet });
      await game.connect(player3).placeBet(16500, { value: minimumBet });
    });

    it("Should determine correct winner", async function () {
      // Wait for betting period to end
      await time.increase(91);

      const actualPrice = 16602; // Exact match with player1
      const totalStake = minimumBet * 3n;

      await expect(game.determineWinner(actualPrice))
        .to.emit(game, "WinnerDetermined")
        .withArgs(1, [player1.address], actualPrice, totalStake);

      // Check player1 received the prize
      const balanceBefore = await ethers.provider.getBalance(player1.address);
      expect(balanceBefore).to.be.above(totalStake);
    });

    it("Should not determine winner before round ends", async function () {
      // Don't increase time, try to determine winner immediately
      await expect(game.determineWinner(16602)).to.be.revertedWith(
        "Betting period not ended",
      );
    });

    it("Should not determine winner with invalid price", async function () {
      // Wait for betting period to end first
      await time.increase(91);

      await expect(game.determineWinner(0)).to.be.revertedWith(
        "Invalid actual price",
      );
    });
  });

  describe("Game Information", function () {
    it("Should return correct round information", async function () {
      await game.startNewRound(90);
      await game.connect(player1).placeBet(16602, { value: minimumBet });

      const roundInfo = await game.getCurrentRoundInfo();
      expect(roundInfo[0]).to.equal(1n); // roundId
      expect(roundInfo[2]).to.equal(minimumBet); // totalStake
      expect(roundInfo[3]).to.equal(1n); // numBets
      expect(roundInfo[4]).to.be.true; // isActive
    });

    it("Should return correct bets in round", async function () {
      await game.startNewRound(90);
      await game.connect(player1).placeBet(16602, { value: minimumBet });

      const [bettors, predictions, amounts] = await game.getBetsInRound(1);
      expect(bettors[0]).to.equal(player1.address);
      expect(predictions[0]).to.equal(16602n);
      expect(amounts[0]).to.equal(minimumBet);
    });
  });
});
