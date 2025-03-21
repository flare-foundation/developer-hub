# Price Prediction Game Smart Contract

A decentralized blockchain game where players can bet on FLR price predictions using Anchor Feeds and win rewards for accurate forecasts.

## Overview

PricePredictionGame is a Solidity smart contract that allows players to place bets on what they believe a specific price of FLR will be at a future time. Players who correctly predict the exact price share the total stake pool. If no player predicts the exact price, the contract owner receives the entire stake.

## Features

- **Round-based gameplay**: The game operates in distinct rounds with configurable durations
- **Minimum bet requirement**: Ensures meaningful participation with a minimum stake
- **Fair distribution**: Winners share the prize pool equally
- **Transparent results**: All bets and outcomes are recorded on the blockchain
- **Owner controls**: Game admin can start rounds and determine final prices

## Game Flow

1. The contract owner starts a new round with a specified duration
2. Players place bets with their price predictions during the active round
3. When the round ends, the owner submits the actual price
4. Winners (if any) automatically receive their share of the prize pool
5. A new round can then be started

## Smart Contract Details

### Key Functions

- **startNewRound(uint256 \_duration)**: Start a new betting round with specified duration
- **placeBet(uint256 \_predictedPrice)**: Place a bet with a price prediction
- **determineWinner(uint256 \_actualPrice)**: Determine winner(s) based on actual price
- **getCurrentRoundInfo()**: Get information about the current round
- **getBetsInRound(uint256 \_roundId)**: Get all bets placed in a specific round

### Events

- **RoundStarted**: Emitted when a new round begins
- **BetPlaced**: Emitted when a player places a bet
- **WinnerDetermined**: Emitted when winners are determined
- **NoWinner**: Emitted when no player correctly predicted the price

## Technical Specifications

- **Price Format**: Prices are represented with 6 decimal places (e.g., 16602 for $0.016602)

## Getting Started


```

1. Rename `.env-example` file to `.env` and the value of your private key.

2. Install dependencies

```bash
npm install
```

4. Compile the contract

```bash
npm run compile
```

4. Run tests

```bash
npm run test
```

### Deployment

1. Configure deployment in `hardhat.config.js`
2. Deploy to your preferred network

```bash
npm run deploy
```

3. Copy the contract address to the `.env`.

## Usage Examples

### Starting a New Round

```javascript
// Start a round that lasts for Ninety Seconds (90 seconds)
await pricePredictionGame.startNewRound(3600);
```

### Placing a Bet

```javascript
// Predict price 16602 ($0.016602) with 0.1 ETH bet
const betAmount = ethers.parseEther("0.1");
await pricePredictionGame.placeBet(16602, { value: betAmount });
```

### Determining Winners

```javascript
// After betting period ends, submit actual price
await pricePredictionGame.determineWinner(16750);
```

## Security Considerations

- The contract uses a secure prize distribution mechanism
- Players can place only one bet per round
- The contract has been tested against common vulnerabilities
