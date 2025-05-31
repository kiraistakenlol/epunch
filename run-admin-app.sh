#!/bin/bash

# Build common packages first
echo "Building common packages..."
cd application/common-core && yarn build
cd ../common-ui && yarn build

# Start admin app
echo "Starting admin app..."
cd ../admin-app && yarn dev 