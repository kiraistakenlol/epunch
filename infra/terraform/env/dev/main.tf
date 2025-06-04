terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "personal"
}

resource "aws_cognito_user_pool" "epunch_dev" {
  name = "epunch-dev"

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length = 8
  }

  tags = {
    Environment = "dev"
  }
}

resource "aws_cognito_user_pool_domain" "epunch_dev_domain" {
  domain       = var.cognito_domain_prefix
  user_pool_id = aws_cognito_user_pool.epunch_dev.id
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.epunch_dev.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "email openid profile"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}

resource "aws_cognito_user_pool_client" "epunch_dev_client" {
  name         = "epunch-dev-client"
  user_pool_id = aws_cognito_user_pool.epunch_dev.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]

  supported_identity_providers = ["COGNITO", "Google"]

  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls

  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes                 = ["email", "openid", "profile"]

  depends_on = [aws_cognito_identity_provider.google]
}

resource "aws_s3_bucket" "merchant_logos" {
  bucket = var.s3_bucket_name
}

resource "aws_s3_bucket_public_access_block" "merchant_logos_pab" {
  bucket = aws_s3_bucket.merchant_logos.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "merchant_logos_cors" {
  bucket = aws_s3_bucket.merchant_logos.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 86400
  }
}

resource "aws_s3_bucket_policy" "merchant_logos_policy" {
  bucket = aws_s3_bucket.merchant_logos.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.merchant_logos.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.merchant_logos_pab]
} 