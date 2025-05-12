#!/bin/bash

cd application/backend

# Build common package first
echo "Building common package..."
yarn workspace e-punch-common build

# Run backend
echo "Starting backend..."
yarn workspace e-punch-backend start:dev