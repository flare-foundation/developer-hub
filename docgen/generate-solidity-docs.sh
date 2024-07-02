#!/bin/bash

# Set input and output paths for documentation
INPUT_PATH="docs/userInterfaces/"
OUTPUT_PATH="../technical-reference/"

OUTPUT_PATH_ABS=$(realpath "$OUTPUT_PATH")

# Read repositories from repos.list and process each one
while IFS=' ' read -r repo_url repo_branch repo_source_path hardhat_config_file build_command || [ -n "$build_command" ];
do
    # Extract repository name from URL
    repo_name=$(basename $repo_url .git)
    
    # Clone the repository with shallow depth
    rm -rf $repo_name
    git clone --depth 1 $repo_url
    
    # Move to the repository directory
    cd $repo_name
    
    # Install dependencies
    yarn
    yarn add solidity-docgen
    
    # Patch hardhat.config.ts
    sed -i.bak -E "1s/^/import 'solidity-docgen';\n/" $hardhat_config_file
    sed -i.bak -E "/HardhatUserConfig = / r ../hardhat.config.ts.patch" $hardhat_config_file
    
    # Copy templates
    cp -r ../templates .
    
    # Build docs
    yarn hardhat docgen
    
    # Copy docs
    cp -r $INPUT_PATH $OUTPUT_PATH
    
    # Move back to the previous directory
    cd ..
    
    echo "Output documentation saved to: $OUTPUT_PATH"
done < "repos.list"