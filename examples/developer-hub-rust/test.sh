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