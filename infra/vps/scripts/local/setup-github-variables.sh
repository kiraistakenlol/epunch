#!/bin/bash

set -e

echo "=== Setting GitHub Repository Variables ==="
echo ""
echo "This will set the following variables for GitHub Actions:"
echo "  - VITE_API_URL"
echo "  - VITE_USER_APP_URL"
echo "  - VITE_GOOGLE_REDIRECT_URI"
echo "  - GOOGLE_CLIENT_ID"
echo ""

cd "$(dirname "$0")/../../../.."

# Set variables
gh variable set VITE_API_URL --body "https://api.epunch.app/v1"
echo "✅ Set VITE_API_URL"

gh variable set VITE_USER_APP_URL --body "https://epunch.app"
echo "✅ Set VITE_USER_APP_URL"

gh variable set VITE_GOOGLE_REDIRECT_URI --body "https://epunch.app/auth/callback"
echo "✅ Set VITE_GOOGLE_REDIRECT_URI"

gh variable set GOOGLE_CLIENT_ID --body "319076167447-pohdeflv2v07jca8dbtgut9m2uena0ma.apps.googleusercontent.com"
echo "✅ Set GOOGLE_CLIENT_ID"

echo ""
echo "✅ All variables set successfully!"
echo ""
echo "View variables:"
echo "  gh variable list"
