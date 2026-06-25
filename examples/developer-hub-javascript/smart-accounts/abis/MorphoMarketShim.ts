export const abi = [
  {
    inputs: [
      { internalType: "address", name: "_morpho", type: "address" },
      {
        components: [
          { internalType: "address", name: "loanToken", type: "address" },
          { internalType: "address", name: "collateralToken", type: "address" },
          { internalType: "address", name: "oracle", type: "address" },
          { internalType: "address", name: "irm", type: "address" },
          { internalType: "uint256", name: "lltv", type: "uint256" },
        ],
        internalType: "struct MarketParams",
        name: "params",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ApproveFailed", type: "error" },
  { inputs: [], name: "TransferFromFailed", type: "error" },
  { inputs: [], name: "UnauthorizedCallback", type: "error" },
  {
    inputs: [],
    name: "collateralToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "irm",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lltv",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "loanToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "morpho",
    outputs: [{ internalType: "contract IMorpho", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "onMorphoRepay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "repayShares", type: "uint256" },
      { internalType: "uint256", name: "withdrawAssets", type: "uint256" },
      { internalType: "address", name: "collateralReceiver", type: "address" },
    ],
    name: "repayAndWithdrawCollateral",
    outputs: [
      { internalType: "uint256", name: "assetsRepaid", type: "uint256" },
      { internalType: "uint256", name: "sharesRepaid", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "collateralAssets", type: "uint256" },
      { internalType: "uint256", name: "borrowAssets", type: "uint256" },
      { internalType: "address", name: "borrowReceiver", type: "address" },
    ],
    name: "supplyAndBorrow",
    outputs: [
      { internalType: "uint256", name: "assetsBorrowed", type: "uint256" },
      { internalType: "uint256", name: "sharesBorrowed", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
