#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Building User App ==="

cd "$DOCKER_DIR"
docker-compose -f docker-compose.prod.yml build user-app

echo "✅ User App built"
