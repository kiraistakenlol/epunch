#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../../../.."

echo "=== Deploy Latest Code ==="
echo ""
echo "This will:"
echo "  1. Git pull latest changes"
echo "  2. Rebuild all services"
echo "  3. Restart all services"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Step 1: Pulling latest code..."
cd "$PROJECT_ROOT"
git pull

echo ""
echo "Step 2: Building all services..."
"$SCRIPT_DIR/build-all.sh"

echo ""
echo "Step 3: Restarting all services..."
"$SCRIPT_DIR/restart-all.sh"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Check logs:"
echo "  cd $SCRIPT_DIR/../../docker"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
