#!/bin/bash

# Script to remove all node_modules directories and reinstall dependencies

echo "Removing all node_modules directories..."

# Remove root node_modules
if [ -d "node_modules" ]; then
  echo "Removing root node_modules/"
  rm -rf node_modules
fi

# Remove application-level node_modules (often created by yarn workspaces for hoisted deps)
if [ -d "application/node_modules" ]; then
  echo "Removing application/node_modules/"
  rm -rf application/node_modules
fi

# Remove node_modules from each workspace package
if [ -d "application/common-core/node_modules" ]; then
  echo "Removing application/common-core/node_modules/"
  rm -rf application/common-core/node_modules
fi

if [ -d "application/common/node_modules" ]; then
  echo "Removing application/common/node_modules/"
  rm -rf application/common/node_modules
fi

if [ -d "application/user-app/node_modules" ]; then
  echo "Removing application/user-app/node_modules/"
  rm -rf application/user-app/node_modules
fi

if [ -d "application/backend/node_modules" ]; then
  echo "Removing application/backend/node_modules/"
  rm -rf application/backend/node_modules
fi

if [ -d "application/merchant-app/node_modules" ]; then
  echo "Removing application/merchant-app/node_modules/"
  rm -rf application/merchant-app/node_modules
fi

echo "All specified node_modules directories removed."

echo "Reinstalling all dependencies using Yarn Workspaces..."

# Yarn install from the root should handle workspaces defined in application/package.json

cd application && yarn install

echo "Reinstallation complete!" 