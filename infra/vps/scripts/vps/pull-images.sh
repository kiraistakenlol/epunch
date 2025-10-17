#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOCKER_DIR="$SCRIPT_DIR/../../docker"

echo "=== Pulling Latest Docker Images ==="
echo ""

cd "$DOCKER_DIR"
docker-compose -f docker-compose.prod.yml pull

echo ""
echo "✅ All images pulled"
