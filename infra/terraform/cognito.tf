# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "epunch-${var.environment}-user-pool"

  username_attributes      = ["email"]
  email_verification_subject = "Your epunch verification code"
  email_verification_message = "Your verification code is {####}"

  password_policy {
    minimum_length    = var.environment == "prod" ? 8 : 6
    require_lowercase = var.environment == "prod" ? true : false
    require_numbers   = var.environment == "prod" ? true : false
    require_symbols   = var.environment == "prod" ? true : false
    require_uppercase = var.environment == "prod" ? true : false
  }

  schema {
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    name                     = "email"
    required                 = true

    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }

  tags = {
    Name        = "epunch-${var.environment}-user-pool"
    Environment = var.environment
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "main" {
  depends_on = [aws_cognito_identity_provider.google]
  
  name = "epunch-${var.environment}-client"

  user_pool_id = aws_cognito_user_pool.main.id
  
  generate_secret     = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH"
  ]

  allowed_oauth_flows                  = ["code", "implicit"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"]
  
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls
  
  supported_identity_providers = ["COGNITO", "Google"]
}

# Cognito Domain
resource "aws_cognito_user_pool_domain" "main" {
  domain       = "epunch-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id
}

# Google Identity Provider
resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "email profile openid"
    client_id        = var.google_oauth_client_id
    client_secret    = var.google_oauth_client_secret
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = "true"
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account"
    oidc_issuer                   = "https://accounts.google.com"
    token_request_method          = "POST"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
    name     = "name"
    given_name = "given_name"
    family_name = "family_name"
    picture  = "picture"
  }
} 