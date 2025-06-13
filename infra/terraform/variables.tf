variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  validation {
    condition = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be either 'dev' or 'prod'."
  }
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "aws_access_key_id" {
  description = "AWS Access Key ID for backend services"
  type        = string
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS Secret Access Key for backend services"
  type        = string
  sensitive   = true
}

variable "callback_urls" {
  description = "List of allowed callback URLs for the user pool client"
  type        = list(string)
}

variable "logout_urls" {
  description = "List of allowed logout URLs for the user pool client"
  type        = list(string)
}

variable "google_project_id" {
  description = "Google Cloud Project ID for OAuth applications"
  type        = string
}

variable "google_oauth_client_id" {
  description = "Google OAuth Client ID (configured manually in Google Cloud Console)"
  type        = string
}

variable "google_oauth_client_secret" {
  description = "Google OAuth Client Secret (configured manually in Google Cloud Console)"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "GitHub personal access token for Amplify"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "epunch"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "epunch"
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
} 