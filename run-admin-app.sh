#!/bin/bash

# Disable auto-attaching Node.js debugger
export NODE_OPTIONS=""

# Navigate to the directory containing the workspace package.json
original_dir=$(pwd)
cd "$(dirname "$0")/application" || exit

echo "Building common-core package (dependency for common-ui)..."
yarn workspace e-punch-common-core build

echo "Building common-ui package (dependency for admin-app)..."
yarn workspace e-punch-common-ui build

echo "Cleaning Vite cache in admin-app..."
rm -rf admin-app/node_modules/.vite

echo "Starting admin-app development server..."
# This command will run the 'dev' script from application/admin-app/package.json
yarn workspace e-punch-admin-app dev

# Note: The script will typically stay in the 'application' directory
# while the dev server is running. To return to the original directory
# after the dev server stops (e.g., Ctrl+C), you could add:
# echo "Admin app dev server stopped. Returning to $original_dir"
# cd "$original_dir" || exit
# However, for a dev script, it's common to let it terminate in the new CWD. 