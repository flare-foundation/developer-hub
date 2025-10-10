// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {FtsoChainlinkAdapterLibrary} from "@flarenetwork/ftso-adapters/contracts/coston2/ChainlinkAdapter.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AssetVault is ERC20 {
    // --- Adapter State ---
    bytes21 public immutable ftsoFeedId;
    uint8 public immutable chainlinkDecimals;
    string public descriptionText;
    uint256 public immutable maxAgeSeconds;

    // The AssetVault is now responsible for storing the cached price data.
    FtsoChainlinkAdapterLibrary.Round private _latestPriceData;

    // Mapping of user addresses to their deposited collateral amount in wei.
    mapping(address => uint256) public collateral;

    // The Loan-to-Value (LTV) ratio, as a percentage.
    // e.g., 50 means a user can borrow up to 50% of their collateral's value.
    uint256 public constant LOAN_TO_VALUE_RATIO = 50;

    // --- Errors ---
    error InsufficientCollateral();
    error NothingToWithdraw();
    error LoanNotRepaid();
    error AmountIsZero();

    // --- Events ---
    event CollateralDeposited(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event LoanBorrowed(address indexed user, uint256 amount);
    event LoanRepaid(address indexed user, uint256 amount);

    constructor(
        bytes21 _ftsoFeedId,
        uint8 _chainlinkDecimals,
        string memory _description,
        uint256 _maxAgeSeconds
    ) ERC20("Mock USD", "MUSD") {
        // Initialize the adapter configuration state.
        ftsoFeedId = _ftsoFeedId;
        chainlinkDecimals = _chainlinkDecimals;
        descriptionText = _description;
        maxAgeSeconds = _maxAgeSeconds;
    }

    // --- Public Refresh Function ---
    // --- Public Adapter Functions ---
    function refresh() external {
        // Call the library's logic, passing this contract's state to be updated.
        FtsoChainlinkAdapterLibrary.refresh(
            _latestPriceData,
            ftsoFeedId,
            chainlinkDecimals
        );
    }

    function latestRoundData()
        public
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        // Call the library's logic, passing this contract's state to be read.
        return
            FtsoChainlinkAdapterLibrary.latestRoundData(
                _latestPriceData,
                maxAgeSeconds
            );
    }

    function decimals() public view virtual override(ERC20) returns (uint8) {
        return ERC20.decimals();
    }

    // --- Core Functions ---

    /**
     * @notice Deposits the sent native tokens as collateral for the sender.
     */
    function deposit() external payable {
        if (msg.value == 0) revert AmountIsZero();
        collateral[msg.sender] += msg.value;
        emit CollateralDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Allows a user to borrow MUSD against their deposited collateral.
     * @param _amount The amount of MUSD to borrow (with 18 decimals).
     */
    function borrow(uint256 _amount) external {
        if (_amount == 0) revert AmountIsZero();

        uint256 userCollateralValue = getCollateralValueInUsd(msg.sender);
        // The total debt will be their current MUSD balance plus the new amount.
        uint256 totalDebt = balanceOf(msg.sender) + _amount;

        // Calculate the maximum borrowable amount based on LTV.
        uint256 maxBorrowableUsd = (userCollateralValue * LOAN_TO_VALUE_RATIO) /
            100;

        if (totalDebt > maxBorrowableUsd) revert InsufficientCollateral();

        _mint(msg.sender, _amount);
        emit LoanBorrowed(msg.sender, _amount);
    }

    /**
     * @notice Repays a portion of the user's MUSD loan. The user must first approve
     * this contract to spend their MUSD.
     * @param _amount The amount of MUSD to repay.
     */
    function repay(uint256 _amount) external {
        if (_amount == 0) revert AmountIsZero();

        // The user must have enough MUSD to repay.
        // This also implicitly checks that they have a loan.
        require(balanceOf(msg.sender) >= _amount, "Insufficient MUSD balance");

        _burn(msg.sender, _amount);
        emit LoanRepaid(msg.sender, _amount);
    }

    /**
     * @notice Withdraws a specified amount of the user's collateral.
     * @dev The user must have repaid their entire MUSD loan before withdrawing.
     * @param _amount The amount of collateral to withdraw in wei.
     */
    function withdraw(uint256 _amount) external {
        if (_amount == 0) revert AmountIsZero();
        if (balanceOf(msg.sender) > 0) revert LoanNotRepaid();
        if (collateral[msg.sender] < _amount) revert NothingToWithdraw();

        collateral[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        emit CollateralWithdrawn(msg.sender, _amount);
    }

    // --- View Functions ---

    /**
     * @notice Calculates the total USD value of a user's collateral.
     * @param _user The address of the user.
     * @return The total value in USD, scaled by 18 decimals.
     */
    function getCollateralValueInUsd(
        address _user
    ) public view returns (uint256) {
        uint256 userCollateral = collateral[_user];
        if (userCollateral == 0) return 0;

        // Call this contract's own public latestRoundData function.
        (, int256 price, , , ) = latestRoundData();

        return (userCollateral * uint256(price)) / (10 ** chainlinkDecimals);
    }
}
