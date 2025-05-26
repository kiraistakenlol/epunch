#!/bin/bash

set -e

echo "🚀 Deploying E-Punch Dev Environment"
echo "======================================"

# Initialize Terraform
echo "🔧 Initializing Terraform..."
terraform init

# Plan the deployment
echo "📋 Planning deployment..."
terraform plan

# Ask for confirmation
echo ""
read -p "🤔 Do you want to apply these changes? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "✅ Applying Terraform configuration..."
    terraform apply -auto-approve
    
    echo ""
    echo "🎉 Deployment complete!"
    echo ""
    echo "📋 Environment variables for your .env file:"
    echo "=============================================="
    terraform output -json environment_variables | jq -r 'to_entries[] | "\(.key)=\(.value)"'
    
    echo ""
    echo "💡 Copy these values to application/user-app/.env"
else
    echo "❌ Deployment cancelled."
    exit 1
fi 