#!/bin/bash

set -e
set -o pipefail

run_test() {
    local test_name="$1"
    local binary_name="$2"
    local check_type="$3"
    shift 3 # Shift past the first three arguments
    local expected_patterns=("$@") # The rest of the arguments are the patterns

    echo -n "Testing: $test_name... "

    # Run the compiled binary and capture its output
    local output
    output=$(./target/debug/"$binary_name" | tr -d '\0')

    if [ "$check_type" == "exact" ]; then
        if [ "$output" == "${expected_patterns[0]}" ]; then
            echo "[PASS]"
        else
            echo "[FAIL]"
            echo "  Expected: '${expected_patterns[0]}'"
            echo "  Got:      '$output'"
            exit 1
        fi
    elif [ "$check_type" == "contains" ]; then
        for pattern in "${expected_patterns[@]}"; do
            if ! echo "$output" | grep -qF "$pattern"; then
                echo "[FAIL]"
                echo "  Output did not contain expected pattern: '$pattern'"
                echo "  Full Output:"
                echo "$output"
                exit 1
            fi
        done
        echo "[PASS]"
    else
        echo "[FAIL]"
        echo "  Unknown check type: $check_type"
        exit 1
    fi
}

main() {
    echo "--- Building all example binaries ---"
    cargo build --bins
    echo ""

    echo "--- Running All Tests ---"
    run_test "Coston2 Chain ID" "chain_id_coston2" "exact" "Chain ID: 114"
    run_test "Flare Chain ID" "chain_id_flare" "exact" "Chain ID: 14"
    run_test "Coston2 WNat Address" "make_query_coston2" "exact" "WNat address: 0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273"
    run_test "Flare WNat Address" "make_query_flare" "exact" "WNat address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d"
    run_test "FTSO V2 Config (Coston2)" "ftsov2_config_coston2" "contains" "feedId:" "rewardBandValue" "inflationShare"
    run_test "FTSO V2 Consumer (Coston2)" "ftsov2_consumer_coston2" "contains" "Feeds:" "Decimals" "Timestamp"
    run_test "Secure Random (Coston2)" "secure_random_coston2" "contains" "Random Number:" "Is secure random" "Timestamp"

    echo ""
    echo ">>> All tests passed successfully! <<<"
}

main
