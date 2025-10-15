#!/bin/bash

set -e

VPS_HOST="root@45.32.117.48"
VPS_DIR="/root/epunch"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INFRA_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "=== Sync Environment Files to VPS ==="

ENV_FILES=(
    "backend.env"
    "postgres.env"
)

echo "Checking runtime environment files..."
for file in "${ENV_FILES[@]}"; do
    if [ ! -f "$INFRA_DIR/env/$file" ]; then
        echo "❌ Error: $INFRA_DIR/env/$file not found"
        exit 1
    fi
    echo "✓ $file"
done

echo ""
echo "Checking build-time environment file..."
if [ ! -f "$INFRA_DIR/docker/.env" ]; then
    echo "❌ Error: $INFRA_DIR/docker/.env not found"
    exit 1
fi
echo "✓ docker/.env"

echo ""
echo "Syncing runtime configs to $VPS_HOST:$VPS_DIR/infra/vps/env/"
scp "$INFRA_DIR/env"/*.env "$VPS_HOST:$VPS_DIR/infra/vps/env/"

echo ""
echo "Syncing build-time config to $VPS_HOST:$VPS_DIR/infra/vps/docker/"
scp "$INFRA_DIR/docker/.env" "$VPS_HOST:$VPS_DIR/infra/vps/docker/"

echo ""
echo "✅ All environment files synced"
echo ""
echo "To apply runtime config changes, restart services:"
echo "  ssh $VPS_HOST 'cd $VPS_DIR/infra/vps/scripts/vps && ./restart-all.sh'"
echo ""
echo "To apply build-time config changes, rebuild frontends:"
echo "  ssh $VPS_HOST 'cd $VPS_DIR/infra/vps/scripts/vps && ./rebuild-user-app.sh'"
