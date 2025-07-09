#!/bin/bash

# Disable auto-attaching Node.js debugger
export NODE_OPTIONS=""

# Script to build all E-PUNCH.io modules

echo "Building all E-PUNCH.io modules..."

# Navigate to the directory containing the workspace package.json
original_dir=$(pwd)
cd "$(dirname "$0")/application" || exit

# Function to build a module and track status
build_module() {
    local module_name="$1"
    local build_command="$2"
    
    if eval "$build_command" > /dev/null 2>&1; then
        echo "$module_name: ✅"
        return 0
    else
        echo "$module_name: ❌"
        echo "Error building $module_name:"
        eval "$build_command"
        return 1
    fi
}

# Build common-core package
build_module "common-core" "yarn workspace e-punch-common-core build"

# Build common-ui package (formerly common)
build_module "common-ui" "yarn workspace e-punch-common-ui build"

# Build backend
build_module "backend" "yarn workspace e-punch-backend build"

# Clean Vite caches for frontend apps
rm -rf user-app/node_modules/.vite
rm -rf merchant-app/node_modules/.vite
rm -rf admin-app/node_modules/.vite

# Build user-app
build_module "user-app" "yarn workspace e-punch-user-app build"

# Build merchant-app
build_module "merchant-app" "yarn workspace e-punch-merchant-app build"

# Build admin-app
build_module "admin-app" "yarn workspace e-punch-admin-app build"

echo "Build process completed!"

# Return to the original directory
cd "$original_dir" || exit 