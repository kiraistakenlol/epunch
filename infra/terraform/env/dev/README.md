# E-Punch Dev Environment - Terraform

Minimalistic Terraform configuration to create AWS Cognito User Pool for email authentication.

## Prerequisites

1. **AWS CLI configured** with appropriate credentials
2. **Terraform installed** (>= 1.0)

## Quick Start

1. **Deploy:**
   ```bash
   ./deploy.sh
   ```

2. **Get environment variables:**
   ```bash
   terraform output -json environment_variables
   ```

## What Gets Created

- **Cognito User Pool** with email authentication
- **User Pool Client** for the frontend app

## Configuration

- `aws_region`: AWS region (default: us-east-1)

## Outputs

- User Pool ID
- User Pool Client ID  
- AWS Region
- Environment variables for `.env` file

## Cleanup

```bash
terraform destroy
``` 