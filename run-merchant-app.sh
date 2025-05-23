#!/bin/bash

# Disable auto-attaching Node.js debugger
export NODE_OPTIONS=""

# Script to run the E-PUNCH.io Merchant App for local development

echo "Starting E-PUNCH.io Merchant App development server..."

# Navigate to the application directory where workspaces are defined
cd "$(dirname "$0")/application" || exit

# Ensure common modules are built (optional, but good for consistency if running standalone)
echo "Building common-core package (dependency for common-ui)..."
yarn workspace e-punch-common-core build

echo "Building common-ui package (dependency for merchant-app)..."
yarn workspace e-punch-common-ui build

echo "Cleaning Vite cache in merchant-app..."
rm -rf merchant-app/node_modules/.vite

# Start the merchant-app development server
echo "Starting merchant-app dev server..."
yarn workspace e-punch-merchant-app dev 