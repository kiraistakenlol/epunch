variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  description = "S3 bucket name for merchant files (must be globally unique)"
  type        = string
}

variable "cognito_domain_prefix" {
  description = "Cognito domain prefix (must be globally unique)"
  type        = string
}

variable "google_client_id" {
  description = "Google OAuth client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
}

variable "callback_urls" {
  description = "Callback URLs for OAuth"
  type        = list(string)
}

variable "logout_urls" {
  description = "Logout URLs for OAuth"
  type        = list(string)
} 