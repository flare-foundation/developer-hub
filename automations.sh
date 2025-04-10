#!/bin/bash

# Script to update dependencies and run automations
# Usage: ./automations.sh

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

# Track success/failure of each module
JS_SUCCESS=false
GO_SUCCESS=false
PY_SUCCESS=false
RUST_SUCCESS=false
AUTOMATION_SUCCESS=false

# Update JavaScript dependencies
if [ -d "examples/developer-hub-javascript" ]; then
  echo -e "\n${GREEN}Updating JavaScript dependencies...${NC}"
  if goto_dir "examples/developer-hub-javascript"; then
    if npm update && npm install; then
      JS_SUCCESS=true
      log_success "JavaScript dependencies updated"
    else
      log_error "JavaScript update failed"
    fi
    cd ../..
  fi
else
  log_warning "JavaScript directory not found, skipping"
fi

# Update Go dependencies
if [ -d "examples/developer-hub-go" ]; then
  echo -e "\n${GREEN}Updating Go dependencies...${NC}"
  if goto_dir "examples/developer-hub-go"; then
    if go get -u ./... && go mod tidy; then
      GO_SUCCESS=true
      log_success "Go dependencies updated"
    else
      log_error "Go update failed"
    fi
    cd ../..
  fi
else
  log_warning "Go directory not found, skipping"
fi

# Update Python dependencies using uv
if [ -d "examples/developer-hub-python" ]; then
  echo -e "\n${GREEN}Updating Python dependencies...${NC}"
  if goto_dir "examples/developer-hub-python"; then
    if uv lock --upgrade; then
      PY_SUCCESS=true
      log_success "Python dependencies updated"
    else
      log_error "Python update failed"
    fi
    cd ../..
  fi
else
  log_warning "Python directory not found, skipping"
fi

# Update Rust dependencies
if [ -d "examples/developer-hub-rust" ]; then
  echo -e "\n${GREEN}Updating Rust dependencies...${NC}"
  if goto_dir "examples/developer-hub-rust"; then
    if cargo update; then
      RUST_SUCCESS=true
      log_success "Rust dependencies updated"
    else
      log_error "Rust update failed"
    fi
    cd ../..
  fi
else
  log_warning "Rust directory not found, skipping"
fi

echo -e "\n${GREEN}All dependency updates completed!${NC}"

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

# Print summary of what was updated
echo -e "\n${GREEN}===== Update Summary =====${NC}"
if [ "$JS_SUCCESS" = true ] && [ -f "examples/developer-hub-javascript/package-lock.json" ]; then
  log_success "JavaScript: package-lock.json updated"
else
  log_error "JavaScript: update incomplete or package-lock.json not found"
fi

if [ "$GO_SUCCESS" = true ] && [ -f "examples/developer-hub-go/go.sum" ]; then
  log_success "Go: go.sum updated"
else
  log_error "Go: update incomplete or go.sum not found"
fi

if [ "$PY_SUCCESS" = true ] && [ -f "examples/developer-hub-python/uv.lock" ]; then
  log_success "Python: uv.lock updated"
else
  log_error "Python: update incomplete or uv.lock not found"
fi

if [ "$RUST_SUCCESS" = true ] && [ -f "examples/developer-hub-rust/Cargo.lock" ]; then
  log_success "Rust: Cargo.lock updated"
else
  log_error "Rust: update incomplete or Cargo.lock not found"
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