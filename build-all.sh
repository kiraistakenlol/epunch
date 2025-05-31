#!/bin/bash

# Disable auto-attaching Node.js debugger
export NODE_OPTIONS=""

# Script to build all E-PUNCH.io modules

echo "Building all E-PUNCH.io modules..."

# Navigate to the directory containing the workspace package.json
original_dir=$(pwd)
cd "$(dirname "$0")/application" || exit

# Build common-core package
echo "Building common-core package..."
yarn workspace e-punch-common-core build

# Build common-ui package (formerly common)
echo "Building common-ui package..."
yarn workspace e-punch-common-ui build

# Build backend
echo "Building backend..."
yarn workspace e-punch-backend build

# Clean Vite caches for frontend apps
echo "Cleaning Vite caches..."
rm -rf user-app/node_modules/.vite
rm -rf merchant-app/node_modules/.vite
rm -rf admin-app/node_modules/.vite

# Build user-app
echo "Building user-app..."
yarn workspace e-punch-user-app build

# Build merchant-app
echo "Building merchant-app..."
yarn workspace e-punch-merchant-app build

# Build admin-app
echo "Building admin-app..."
yarn workspace e-punch-admin-app build

echo "All modules built successfully!"

# Return to the original directory
cd "$original_dir" || exit 