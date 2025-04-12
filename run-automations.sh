#!/bin/bash

# Script run automations:
# - Update contract addresses (from onchain ContractRegistry)
# - Update feed risks (from automations/*_risk.json)
# Usage: ./run-automations.sh

set -e # Exit immediately if a command exits with a non-zero status

# Define colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Log start time
START_TIME=$(date +%s)
echo -e "${GREEN}Starting dependency updates at $(date)...${NC}"

# Function to handle directory changes safely
goto_dir() {
  if ! cd "$1"; then
    echo -e "${RED}Failed to change to directory: $1${NC}"
    return 1
  fi
  return 0
}

# Function for logging
log_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
  echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

AUTOMATION_SUCCESS=false

# Run automation scripts
echo -e "\n${GREEN}Running automation scripts...${NC}"
if [ -d "automations" ]; then
  if goto_dir "automations"; then
    echo "Running solidity reference table generator..."
    if uv run solidity_reference_table_generator.py; then
      echo "Running feed table generator..."
      if uv run feed_table_generator.py; then
        AUTOMATION_SUCCESS=true
        log_success "Automation scripts completed"
      else
        log_error "Feed table generator failed"
      fi
    else
      log_error "Solidity reference table generator failed"
    fi
    cd ..
  fi
else
  log_warning "Automations directory not found, skipping"
fi

if [ "$AUTOMATION_SUCCESS" = true ]; then
  log_success "Automation scripts were run successfully"
else
  log_error "Automation scripts failed or were skipped"
fi

# Calculate and display runtime
END_TIME=$(date +%s)
RUNTIME=$((END_TIME - START_TIME))
echo -e "\n${GREEN}Script completed in ${RUNTIME} seconds"