// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IStdReference, FtsoBandAdapterLibrary} from "@flarenetwork/ftso-adapters/contracts/coston2/BandAdapter.sol";

/**
 * @title PriceTriggeredSafe
 * @notice A vault that automatically pauses withdrawals during high market volatility.
 * @dev Uses the FtsoBandAdapterLibrary to check a basket of asset prices.
 */
contract PriceTriggeredSafe {
    // --- State Variables ---
    address public owner;
    bool public isLocked;
    mapping(address => uint256) public balances;

    // Stores the last checked price for each asset (base symbol => rate).
    mapping(string => uint256) public lastCheckedPrices;

    // The volatility threshold in Basis Points (BIPS). 1000 BIPS = 10%.
    uint256 public constant VOLATILITY_THRESHOLD_BIPS = 1000;

    // --- Events ---
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event MarketLocked(
        string indexed volatileAsset,
        uint256 oldPrice,
        uint256 newPrice
    );
    event MarketUnlocked();

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier whenNotLocked() {
        require(!isLocked, "Safe is currently locked due to volatility");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // --- User Functions ---
    function deposit() external payable {
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) external whenNotLocked {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawn(msg.sender, _amount);
    }

    // --- Safety Mechanism ---
    /**
     * @notice Checks a basket of assets for volatility. If any price moves more
     * than the threshold, it locks the contract.
     * @dev Can be called by anyone, intended for a keeper bot.
     */
    function checkMarketVolatility() external {
        string[] memory bases = new string[](3);
        bases[0] = "FLR";
        bases[1] = "BTC";
        bases[2] = "ETH";

        string[] memory quotes = new string[](3);
        quotes[0] = "USD";
        quotes[1] = "USD";
        quotes[2] = "USD";

        // Use the library to get all prices in a single call.
        IStdReference.ReferenceData[] memory prices = FtsoBandAdapterLibrary
            .getReferenceDataBulk(bases, quotes);

        for (uint i = 0; i < prices.length; i++) {
            string memory base = bases[i];
            uint256 lastPrice = lastCheckedPrices[base];
            uint256 currentPrice = prices[i].rate;

            // If this is the first time we're checking, just record the price.
            if (lastPrice == 0) {
                lastCheckedPrices[base] = currentPrice;
                continue;
            }

            // Check for significant price movement.
            uint256 priceDiff = (lastPrice > currentPrice)
                ? lastPrice - currentPrice
                : currentPrice - lastPrice;
            uint256 changeBIPS = (priceDiff * 10000) / lastPrice;

            if (changeBIPS > VOLATILITY_THRESHOLD_BIPS) {
                isLocked = true;
                emit MarketLocked(base, lastPrice, currentPrice);
                // Stop checking on the first sign of high volatility.
                return;
            }

            // If the market is stable, update the last checked price.
            lastCheckedPrices[base] = currentPrice;
        }
    }

    /**
     * @notice Manually unlocks the safe after a volatility event.
     */
    function unlockSafe() external onlyOwner {
        isLocked = false;
        emit MarketUnlocked();
    }
}
