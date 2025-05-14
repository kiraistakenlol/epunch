#!/bin/bash

# Script to run the E-PUNCH.io Merchant App for local development

echo "Starting E-PUNCH.io Merchant App development server..."

# Navigate to the application directory where workspaces are defined
cd "$(dirname "$0")/application" || exit

# Ensure common module is built (optional, but good for consistency if running standalone)
echo "Ensuring common module is up-to-date..."
yarn workspace e-punch-common build

# Start the merchant-app development server
echo "Starting merchant-app dev server..."
yarn workspace e-punch-merchant-app dev 