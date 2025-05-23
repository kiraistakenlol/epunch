#!/bin/bash

cd "$(dirname "$0")/application" || exit # Navigate to application dir

# Build common-core package (dependency for backend)
echo "Building common-core package..."
yarn workspace e-punch-common-core build

# Run backend
echo "Starting backend..."
yarn workspace e-punch-backend start:dev