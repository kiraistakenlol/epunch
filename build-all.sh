#!/bin/bash

cd application

echo "Building all E-PUNCH.io modules..."

# Build common package first
echo "Building common package..."
yarn workspace e-punch-common build

# Build backend
echo "Building backend..."
yarn workspace e-punch-backend build

# Build frontend
echo "Building frontend..."
yarn workspace e-punch-frontend build

echo "All modules built successfully!" 