// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

/// @title SettlementTime
/// @notice Earliest settlement: 00:00 UTC on the day after the coverage date (YYYY-MM-DD).
///         Past coverage dates are already unlocked; today unlocks after tonight's midnight UTC.
library SettlementTime {
    uint256 internal constant SECONDS_PER_DAY = 86400;

    /// @notice Unix timestamp when `requestSettlement` / `settle` are allowed.
    function unlockAt(string memory dateYmd) external pure returns (uint64) {
        (uint256 y, uint256 m, uint256 d) = _parseYMD(dateYmd);
        return uint64(_unixFromYMD(y, m, d) + SECONDS_PER_DAY);
    }

    function _parseYMD(string memory dateYmd) private pure returns (uint256 y, uint256 m, uint256 d) {
        bytes memory b = bytes(dateYmd);
        require(b.length == 10, "bad date length");
        require(b[4] == 0x2D && b[7] == 0x2D, "bad date format");
        y = _digit(b[0]) * 1000 + _digit(b[1]) * 100 + _digit(b[2]) * 10 + _digit(b[3]);
        m = _digit(b[5]) * 10 + _digit(b[6]);
        d = _digit(b[8]) * 10 + _digit(b[9]);
        require(m >= 1 && m <= 12, "bad month");
        require(d >= 1 && d <= 31, "bad day");
    }

    function _digit(bytes1 c) private pure returns (uint256) {
        uint8 u = uint8(c);
        require(u >= 0x30 && u <= 0x39, "bad digit");
        return u - 0x30;
    }

    /// @dev 00:00:00 UTC on y-m-d (Howard Hinnant).
    function _unixFromYMD(uint256 y, uint256 m, uint256 d) private pure returns (uint256) {
        uint256 year = y;
        uint256 month = m;
        if (month <= 2) {
            year -= 1;
            month += 12;
        }
        uint256 era = year / 400;
        uint256 yoe = year - era * 400;
        uint256 doy = (153 * (month - 3) + 2) / 5 + d - 1;
        uint256 doe = yoe * 365 + yoe / 4 - yoe / 100 + doy;
        uint256 dayIndex = era * 146097 + doe - 719468;
        return dayIndex * SECONDS_PER_DAY;
    }
}
