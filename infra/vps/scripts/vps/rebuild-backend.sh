#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Rebuild & Restart Backend ==="
echo ""

"$SCRIPT_DIR/build-backend.sh"
echo ""

"$SCRIPT_DIR/restart-backend.sh"

echo ""
echo "✅ Backend rebuilt and restarted"
