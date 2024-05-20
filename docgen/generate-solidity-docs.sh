#!/bin/bash

# See README.md for usage instructions.

set -e

# Defined in repos.list
while IFS=' ' read -r repo_url repo_branch repo_source_path hardhat_config_file build_command || [ -n "$build_command" ];
do
    repo_name=$(basename $repo_url .git)
    rm -rf $repo_name
    git clone --depth 1 $repo_url

    # Move to the repo
    cd $repo_name
    git checkout $repo_branch

    # Install dependencies
    yarn
    yarn add solidity-docgen

    # Patch hardhat.config.ts
    sed -i -E "1s/^/import 'solidity-docgen';\n/" $hardhat_config_file
    sed -i -E "/HardhatUserConfig = / r ../hardhat.config.ts.patch" $hardhat_config_file

    # Copy template
    cp -r ../templates .
    
    # Build docs
    echo -e "\nBuilding docs for $repo_name"
    yarn hardhat docgen

    # Copy docs
    cp -r docs/userInterfaces/ ../../docs/technical-reference/contracts/
done < "repos.list"