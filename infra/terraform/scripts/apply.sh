#!/bin/bash

# Terraform Apply Script
# Usage: ./apply.sh [aws-profile] [dev|prod]

set -e

AWS_PROFILE=${1}
ENVIRONMENT=${2}

if [[ -z "$AWS_PROFILE" ]]; then
    echo "❌ AWS Profile not specified"
    echo "Usage: $0 [aws-profile] [dev|prod]"
    exit 1
fi

if [[ -z "$ENVIRONMENT" ]]; then
    echo "❌ Environment not specified"
    echo "Usage: $0 [aws-profile] [dev|prod]"
    exit 1
fi

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ Invalid environment. Use 'dev' or 'prod'"
    exit 1
fi

if [[ ! -f "env/${ENVIRONMENT}.tfvars" ]]; then
    echo "❌ Environment file env/${ENVIRONMENT}.tfvars not found"
    exit 1
fi

echo "🔄 Using AWS Profile: $AWS_PROFILE"
echo "🔄 Switching to $ENVIRONMENT workspace..."
AWS_PROFILE=$AWS_PROFILE terraform workspace select "$ENVIRONMENT" 2>/dev/null || {
    echo "📝 Workspace '$ENVIRONMENT' not found. Creating it..."
    AWS_PROFILE=$AWS_PROFILE terraform workspace new "$ENVIRONMENT"
}

CURRENT_WORKSPACE=$(AWS_PROFILE=$AWS_PROFILE terraform workspace show)
if [[ "$CURRENT_WORKSPACE" != "$ENVIRONMENT" ]]; then
    echo "❌ Failed to switch to $ENVIRONMENT workspace"
    exit 1
fi

echo "✅ Current workspace: $CURRENT_WORKSPACE"
echo "🚀 Applying $ENVIRONMENT environment..."

# Confirmation for production
if [[ "$ENVIRONMENT" == "prod" ]]; then
    echo "⚠️  You are about to apply changes to PRODUCTION environment"
    read -p "Are you sure? (yes/no): " confirm
    if [[ "$confirm" != "yes" ]]; then
        echo "❌ Cancelled"
        exit 1
    fi
fi

AWS_PROFILE=$AWS_PROFILE terraform apply -var-file="env/${ENVIRONMENT}.tfvars" 