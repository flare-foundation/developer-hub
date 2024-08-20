#!/bin/bash

# Run the compiled Rust program and capture its output
output=$(cargo run --bin chain_id_coston2)

# Define the expected output
expected_output="Chain ID: 114"

# Compare the captured output with the expected output
if [ "$output" == "$expected_output" ]; then
    echo "chain_id_coston2: Output matches expected output."
else
    echo "chain_id_coston2: Output does not match expected output."
    exit 1
fi

output=$(cargo run --bin chain_id_flare)
expected_output="Chain ID: 14"
if [ "$output" == "$expected_output" ]; then
    echo "chain_id_flare: Output matches expected output."
else
    echo "chain_id_flare: Output does not match expected output."
    exit 1
fi

output=$(cargo run --bin ftsov2_config_coston2 | tr -d '\0' )
if echo "$output" | grep -q "feedId:"; then
    echo "feedId matches in the output"
else
    echo "feedId does not match in ouput"
    exit 1
fi

if echo "$output" | grep -q "rewardBandValue"; then
    echo "rewardBandValue matches in the outpot"
else
    echo "rewardBandValue does not match in  the output"
    exit 1
fi

if echo "$output" | grep -q "inflationShare"; then
    echo "inflationShare matches in the output"
else
    echo "inflationShare does not match in the output"
    exit 1
fi

output=$(cargo run --bin ftsov2_consumer_coston2)

if echo "$output" | grep -q "Feeds:"; then
    echo "Feeds match in the output"
else
    echo "Feeds do no match in the output"
    exit 1
fi

if echo "$output" | grep -q "Decimals"; then
    echo "Decimals match in the output"
else
    echo "Decimals do not match in output"
    exit 1
fi

if echo "$output" | grep -q "Timestamp"; then
    echo "Timestamp exists in the output"
else
    echo "Timestamp does not match in the output"
    exit 1
fi

output=$(cargo run --bin make_query_coston2)
expected_output="WNat address: 0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273"
if [ "$output" == "$expected_output" ]; then
    echo "WNat address: Output matches expected output."
else
    echo "WNat address: Output does not match expected output."
    exit 1
fi

output=$(cargo run --bin make_query_flare)
expected_output="WNat address: 0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d"
if [ "$output" == "$expected_output" ]; then
    echo "WNat address: Output matches expected output."
else
    echo "WNat address: Output does not match expected output."
    exit 1
fi

output=$(cargo run --bin secure_random_coston2)
if echo "$output" | grep -q "Random Number:"; then
    echo "Random Number matches in the output"
else
    echo "Random Number do no match in the output"
    exit 1
fi

if echo "$output" | grep -q "Is secure random"; then
    echo "Is secure random matches in the output"
else
    echo "Is secure random do not match in output"
    exit 1
fi

if echo "$output" | grep -q "Timestamp"; then
    echo "Timestamp exists in the output"
else
    echo "Timestamp does not match in the output"
    exit 1
fi