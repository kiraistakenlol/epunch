#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Rebuild & Restart Merchant App ==="
echo ""

"$SCRIPT_DIR/build-merchant-app.sh"
echo ""

"$SCRIPT_DIR/restart-merchant-app.sh"

echo ""
echo "✅ Merchant App rebuilt and restarted"
