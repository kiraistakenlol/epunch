#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Rebuild & Restart Admin App ==="
echo ""

"$SCRIPT_DIR/build-admin-app.sh"
echo ""

"$SCRIPT_DIR/restart-admin-app.sh"

echo ""
echo "✅ Admin App rebuilt and restarted"
