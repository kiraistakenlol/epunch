#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Building All Services ==="
echo ""

"$SCRIPT_DIR/build-backend.sh"
echo ""

"$SCRIPT_DIR/build-user-app.sh"
echo ""

"$SCRIPT_DIR/build-merchant-app.sh"
echo ""

"$SCRIPT_DIR/build-admin-app.sh"
echo ""

echo "✅ All services built"
