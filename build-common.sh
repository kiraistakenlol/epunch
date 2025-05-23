#!/bin/bash

# Disable auto-attaching Node.js debugger
export NODE_OPTIONS=""

# Script to build the E-PUNCH.io common packages (core and ui)

echo "Building E-PUNCH.io common packages..."

# Navigate to the directory containing the workspace package.json
original_dir=$(pwd)
cd "$(dirname "$0")/application" || exit

# Build common-core package
echo "Building common-core package (e-punch-common-core)..."
yarn workspace e-punch-common-core build

# Build common-ui package
echo "Building common-ui package (e-punch-common-ui)..."
yarn workspace e-punch-common-ui build

echo "Cleaning Vite caches for user-app and merchant-app..."
rm -rf user-app/node_modules/.vite 2>/dev/null || true
rm -rf merchant-app/node_modules/.vite 2>/dev/null || true

echo "Common packages built and caches cleaned successfully!"

# Return to the original directory
cd "$original_dir" || exit 