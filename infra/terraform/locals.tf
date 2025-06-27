# Local values used across multiple resources
locals {
  # API domain configuration
  api_domain = var.environment == "prod" ? "api.epunch.app" : "dev-api.epunch.app"
  
  # Cognito custom domain configuration
  cognito_custom_domain = var.environment == "prod" ? "auth.epunch.app" : "dev-auth.epunch.app"
} 