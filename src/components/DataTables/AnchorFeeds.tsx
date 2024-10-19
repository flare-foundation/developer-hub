import React from "react";
import CopyButton from "../CopyButton";

const tableData = [
  {
    feedName: "FLR/USD",
    feedIndex: 0,
    feedId: "0x01464c522f55534400000000000000000000000000",
    baseAsset: "Flare",
    decimals: 7,
    category: "Crypto",
  },
  {
    feedName: "SGB/USD",
    feedIndex: 1,
    feedId: "0x015347422f55534400000000000000000000000000",
    baseAsset: "Songbird",
    decimals: 8,
    category: "Crypto",
  },
  {
    feedName: "BTC/USD",
    feedIndex: 2,
    feedId: "0x014254432f55534400000000000000000000000000",
    baseAsset: "Bitcoin",
    decimals: 2,
    category: "Crypto",
  },
  {
    feedName: "XRP/USD",
    feedIndex: 3,
    feedId: "0x015852502f55534400000000000000000000000000",
    baseAsset: "XRP",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "LTC/USD",
    feedIndex: 4,
    feedId: "0x014c54432f55534400000000000000000000000000",
    baseAsset: "Litecoin",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "XLM/USD",
    feedIndex: 5,
    feedId: "0x01584c4d2f55534400000000000000000000000000",
    baseAsset: "Stellar",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "DOGE/USD",
    feedIndex: 6,
    feedId: "0x01444f47452f555344000000000000000000000000",
    baseAsset: "Dogecoin",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "ADA/USD",
    feedIndex: 7,
    feedId: "0x014144412f55534400000000000000000000000000",
    baseAsset: "Cardano",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "ALGO/USD",
    feedIndex: 8,
    feedId: "0x01414c474f2f555344000000000000000000000000",
    baseAsset: "Algorand",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "ETH/USD",
    feedIndex: 9,
    feedId: "0x014554482f55534400000000000000000000000000",
    baseAsset: "Ethereum",
    decimals: 3,
    category: "Crypto",
  },
  {
    feedName: "FIL/USD",
    feedIndex: 10,
    feedId: "0x0146494c2f55534400000000000000000000000000",
    baseAsset: "Filecoin",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "ARB/USD",
    feedIndex: 11,
    feedId: "0x014152422f55534400000000000000000000000000",
    baseAsset: "Arbitrum",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "AVAX/USD",
    feedIndex: 12,
    feedId: "0x01415641582f555344000000000000000000000000",
    baseAsset: "Avalanche",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "BNB/USD",
    feedIndex: 13,
    feedId: "0x01424e422f55534400000000000000000000000000",
    baseAsset: "BNB",
    decimals: 4,
    category: "Crypto",
  },
  {
    feedName: "MATIC/USD",
    feedIndex: 14,
    feedId: "0x014d415449432f5553440000000000000000000000",
    baseAsset: "Polygon",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "SOL/USD",
    feedIndex: 15,
    feedId: "0x01534f4c2f55534400000000000000000000000000",
    baseAsset: "Solana",
    decimals: 4,
    category: "Crypto",
  },
  {
    feedName: "USDC/USD",
    feedIndex: 16,
    feedId: "0x01555344432f555344000000000000000000000000",
    baseAsset: "USDC",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "USDT/USD",
    feedIndex: 17,
    feedId: "0x01555344542f555344000000000000000000000000",
    baseAsset: "Tether",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "XDC/USD",
    feedIndex: 18,
    feedId: "0x015844432f55534400000000000000000000000000",
    baseAsset: "XDC Network",
    decimals: 7,
    category: "Crypto",
  },
  {
    feedName: "TRX/USD",
    feedIndex: 19,
    feedId: "0x015452582f55534400000000000000000000000000",
    baseAsset: "TRON",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "LINK/USD",
    feedIndex: 20,
    feedId: "0x014c494e4b2f555344000000000000000000000000",
    baseAsset: "Chainlink",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "ATOM/USD",
    feedIndex: 21,
    feedId: "0x0141544f4d2f555344000000000000000000000000",
    baseAsset: "Cosmos Hub",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "DOT/USD",
    feedIndex: 22,
    feedId: "0x01444f542f55534400000000000000000000000000",
    baseAsset: "Polkadot",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "TON/USD",
    feedIndex: 23,
    feedId: "0x01544f4e2f55534400000000000000000000000000",
    baseAsset: "Toncoin",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "ICP/USD",
    feedIndex: 24,
    feedId: "0x014943502f55534400000000000000000000000000",
    baseAsset: "Internet Computer",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "SHIB/USD",
    feedIndex: 25,
    feedId: "0x01534849422f555344000000000000000000000000",
    baseAsset: "Shiba Inu",
    decimals: 10,
    category: "Crypto",
  },
  {
    feedName: "DAI/USD",
    feedIndex: 26,
    feedId: "0x014441492f55534400000000000000000000000000",
    baseAsset: "Dai",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "BCH/USD",
    feedIndex: 27,
    feedId: "0x014243482f55534400000000000000000000000000",
    baseAsset: "Bitcoin Cash",
    decimals: 4,
    category: "Crypto",
  },
  {
    feedName: "NEAR/USD",
    feedIndex: 28,
    feedId: "0x014e4541522f555344000000000000000000000000",
    baseAsset: "NEAR Protocol",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "LEO/USD",
    feedIndex: 29,
    feedId: "0x014c454f2f55534400000000000000000000000000",
    baseAsset: "LEO Token",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "UNI/USD",
    feedIndex: 30,
    feedId: "0x01554e492f55534400000000000000000000000000",
    baseAsset: "Uniswap",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "ETC/USD",
    feedIndex: 31,
    feedId: "0x014554432f55534400000000000000000000000000",
    baseAsset: "Ethereum Classic",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "WIF/USD",
    feedIndex: 32,
    feedId: "0x015749462f55534400000000000000000000000000",
    baseAsset: "dogwifhat",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "BONK/USD",
    feedIndex: 33,
    feedId: "0x01424f4e4b2f555344000000000000000000000000",
    baseAsset: "Bonk",
    decimals: 10,
    category: "Crypto",
  },
  {
    feedName: "JUP/USD",
    feedIndex: 34,
    feedId: "0x014a55502f55534400000000000000000000000000",
    baseAsset: "Jupiter",
    decimals: 5,
    category: "Crypto",
  },
  {
    feedName: "ETHFI/USD",
    feedIndex: 35,
    feedId: "0x0145544846492f5553440000000000000000000000",
    baseAsset: "EthereumFi",
    decimals: 6,
    category: "Crypto",
  },

  {
    feedName: "ENA/USD",
    feedIndex: 36,
    feedId: "0x01454e412f55534400000000000000000000000000",
    baseAsset: "Ethena",
    decimals: 6,
    category: "Crypto",
  },
  {
    feedName: "PYTH/USD",
    feedIndex: 37,
    feedId: "0x01505954482f555344000000000000000000000000",
    baseAsset: "Pyth Network",
    decimals: 6,
    category: "Crypto",
  },
];

const AnchorFeeds = () => {
  return (
    <table className="data-table">
      <thead>
        <tr className="table-header">
          <th>Feed Name</th>
          <th>Feed ID</th>
          <th>Base Asset</th>
          <th>Decimals</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index} className="table-row">
            <td className="regular-font">{row.feedName}</td>
            <td className="feed-id mono-font">
              <div className="feed-id-container">
                <span className="feed-id-text">{row.feedId}</span>
                <CopyButton textToCopy={row.feedId} />
              </div>
            </td>
            <td className="regular-font">{row.baseAsset}</td>
            <td className="regular-font">{row.decimals}</td>
            <td className="regular-font">{row.category}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AnchorFeeds;
