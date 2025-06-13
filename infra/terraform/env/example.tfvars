# Environment
environment = "dev"  # or "prod"

# Google Cloud Project
google_project_id = "epunch-dev"  # or "epunch-production" for prod

# GitHub Configuration  
github_token = "ghp_your_github_personal_access_token_here"

# AWS Credentials
aws_access_key_id = "AKIA_your_aws_access_key_id"
aws_secret_access_key = "your_aws_secret_access_key"

# OAuth URLs
callback_urls = [
  "http://localhost:5173",
  "http://localhost:5173/auth/callback",
  "http://localhost:3000/auth/callback",
  "https://dev.epunch.app",  # or "https://epunch.app" for prod
  "https://dev.epunch.app/auth/callback",  # or "https://epunch.app/auth/callback" for prod
]

logout_urls = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://dev.epunch.app",  # or "https://epunch.app" for prod
]

# Database Configuration
db_name = "epunch_dev"  # or "epunch" for prod
db_username = "epunch_dev"  # or "epunch" for prod
db_password = "your_secure_database_password"

# Google OAuth Configuration
google_oauth_client_id = "your_google_oauth_client_id.apps.googleusercontent.com"
google_oauth_client_secret = "GOCSPX-your_google_oauth_client_secret" 