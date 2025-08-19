#!/bin/bash

if [ ! -f "build/llms.txt" ] || [ ! -f "build/llms-full.txt" ]; then
  echo "⚠️  LLMs files not found!"
else
  echo "✅ LLMs files found"

  if grep -q "https://dev\.flare\.network/[^)]*/\d+-" build/llms.txt; then
    echo "⚠️  Found URLs with prepended numbers! "
  else
    echo "✅ All URLs are correctly formatted"
  fi
fi