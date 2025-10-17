#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/../../../.."

echo "=== Initial VPS Setup ==="
echo ""
echo "This script prepares the VPS for first deployment."
echo ""

# Check we're in the right place
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    echo "❌ Error: Not in project root. Expected to find package.json"
    echo "Current location: $PROJECT_ROOT"
    exit 1
fi

echo "Step 1: Creating data directories..."
mkdir -p "$PROJECT_ROOT/data/postgres"
mkdir -p "$PROJECT_ROOT/uploads"
echo "✅ Directories created"

echo ""
echo "Step 2: Checking environment files..."
REQUIRED_FILES=(
    "$SCRIPT_DIR/../../env/backend.env"
    "$SCRIPT_DIR/../../env/postgres.env"
    "$SCRIPT_DIR/../../docker/.env"
)

MISSING_FILES=()
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo "❌ Missing environment files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    echo ""
    echo "Please copy environment files from your local machine:"
    echo "  scp local/infra/vps/env/*.env root@45.32.117.48:/root/epunch/infra/vps/env/"
    echo "  scp local/infra/vps/docker/.env root@45.32.117.48:/root/epunch/infra/vps/docker/"
    exit 1
fi

echo "✅ All environment files present"

echo ""
echo "✅ Initial setup complete!"
echo ""
echo "Next steps:"
echo "  ./build-all.sh"
echo "  ./start-all.sh"
