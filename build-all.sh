#!/bin/bash

# Script to build all E-PUNCH.io modules

echo "Building all E-PUNCH.io modules..."

# Navigate to the directory containing the workspace package.json
original_dir=$(pwd)
cd "$(dirname "$0")/application" || exit

# Build common package
echo "Building common package..."
yarn workspace e-punch-common build

# Build backend
echo "Building backend..."
yarn workspace e-punch-backend build

# Build user-app
echo "Building user-app..."
yarn workspace e-punch-user-app build

echo "All modules built successfully!"

# Return to the original directory
cd "$original_dir" || exit 