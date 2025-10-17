#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Build and Push All Docker Images ==="
echo ""
echo "This will build and push:"
echo "  - backend"
echo "  - user-app"
echo "  - merchant-app"
echo "  - admin-app"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

"$SCRIPT_DIR/build-and-push-backend.sh"
echo ""

"$SCRIPT_DIR/build-and-push-user-app.sh"
echo ""

"$SCRIPT_DIR/build-and-push-merchant-app.sh"
echo ""

"$SCRIPT_DIR/build-and-push-admin-app.sh"
echo ""

echo "✅ All images built and pushed successfully!"
echo ""
echo "Next steps:"
echo "  1. SSH into VPS"
echo "  2. Run: cd /root/epunch && ./infra/vps/scripts/vps/deploy.sh"
