#!/bin/bash

set -e

GITHUB_USER="kiraistakenlol"
GITHUB_TOKEN="${1}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Usage: $0 <github-token>"
    echo ""
    echo "Example:"
    echo "  $0 ghp_xxxxxxxxxxxx"
    echo ""
    echo "Get token from: https://github.com/settings/tokens"
    echo "Required permissions: read:packages"
    exit 1
fi

echo "=== Setup GitHub Container Registry Authentication ==="
echo ""
echo "GitHub User: $GITHUB_USER"
echo ""

if ! command -v gh &> /dev/null; then
    echo "Installing GitHub CLI..."

    if command -v apt &> /dev/null; then
        type -p curl >/dev/null || (apt update && apt install curl -y)
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        apt update
        apt install gh -y
        echo "✅ GitHub CLI installed"
    else
        echo "❌ Error: apt package manager not found. Please install gh CLI manually."
        exit 1
    fi
else
    echo "✅ GitHub CLI already installed"
fi

echo ""
echo "Logging into GitHub Container Registry..."
echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin

echo ""
echo "✅ Successfully authenticated with ghcr.io"
echo ""
echo "You can now pull Docker images:"
echo "  docker pull ghcr.io/$GITHUB_USER/epunch-backend:latest"
echo "  docker pull ghcr.io/$GITHUB_USER/epunch-user-app:latest"
echo "  docker pull ghcr.io/$GITHUB_USER/epunch-merchant-app:latest"
echo "  docker pull ghcr.io/$GITHUB_USER/epunch-admin-app:latest"
