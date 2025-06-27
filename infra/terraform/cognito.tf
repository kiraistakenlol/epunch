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

# ACM Certificate for Cognito Custom Domain (must be in us-east-1)
resource "aws_acm_certificate" "cognito_custom_domain" {
  provider    = aws.us_east_1
  domain_name = local.cognito_custom_domain
  
  validation_method = "DNS"
  
  lifecycle {
    create_before_destroy = true
  }
  
  tags = {
    Name        = "epunch-${var.environment}-cognito-cert"
    Environment = var.environment
  }
}

# Certificate validation records
resource "aws_route53_record" "cognito_cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cognito_custom_domain.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = local.zone_id
}

# Certificate validation
resource "aws_acm_certificate_validation" "cognito_custom_domain" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.cognito_custom_domain.arn
  validation_record_fqdns = [for record in aws_route53_record.cognito_cert_validation : record.fqdn]
}

# Cognito Custom Domain
resource "aws_cognito_user_pool_domain" "main" {
  depends_on      = [aws_acm_certificate_validation.cognito_custom_domain]
  domain          = local.cognito_custom_domain
  certificate_arn = aws_acm_certificate.cognito_custom_domain.arn
  user_pool_id    = aws_cognito_user_pool.main.id
}

# Route53 record for custom domain
resource "aws_route53_record" "cognito_custom_domain" {
  depends_on = [aws_cognito_user_pool_domain.main]
  
  zone_id = local.zone_id
  name    = local.cognito_custom_domain
  type    = "A"
  
  alias {
    name                   = aws_cognito_user_pool_domain.main.cloudfront_distribution_arn
    zone_id                = "Z2FDTNDATAQYW2" # CloudFront hosted zone ID
    evaluate_target_health = false
  }
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
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
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