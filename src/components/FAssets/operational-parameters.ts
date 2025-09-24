export const operationalParameters = [
  {
    title: "Minting and Redeeming",
    parameters: [
      {
        name: "Minting cap",
        settingName: "mintingCapAMG",
        description:
          "Total amount of allowed FAssets in circulation. Once reached, no more FAssets can be minted until some are redeemed. This is intended as a security measure. In the final deployment, this cap will be gradually increased and finally removed.",
        values: {
          flare: {
            xrp: "2M XRP",
          },
          coston2: {
            xrp: "none",
          },
          songbird: {
            xrp: "750k XRP",
          },
          coston: {
            xrp: "none",
            btc: "none",
            doge: "none",
          },
        },
      },
      {
        name: "Lot size",
        settingName: "lotSizeAMG",
        description: "Minimum quantity required for minting FAssets.",
        link: "/fassets/minting#lots",
        values: {
          flare: {
            xrp: "10 XRP",
          },
          coston2: {
            xrp: "10 XRP",
          },
          songbird: {
            xrp: "10 XRP",
          },
          coston: {
            xrp: "20 XRP",
            btc: "0.0004 BTC",
            doge: "100 DOGE",
          },
        },
      },
      {
        name: "Collateral reservation fee (CRF)",
        settingName: "collateralReservationFee",
        description: "Fee applied when reserving collateral for minting..",
        link: "/fassets/minting#collateral-reservation-fee",
        values: {
          flare: {
            xrp: "0.01%",
          },
          coston2: {
            xrp: "0.1%",
          },
          songbird: {
            xrp: "0.5%",
          },
          coston: {
            xrp: "0.1%",
            btc: "0.1%",
            doge: "0.1%",
          },
        },
      },
      {
        name: "Redemption fee",
        settingName: "redemptionFee",
        description: "Fee charged during redemption of FAssets.",
        link: "/fassets/redemption#redemption-fee",
        values: {
          flare: {
            xrp: "0.2%",
          },
          coston2: {
            xrp: "0.5%",
          },
          songbird: {
            xrp: "0.5%",
          },
          coston: {
            xrp: "0.1%",
            btc: "0.1%",
            doge: "0.1%",
          },
        },
      },
      {
        name: "Redemption default premium",
        settingName: "redemptionDefaultPremium",
        description:
          "Premium paid if an agent fails to meet redemption obligations.",
        link: "/fassets/redemption#redemption-payment-failure",
        values: {
          flare: {
            xrp: "5%",
          },
          coston2: {
            xrp: "5%",
          },
          songbird: {
            xrp: "5%",
          },
          coston: {
            xrp: "10%",
            btc: "10%",
            doge: "10%",
          },
        },
      },
      {
        name: "Redemption default premium source",
        description:
          "Where does the premium come from when an agent fails to pay the redeemer on time? If the vault CR > 1.1, from the agent's vault. Otherwise, from the agent's vault and the collateral pool.",
        values: {
          flare: {
            xrp: "✅",
          },
          coston2: {
            xrp: "✅",
          },
          songbird: {
            xrp: "✅",
          },
          coston: {
            xrp: "✅",
            btc: "✅",
            doge: "✅",
          },
        },
      },
      {
        name: "Maximum redemption tickets",
        settingName: "maxRedeemedTickets",
        description: "Maximum number of tickets redeemed in a single request.",
        values: {
          flare: {
            xrp: "20",
          },
          coston2: {
            xrp: "20",
          },
          songbird: {
            xrp: "20",
          },
          coston: {
            xrp: "20",
            btc: "20",
            doge: "20",
          },
        },
      },
    ],
  },
  {
    title: "Payment Times",
    parameters: [
      {
        name: "Underlying blocks for payment",
        settingName: "underlyingBlocksForPayment",
        description:
          "The number of underlying blocks during which the minter or agent can pay the underlying value.",
        values: {
          flare: {
            xrp: "225",
          },
          coston2: {
            xrp: "500",
          },
          songbird: {
            xrp: "225",
          },
          coston: {
            xrp: "500",
            btc: "10",
            doge: "50",
          },
        },
      },
      {
        name: "Underlying seconds for payment",
        settingName: "underlyingSecondsForPayment",
        description:
          "The minimum time allowed for an agent to pay for a redemption or a minter to pay for minting.",
        values: {
          flare: {
            xrp: "15 minutes",
          },
          coston2: {
            xrp: "15 minutes",
          },
          songbird: {
            xrp: "15 minutes",
          },
          coston: {
            xrp: "15 minutes",
            btc: "2 hours",
            doge: "50 minutes",
          },
        },
      },
      {
        name: "Average block time",
        settingName: "averageBlockTimeMS",
        description:
          "The average time between two successive blocks on the underlying chain.",
        values: {
          flare: {
            xrp: "4 seconds",
          },
          coston2: {
            xrp: "4 seconds",
          },
          songbird: {
            xrp: "4 seconds",
          },
          coston: {
            xrp: "2 seconds",
            btc: "10 minutes",
            doge: "1 minute",
          },
        },
      },
      {
        name: "Time of proof availability",
        settingName: "attestationWindowSeconds",
        description:
          "The amount of time that proofs of payment or nonpayment must be available on the Data Connector.",
        values: {
          flare: {
            xrp: "1 day",
          },
          coston2: {
            xrp: "1 day",
          },
          songbird: {
            xrp: "1 day",
          },
          coston: {
            xrp: "1 day",
            btc: "1 day",
            doge: "1 day",
          },
        },
      },
      {
        name: "Amount of extra time per redemption",
        settingName: "redemptionPaymentExtensionSeconds",
        description:
          "The extra amount of time per redemption granted to an agent when many redemption requests occur in a short period of time.",
        values: {
          flare: {
            xrp: "45 seconds",
          },
          coston2: {
            xrp: "30 seconds",
          },
          songbird: {
            xrp: "45 seconds",
          },
          coston: {
            xrp: "30 seconds",
            btc: "60 seconds",
            doge: "60 seconds",
          },
        },
      },
    ],
  },
  {
    title: "Collateral Ratios",
    parameters: [
      {
        name: "Vault Collateral Supported Types",
        description: "Types of collateral required in the agent's vault.",
        values: {
          flare: {
            xrp: "<code>USDT</code>",
          },
          coston2: {
            xrp: "<code>USDX</code>",
          },
          songbird: {
            xrp: "<code>USDX</code>",
          },
          coston: {
            xrp: "<code>USDX</code>, <code>USDC</code>, <code>USDT</code>, simulated <code>WETH</code>",
            btc: "<code>USDC</code>, <code>USDT</code>, simulated <code>WETH</code>",
            doge: "<code>USDC</code>, <code>USDT</code>, simulated <code>WETH</code>",
          },
        },
      },
      {
        name: "Vault Minimal CR",
        functionName: "getCollateralTypes",
        interfaceLink: "/fassets/reference/IAssetManager#getcollateraltypes",
        description:
          "The minimum collateral ratio required to avoid liquidation.",
        link: "/fassets/collateral#minimal-cr",
        values: {
          flare: {
            xrp: "1.2",
          },
          coston2: {
            xrp: "1.2",
          },
          songbird: {
            xrp: "1.2",
          },
          coston: {
            xrp: "1.4",
            btc: "1.4",
            doge: "1.4",
          },
        },
      },
      {
        name: "Vault Collateral Safety CR",
        functionName: "getCollateralTypes",
        interfaceLink: "/fassets/reference/IAssetManager#getcollateraltypes",
        description: "The collateral ratio required to exit liquidation mode.",
        link: "/fassets/collateral#safety-cr",
        values: {
          flare: {
            xrp: "1.3",
          },
          coston2: {
            xrp: "1.2",
          },
          songbird: {
            xrp: "1.3",
          },
          coston: {
            xrp: "1.5",
            btc: "1.5",
            doge: "1.5",
          },
        },
      },
      {
        name: "Pool Collateral Supported Types",
        description: "Types of collateral required in the collateral pool.",
        values: {
          flare: {
            xrp: "FLR",
          },
          coston2: {
            xrp: "C2FLR",
          },
          songbird: {
            xrp: "SGB",
          },
          coston: {
            xrp: "CFLR",
            btc: "CFLR",
            doge: "CFLR",
          },
        },
      },
      {
        name: "Pool Collateral Pool Minimal CR",
        functionName: "getCollateralTypes",
        interfaceLink: "/fassets/reference/IAssetManager#getcollateraltypes",
        description:
          "The minimum collateral ratio required to avoid liquidation.",
        link: "/fassets/collateral#minimal-cr",
        values: {
          flare: {
            xrp: "1.5",
          },
          coston2: {
            xrp: "1.5",
          },
          songbird: {
            xrp: "1.5",
          },
          coston: {
            xrp: "2.0",
            btc: "2.0",
            doge: "2.0",
          },
        },
      },
      {
        name: "Pool Collateral Safety CR",
        functionName: "getCollateralTypes",
        interfaceLink: "/fassets/reference/IAssetManager#getcollateraltypes",
        description: "The collateral ratio required to exit liquidation mode.",
        link: "/fassets/collateral#safety-cr",
        values: {
          flare: {
            xrp: "1.6",
          },
          coston2: {
            xrp: "1.6",
          },
          songbird: {
            xrp: "1.6",
          },
          coston: {
            xrp: "2.1",
            btc: "2.1",
            doge: "2.1",
          },
        },
      },
      {
        name: "Minting pool holdings required",
        settingName: "mintingPoolHoldingsRequired",
        description:
          "The minimum amount of pool tokens an agent must hold to be able to mint, as a percentage of the FAssets the agent is currently backing.",
        values: {
          flare: {
            xrp: "50%",
          },
          coston2: {
            xrp: "50%",
          },
          songbird: {
            xrp: "50%",
          },
          coston: {
            xrp: "50%",
            btc: "50%",
            doge: "50%",
          },
        },
      },
    ],
  },
  {
    title: "Liquidation",
    parameters: [
      {
        name: "Liquidation premium",
        settingName: "liquidationPremium",
        description: "Increases in steps, as time passes.",
        values: {
          flare: {
            xrp: "<strong>Step 1</strong>: 4%<br /><strong>Step 2</strong>: 8%<br /><strong>Step 3</strong>: 12%",
          },
          coston2: {
            xrp: "<strong>Step 1</strong>: 4%<br /><strong>Step 2</strong>: 8%<br /><strong>Step 3</strong>: 12%",
          },
          songbird: {
            xrp: "<strong>Step 1</strong>: 5%<br /><strong>Step 2</strong>: 8%<br /><strong>Step 3</strong>: 12%",
          },
          coston: {
            xrp: "<strong>Step 1</strong>: 5%<br /><strong>Step 2</strong>: 10%<br /><strong>Step 3</strong>: 15%",
            btc: "<strong>Step 1</strong>: 5%<br /><strong>Step 2</strong>: 10%<br /><strong>Step 3</strong>: 15%",
            doge: "<strong>Step 1</strong>: 5%<br /><strong>Step 2</strong>: 10%<br /><strong>Step 3</strong>: 15%",
          },
        },
      },
      {
        name: "Liquidation step time",
        settingName: "liquidationStepTime",
        description:
          "Elapsed time before the liquidation premium advances to the next step.",
        values: {
          flare: {
            xrp: "300 seconds",
          },
          coston2: {
            xrp: "180 seconds",
          },
          songbird: {
            xrp: "300 seconds",
          },
          coston: {
            xrp: "180 seconds",
            btc: "180 seconds",
            doge: "180 seconds",
          },
        },
      },
      {
        name: "Liquidation source - Liquidated value",
        description: "Where do the funds come from to pay for liquidations?",
        values: {
          flare: {
            xrp: "The agent's vault",
          },
          coston2: {
            xrp: "The agent's vault",
          },
          songbird: {
            xrp: "The agent's vault",
          },
          coston: {
            xrp: "The agent's vault",
            btc: "The agent's vault",
            doge: "The agent's vault",
          },
        },
      },
      {
        name: "Liquidation source - Premium",
        description: "Where do the funds come from to pay for liquidations?",
        values: {
          flare: {
            xrp: "The collateral's vault",
          },
          coston2: {
            xrp: "The collateral pool",
          },
          songbird: {
            xrp: "The collateral pool",
          },
          coston: {
            xrp: "The collateral pool",
            btc: "The collateral pool",
            doge: "The collateral pool",
          },
        },
      },
    ],
  },
  {
    title: "Rewarding",
    parameters: [
      {
        name: "Challenger reward",
        settingName: "paymentChallengeReward",
        description:
          "After a successful challenge for an illegal operation, the agent goes into full liquidation and the challenger is paid this reward from the agent's vault.",
        link: "/fassets/overview#challengers",
        values: {
          flare: {
            xrp: "250 USD converted to vault collateral",
          },
          coston2: {
            xrp: "300 USD converted to vault collateral",
          },
          songbird: {
            xrp: "250 USD converted to vault collateral",
          },
          coston: {
            xrp: "300 USD converted to vault collateral",
            btc: "300 USD converted to vault collateral",
            doge: "300 USD converted to vault collateral",
          },
        },
      },
      {
        name: "Confirmation by others",
        settingName: "confirmationByOthersAfter",
        description:
          "If an agent or redeemer becomes unresponsive, anybody can confirm payments and non-payments some time after the request was made, and get a reward from the agent's vault.",
        link: "/fassets/redemption#edge-cases",
        values: {
          flare: {
            xrp: "",
          },
          coston2: {
            xrp: "",
          },
          songbird: {
            xrp: "",
          },
          coston: {
            xrp: "",
            btc: "",
            doge: "",
          },
        },
      },
      {
        name: "Minimum time",
        settingName: "confirmationByOthersAfter",
        values: {
          flare: {
            xrp: "6 hours",
          },
          coston2: {
            xrp: "2 hours",
          },
          songbird: {
            xrp: "6 hours",
          },
          coston: {
            xrp: "2 hours",
            btc: "4 hours",
            doge: "4 hours",
          },
        },
      },
      {
        name: "Reward",
        settingName: "confirmationByOthersReward",
        values: {
          flare: {
            xrp: "5 USD (converted to vault collateral)",
          },
          coston2: {
            xrp: "100 USD (converted to vault collateral)",
          },
          songbird: {
            xrp: "50 USD (converted to vault collateral)",
          },
          coston: {
            xrp: "100 USD (converted to vault collateral)",
            btc: "100 USD (converted to vault collateral)",
            doge: "100 USD (converted to vault collateral)",
          },
        },
      },
    ],
  },
  {
    title: "Time Locks",
    parameters: [
      {
        name: "Time lock",
        settingName: "withdrawalTimelock",
        description:
          "Agent has to announce any collateral withdrawal or vault destruction and then wait this time before executing it.",
        values: {
          flare: {
            xrp: "1 hour",
          },
          coston2: {
            xrp: "60 seconds",
          },
          songbird: {
            xrp: "1 hour",
          },
          coston: {
            xrp: "60 seconds",
            btc: "60 seconds",
            doge: "60 seconds",
          },
        },
      },
      {
        name: "Maximum governance update frequency",
        settingName: "minUpdateRepeatTime",
        description:
          "Minimum amount of time between updates of any governance setting.",
        values: {
          flare: {
            xrp: "1 day",
          },
          coston2: {
            xrp: "60 seconds",
          },
          songbird: {
            xrp: "1 day",
          },
          coston: {
            xrp: "60 seconds",
            btc: "60 seconds",
            doge: "60 seconds",
          },
        },
      },
      {
        name: "Token invalidation time",
        settingName: "tokenInvalidationTime",
        description:
          "Time between the moment a token is deprecated by governance and it becomes invalid. Agents still using it as vault collateral get liquidated after this time.",
        values: {
          flare: {
            xrp: "1 day",
          },
          coston2: {
            xrp: "1 day",
          },
          songbird: {
            xrp: "1 day",
          },
          coston: {
            xrp: "1 day",
            btc: "1 day",
            doge: "1 day",
          },
        },
      },
      {
        name: "Agent exit available time lock",
        settingName: "agentExitAvailableTimelock",
        description:
          "The time the agent has to wait after announcing exit from the list of publicly available agents and executing the exit.",
        values: {
          flare: {
            xrp: "3 hours",
          },
          coston2: {
            xrp: "60 seconds",
          },
          songbird: {
            xrp: "3 hours",
          },
          coston: {
            xrp: "60 seconds",
            btc: "60 seconds",
            doge: "60 seconds",
          },
        },
      },
      {
        name: "Agent fee change time lock",
        settingName: "agentFeeChangeTimelock",
        description:
          "The time the agent has to wait between announcing and changing the agent fee or the pool share.",
        values: {
          flare: {
            xrp: "1 hour",
          },
          coston2: {
            xrp: "120 seconds",
          },
          songbird: {
            xrp: "1 hour",
          },
          coston: {
            xrp: "120 seconds",
            btc: "120 seconds",
            doge: "120 seconds",
          },
        },
      },
      {
        name: "Agent minting CR change time lock",
        settingName: "agentMintingCRChangeTimelock",
        description:
          "The time the agent has to wait between announcing and changing the minting CR (vault or pool).",
        values: {
          flare: {
            xrp: "5 minutes",
          },
          coston2: {
            xrp: "120 seconds",
          },
          songbird: {
            xrp: "5 minutes",
          },
          coston: {
            xrp: "120 seconds",
            btc: "120 seconds",
            doge: "120 seconds",
          },
        },
      },
      {
        name: "Pool exit and top-up change time lock",
        settingName: "poolExitAndTopupChangeTimelock",
        description:
          "The time the agent has to wait between announcing and changing any pool exit and top-up settings.",
        values: {
          flare: {
            xrp: "1 day",
          },
          coston2: {
            xrp: "120 seconds",
          },
          songbird: {
            xrp: "1 day",
          },
          coston: {
            xrp: "120 seconds",
            btc: "120 seconds",
            doge: "120 seconds",
          },
        },
      },
      {
        name: "Agent time-locked operation window",
        settingName: "agentTimelockedOperationWindow",
        description:
          "Once the above time locks expire, agents have this amount of time to execute the requested operation.",
        values: {
          flare: {
            xrp: "2 hours",
          },
          coston2: {
            xrp: "1 hour",
          },
          songbird: {
            xrp: "2 hours",
          },
          coston: {
            xrp: "1 hour",
            btc: "1 hour",
            doge: "1 hour",
          },
        },
      },
      {
        name: "Collateral pool token time lock",
        settingName: "collateralPoolTokenTimelock",
        description:
          "Amount of seconds that a user entering the collateral pool must wait before spending (exit or transfer) the obtained pool tokens.",
        values: {
          flare: {
            xrp: "60 seconds",
          },
          coston2: {
            xrp: "60 seconds",
          },
          songbird: {
            xrp: "60 seconds",
          },
          coston: {
            xrp: "60 seconds",
            btc: "60 seconds",
            doge: "60 seconds",
          },
        },
      },
      {
        name: "Minimum diamond-cut time lock",
        settingName: "diamondCutMinTimelockSeconds",
        description:
          "Amount of time that must elapse before the system performs a <a href='https://eips.ethereum.org/EIPS/eip-2535' target='_blank'>diamond cut</a>.",
        values: {
          flare: {
            xrp: "1 hour",
          },
          coston2: {
            xrp: "2 hours",
          },
          songbird: {
            xrp: "1 hour",
          },
          coston: {
            xrp: "2 hours",
            btc: "2 hours",
            doge: "2 hours",
          },
        },
      },
    ],
  },
  {
    title: "Emergency Pause",
    parameters: [
      {
        name: "Emergency pause",
        settingName: "maxEmergencyPauseDurationSeconds",
        description:
          "The maximum time for a pause triggered by governance or some other entity.",
        values: {
          flare: {
            xrp: "3 days",
          },
          coston2: {
            xrp: "1 day",
          },
          songbird: {
            xrp: "3 days",
          },
          coston: {
            xrp: "1 day",
            btc: "1 day",
            doge: "1 day",
          },
        },
      },
      {
        name: "Emergency pause reset",
        settingName: "emergencyPauseDurationResetAfterSeconds",
        description:
          "The amount of time since the last emergency pause. After it has elapsed, the pause duration counter automatically resets.",
        values: {
          flare: {
            xrp: "1 week",
          },
          coston2: {
            xrp: "1 week",
          },
          songbird: {
            xrp: "1 week",
          },
          coston: {
            xrp: "1 week",
            btc: "1 week",
            doge: "1 week",
          },
        },
      },
    ],
  },
  {
    title: "Transfer Fees",
    parameters: [
      {
        name: "Transfer fee represented as a fraction of one millionth of the transferred amount",
        settingName: "transferFeeMillionths",
        description:
          "The fee on FAsset token transfer. Each transfer has this value times the transferred amount deducted from its value. The fees get deposited into epochs that are claimable by agents depending on their minting history.",
        values: {
          flare: {
            xrp: "0",
          },
          coston2: {
            xrp: "0",
          },
          songbird: {
            xrp: "0",
          },
          coston: {
            xrp: "0",
            btc: "0",
            doge: "0",
          },
        },
      },
      {
        name: "Maximum Unexpired Epochs for Transfer Fee Claims",
        settingName: "transferFeeClaimMaxUnexpiredEpochs",
        description:
          "The number of epochs to pass before the fees get transferred to new epochs.",
        values: {
          flare: {
            xrp: "-",
          },
          coston2: {
            xrp: "16",
          },
          songbird: {
            xrp: "30",
          },
          coston: {
            xrp: "16",
            btc: "16",
            doge: "16",
          },
        },
      },
      {
        name: "Epoch Duration in Seconds for Transfer Fee Claims",
        settingName: "transferFeeClaimEpochDurationSeconds",
        description: "Duration of each reward epoch.",
        values: {
          flare: {
            xrp: "-",
          },
          coston2: {
            xrp: "7 days",
          },
          songbird: {
            xrp: "3.5 days",
          },
          coston: {
            xrp: "7 days",
            btc: "7 days",
            doge: "7 days",
          },
        },
      },
      {
        name: "Start Timestamp for First Transfer Fee Claim Epoch",
        settingName: "transferFeeClaimFirstEpochStartTs",
        description: "The first reward epoch timestamp.",
        values: {
          flare: {
            xrp: "-",
          },
          coston2: {
            xrp: "Tue Oct 01 2024 12:00:00 GMT",
          },
          songbird: {
            xrp: "1733122800 (Mon Dec 02 2024 07:00:00 GMT)",
          },
          coston: {
            xrp: "Tue Oct 01 2024 12:00:00 GMT",
            btc: "Tue Oct 01 2024 12:00:00 GMT",
            doge: "Tue Oct 01 2024 12:00:00 GMT",
          },
        },
      },
    ],
  },
  {
    title: "Default Agent Settings",
    parameters: [
      {
        name: "Minting fee",
        settingName: "feeBIPS",
        description:
          "The minting fee is when users (minters) mint FAssets by depositing underlying assets with an agent.",
        link: "/fassets/minting#minting-fee",
        values: {
          coston2: {
            xrp: "0.25%",
          },
          songbird: {
            xrp: "1%",
          },
          coston: {
            xrp: "0.25%",
            btc: "0.25%",
            doge: "0.25%",
          },
        },
      },
      {
        name: "Pool share",
        settingName: "poolFeeShareBIPS",
        description:
          "The pool share fee is the portion of the minting and redemption fees allocated to pool collateral providers.",
        link: "/fassets/minting#pool-share",
        values: {
          coston2: {
            xrp: "40%",
          },
          songbird: {
            xrp: "30%",
          },
          coston: {
            xrp: "40%",
            btc: "40%",
            doge: "40%",
          },
        },
      },
      {
        name: "Minting Collateral Ratio - Agent Vault",
        settingName: "mintingVaultCollateralRatioBIPS",
        description:
          "The minting vault collateral ratio is the minimum collateral required to back FAssets, ensuring value protection against under-collateralization.",
        link: "/fassets/collateral#minting-cr",
        values: {
          coston2: {
            xrp: "1.4",
          },
          songbird: {
            xrp: "1.4",
          },
          coston: {
            xrp: "1.6",
            btc: "1.6",
            doge: "1.6",
          },
        },
      },
      {
        name: "Minting Collateral Ratio - Collateral Pool",
        settingName: "mintingPoolCollateralRatioBIPS",
        description:
          "The minting pool collateral ratio ensures the collateral value supports the minted FAssets.",
        link: "/fassets/collateral#minting-cr",
        values: {
          coston2: {
            xrp: "1.7",
          },
          songbird: {
            xrp: "1.7",
          },
          coston: {
            xrp: "2.3",
            btc: "2.3",
            doge: "2.3",
          },
        },
      },
      {
        name: "Exit Collateral Ratio",
        settingName: "poolExitCollateralRatioBIPS",
        description:
          "The pool exit collateral ratio is the minimum collateral ratio agents must maintain when exiting their pool collateral.",
        link: "/fassets/collateral#exit-cr",
        values: {
          coston2: {
            xrp: "1.6",
          },
          songbird: {
            xrp: "1.6",
          },
          coston: {
            xrp: "2.3",
            btc: "2.3",
            doge: "2.3",
          },
        },
      },
      {
        name: "Discount for agent self-close",
        settingName: "buyFAssetByAgentFactorBIPS",
        description:
          "Applied when agents buy back FAssets during liquidation events, shown as a factor on the Agent UI.",
        link: "/fassets/liquidation#stopping-liquidations",
        values: {
          coston2: {
            xrp: "99%",
          },
          songbird: {
            xrp: "99%",
          },
          coston: {
            xrp: "99%",
            btc: "99%",
            doge: "99%",
          },
        },
      },
      {
        name: "Redemption Pool Fee Share",
        settingName: "redemptionPoolFeeShare",
        description:
          "Percentage of redemption fees paid to the pool to sustain it during high redemption periods.",
        values: {
          coston2: {
            xrp: "40%",
          },
          songbird: {
            xrp: "30%",
          },
          coston: {
            xrp: "40%",
            btc: "99%",
            doge: "99%",
          },
        },
      },
    ],
  },
  {
    title: "Core Vault Manager",
    parameters: [
      {
        name: "Escrow amount",
        settingName: "_escrowAmount",
        functionName: "getSettings",
        interfaceLink: "/fassets/reference/ICoreVaultManager#getsettings",
        description:
          "The amount of XRP to escrow (setting to 0 disables escrowing).",
        values: {
          flare: {
            xrp: "250k XRP",
          },
          coston2: {
            xrp: "10k XRP",
          },
          songbird: {
            xrp: "150k XRP",
          },
          coston: {
            xrp: "10k XRP",
          },
        },
      },
      {
        name: "Minimal left amount in the multisig",
        settingName: "_minimalAmount",
        functionName: "getSettings",
        interfaceLink: "/fassets/reference/IAssetManager#getsettings",
        description:
          "The minimal amount that will be left on the multisig after escrowing.",
        values: {
          flare: {
            xrp: "500k XRP",
          },
          coston2: {
            xrp: "10k XRP",
          },
          songbird: {
            xrp: "150k XRP",
          },
          coston: {
            xrp: "10k XRP",
          },
        },
      },
      {
        name: "Escrow expiration time",
        settingName: "_escrowEndTimeSeconds",
        functionName: "getSettings",
        interfaceLink: "/fassets/reference/IAssetManager#getsettings",
        description:
          "The time of day (UTC) when the escrows expire. Exactly one escrow per day will expire.",
        values: {
          flare: {
            xrp: "57600 (16:00 UTC)",
          },
          coston2: {
            xrp: "43200 (12:00 UTC)",
          },
          songbird: {
            xrp: "50400 (14:00 UTC)",
          },
          coston: {
            xrp: "43200 (12:00 UTC)",
          },
        },
      },
      {
        name: "Max expected fee",
        settingName: "_fee",
        functionName: "getSettings",
        interfaceLink: "/fassets/reference/IAssetManager#getsettings",
        description: "Maximum expected fee charged by the chain for a payment",
        values: {
          flare: {
            xrp: "0.0004 XRP (400 drops)",
          },
          coston2: {
            xrp: "0.0001 XRP (100 drops)",
          },
          songbird: {
            xrp: "0.0004 XRP (400 drops)",
          },
          coston: {
            xrp: "0.0001 XRP (100 drops)",
          },
        },
      },
    ],
  },
  {
    title: "Core Vault Settings",
    parameters: [
      {
        name: "Minting left on agent's address",
        functionName: "getCoreVaultMinimumAmountLeftBIPS",
        interfaceLink:
          "/fassets/reference/IAssetManager#getcorevaultminimumamountleftbips",
        description:
          "Minimum amount of minting left on agent's address after transfer to core vault. Expressed as percentage of agent's minting capacity (calculated from agent's vault and pool collateral).",
        values: {
          flare: {
            xrp: "15%",
          },
          coston2: {
            xrp: "20%",
          },
          songbird: {
            xrp: "15%",
          },
          coston: {
            xrp: "20%",
          },
        },
      },
      {
        name: "Transfer to core vault time",
        functionName: "getCoreVaultTransferTimeExtensionSeconds",
        interfaceLink:
          "/fassets/reference/IAssetManager#getcorevaulttransfertimeextensionseconds",
        description:
          "The extra time for an agent's transfer to the core vault, compared to ordinary redemption payment.",
        values: {
          flare: {
            xrp: "2 hours",
          },
          coston2: {
            xrp: "2 hours",
          },
          songbird: {
            xrp: "2 hours",
          },
          coston: {
            xrp: "2 hours",
          },
        },
      },
      {
        name: "Transfer fee to Core Vault",
        functionName: "getCoreVaultTransferTimeExtensionSeconds",
        interfaceLink:
          "/fassets/reference/IAssetManager#getcorevaulttransferfeebips",
        description:
          "Fee (in percentage of transfer amount) paid by agent for transfer to the core vault.",
        values: {
          flare: {
            xrp: "0",
          },
          coston2: {
            xrp: "0",
          },
          songbird: {
            xrp: "0",
          },
          coston: {
            xrp: "0",
          },
        },
      },
      {
        name: "Minimum number of lots for direct redemption",
        functionName: "getCoreVaultMinimumRedeemLots",
        interfaceLink:
          "/fassets/reference/IAssetManager#getcorevaultminimumredeemlots",
        description:
          "The minimum number of lots that a direct redemption from core vault can take",
        values: {
          flare: {
            xrp: "1000",
          },
          coston2: {
            xrp: "10",
          },
          songbird: {
            xrp: "1000",
          },
          coston: {
            xrp: "10",
          },
        },
      },
      {
        name: "Redemption fee",
        functionName: "getCoreVaultRedemptionFeeBIPS",
        interfaceLink:
          "/fassets/reference/IAssetManager#getcorevaultredemptionfeebips",
        description:
          "Fee (in percentage of redemption amount) paid by the redeemer for direct redemptions from the core vault.",
        values: {
          flare: {
            xrp: "0",
          },
          coston2: {
            xrp: "0",
          },
          songbird: {
            xrp: "0",
          },
          coston: {
            xrp: "0",
          },
        },
      },
    ],
  },
];
