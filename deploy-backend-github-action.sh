#!/bin/bash

set -e

ENVIRONMENT=${1:-dev}

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ Error: Environment must be 'dev' or 'prod'"
    echo "Usage: $0 [dev|prod]"
    echo "Example: $0 dev"
    exit 1
fi

echo "🚀 Triggering backend deployment to $ENVIRONMENT environment..."

if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed"
    echo "Please install it with: brew install gh"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI"
    echo "Please run: gh auth login"
    exit 1
fi

echo "📡 Triggering workflow..."
gh workflow run "Deploy Backend" \
    --field environment="$ENVIRONMENT" \
    --repo $(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git/\1/')

echo "✅ Deployment triggered successfully!"
echo "🔍 You can monitor the deployment with:"
echo "   gh run list --workflow='Deploy Backend'"
echo "   gh run watch"
echo ""
echo "🌐 Or view in GitHub Actions:"
echo "   https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\)\.git/\1/')/actions" 