#!/bin/bash

# Terraform Force Unlock Script
# Usage: ./force-unlock.sh [aws-profile] [lock-id]

set -e

AWS_PROFILE=${1}
LOCK_ID=${2}

if [[ -z "$AWS_PROFILE" ]]; then
    echo "❌ AWS Profile not specified"
    echo "Usage: $0 [aws-profile] [lock-id]"
    echo "Example: $0 personal 5e671c2c-2921-0337-2c6e-92d4aa5d5448"
    exit 1
fi

if [[ -z "$LOCK_ID" ]]; then
    echo "❌ Lock ID not specified"
    echo "Usage: $0 [aws-profile] [lock-id]"
    echo "Example: $0 personal 5e671c2c-2921-0337-2c6e-92d4aa5d5448"
    exit 1
fi

echo "🔓 Force unlocking Terraform state..."
echo "   AWS Profile: $AWS_PROFILE"
echo "   Lock ID: $LOCK_ID"

AWS_PROFILE=$AWS_PROFILE terraform force-unlock $LOCK_ID

echo "✅ State unlocked successfully" 