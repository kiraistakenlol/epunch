#!/bin/bash

cd application/frontend

echo "Building common package..."
yarn workspace e-punch-common build

echo "Starting frontend..."
yarn workspace e-punch-frontend dev 