#!/bin/bash

# chain_id_coston2
output=$(node chain_id_coston2.js)
expected_output="114n"
if [ "$output" == "$expected_output" ]; then
    echo "chain_id_coston2: Output matches expected output."
else
    echo "chain_id_coston2: Output does not match expected output."
    exit 1
fi

# chain_id_flare
output=$(node chain_id_flare.js)
expected_output="14n"
if [ "$output" == "$expected_output" ]; then
    echo "chain_id_flare: Output matches expected output."
else
    echo "chain_id_flare: Output does not match expected output."
    exit 1
fi