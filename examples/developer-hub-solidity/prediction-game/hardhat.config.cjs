require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0x4f7ec141942c84778fac9566a93f1288f8ba52ca91031de00a932e24109022cc",
      ],
    },
  },
};
