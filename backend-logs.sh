#!/bin/bash

# Script to stream E-PUNCH.io backend logs from Fly.io in real-time

echo "Streaming logs from E-PUNCH.io backend (Press Ctrl+C to stop)..."
fly logs -a e-punch-backend 