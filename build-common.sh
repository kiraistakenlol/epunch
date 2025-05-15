#!/bin/bash

# Disable auto-attaching Node.js debugger
export NODE_OPTIONS=""

# Script to build the E-PUNCH.io common package

echo "Building E-PUNCH.io common package..."

# Navigate to the directory containing the workspace package.json
original_dir=$(pwd)
cd "$(dirname "$0")/application" || exit

# Build common package
echo "Building common package..."
yarn workspace e-punch-common build

echo "Common package built successfully!"

# Return to the original directory
cd "$original_dir" || exit 