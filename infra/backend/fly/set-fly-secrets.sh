#!/bin/bash

# Path to the .env.dev file
ENV_FILE=".env.dev"
APP_NAME=$(grep "app =" fly.toml | cut -d'"' -f2)

# Check if .env.dev file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found!"
  exit 1
fi

# Check if APP_NAME is set
if [ -z "$APP_NAME" ]; then
  echo "Error: Could not determine app name from fly.toml"
  exit 1
fi

echo "Setting secrets for app: $APP_NAME"

# Read the file and build the secrets command
SECRETS_CMD="fly secrets set"
SECRET_COUNT=0

while IFS= read -r line || [ -n "$line" ]; do
  # Skip empty lines and comments
  if [[ -z "$line" || "$line" =~ ^# ]]; then
    continue
  fi
  
  # Extract key and value
  if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
    KEY="${BASH_REMATCH[1]}"
    VALUE="${BASH_REMATCH[2]}"
    
    # Remove quotes if present
    VALUE="${VALUE%\"}"
    VALUE="${VALUE#\"}"
    VALUE="${VALUE%\'}"
    VALUE="${VALUE#\'}"
    
    # Add to secrets command
    SECRETS_CMD="$SECRETS_CMD $KEY=\"$VALUE\""
    ((SECRET_COUNT++))
  fi
done < "$ENV_FILE"

# Execute the command if secrets were found
if [ $SECRET_COUNT -gt 0 ]; then
  echo "Setting $SECRET_COUNT secrets..."
  echo "Command: $SECRETS_CMD -a $APP_NAME"
  
  # Ask for confirmation
  read -p "Proceed with setting secrets? (y/n): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    eval "$SECRETS_CMD -a $APP_NAME"
    echo "Secrets set successfully!"
  else
    echo "Operation cancelled."
  fi
else
  echo "No secrets found in $ENV_FILE."
fi 