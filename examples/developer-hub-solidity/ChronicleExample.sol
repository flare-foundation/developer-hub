// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {FtsoChronicleAdapterLibrary} from "@flarenetwork/ftso-adapters/contracts/coston2/ChronicleAdapter.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IChronicle {
    /// @notice Returns the oracle's identifier.
    /// @return wat The oracle's identifier.
    function wat() external view returns (bytes32 wat);

    /// @notice Returns the oracle's current value.
    /// @dev Reverts if no value set.
    /// @return value The oracle's current value.
    function read() external view returns (uint value);

    /// @notice Returns the oracle's current value and its age.
    /// @dev Reverts if no value set.
    /// @return value The oracle's current value.
    /// @return age The value's age.
    function readWithAge() external view returns (uint value, uint age);

    /// @notice Returns the oracle's current value.
    /// @return isValid True if value exists, false otherwise.
    /// @return value The oracle's current value if it exists, zero otherwise.
    function tryRead() external view returns (bool isValid, uint value);

    /// @notice Returns the oracle's current value and its age.
    /// @return isValid True if value exists, false otherwise.
    /// @return value The oracle's current value if it exists, zero otherwise.
    /// @return age The value's age if value exists, zero otherwise.
    function tryReadWithAge()
        external
        view
        returns (bool isValid, uint value, uint age);
}

/**
 * @title DynamicNftMinter
 * @notice Mints an NFT with a tier based on a live asset price from the FTSO.
 * @dev This contract implements the IChronicle interface and uses the FtsoChronicleAdapterLibrary.
 */
contract DynamicNftMinter is IChronicle, ERC721 {
    // --- Adapter State ---
    bytes21 public immutable ftsoFeedId;
    bytes32 public immutable wat; // Chronicle's name for the feed identifier.

    // The contract is now responsible for storing the cached price data.
    FtsoChronicleAdapterLibrary.DataPoint private _latestDataPoint;

    // --- Minter-Specific State ---
    enum Tier {
        None,
        Bronze,
        Silver,
        Gold
    }
    uint256 private _nextTokenId;
    uint256 public constant MINT_FEE = 0.1 ether;
    mapping(uint256 => Tier) public tokenTiers; // Stores the tier for each minted NFT.

    // Price boundaries for tiers (with 18 decimals)
    uint256 public constant SILVER_TIER_PRICE = 0.02 ether; // $0.02
    uint256 public constant GOLD_TIER_PRICE = 0.03 ether; // $0.03

    event NftMinted(address indexed owner, uint256 indexed tokenId, Tier tier);

    constructor(
        bytes21 _ftsoFeedId,
        string memory _description // e.g., "FTSO FLR/USD"
    ) ERC721("Dynamic Tier NFT", "DTN") {
        ftsoFeedId = _ftsoFeedId;
        wat = keccak256(abi.encodePacked(_description));
    }

    // --- Public Adapter Functions ---
    function refresh() external {
        FtsoChronicleAdapterLibrary.refresh(_latestDataPoint, ftsoFeedId);
    }

    // --- IChronicle Interface Implementation ---
    function read() public view override returns (uint256) {
        return FtsoChronicleAdapterLibrary.read(_latestDataPoint);
    }
    function readWithAge() public view override returns (uint256, uint256) {
        return FtsoChronicleAdapterLibrary.readWithAge(_latestDataPoint);
    }
    function tryRead() public view override returns (bool, uint256) {
        return FtsoChronicleAdapterLibrary.tryRead(_latestDataPoint);
    }
    function tryReadWithAge()
        public
        view
        override
        returns (bool, uint256, uint256)
    {
        return FtsoChronicleAdapterLibrary.tryReadWithAge(_latestDataPoint);
    }

    // --- Core Minter Functions ---
    function mint() external payable {
        require(msg.value >= MINT_FEE, "Insufficient mint fee");

        // Use the safe tryRead() to get the price.
        (bool isValid, uint256 currentPrice) = tryRead();
        require(isValid, "Price feed is not available, please refresh");

        Tier mintedTier;
        if (currentPrice >= GOLD_TIER_PRICE) {
            mintedTier = Tier.Gold;
        } else if (currentPrice >= SILVER_TIER_PRICE) {
            mintedTier = Tier.Silver;
        } else {
            mintedTier = Tier.Bronze;
        }

        uint256 newTokenId = _nextTokenId++;
        _safeMint(msg.sender, newTokenId);
        tokenTiers[newTokenId] = mintedTier;

        emit NftMinted(msg.sender, newTokenId, mintedTier);
    }
}
