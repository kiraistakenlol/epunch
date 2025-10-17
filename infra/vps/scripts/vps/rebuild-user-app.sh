#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Rebuild & Restart User App ==="
echo ""

"$SCRIPT_DIR/build-user-app.sh"
echo ""

"$SCRIPT_DIR/restart-user-app.sh"

echo ""
echo "✅ User App rebuilt and restarted"
