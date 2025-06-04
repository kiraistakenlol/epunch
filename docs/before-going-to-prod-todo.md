# Production Launch Checklist

## Critical Security Fix
- **Merchant Authorization**: Currently any merchant can punch any other merchant's punch card - needs immediate fix

## Production Deployment (epunch.app)

### Infrastructure Setup
- New PostgreSQL database
- S3 bucket for merchant logos
- Separate Terraform environment for production

### Authentication & Authorization
- Cognito user pool setup (client ID, secret, domain)
- Google OAuth configuration
  - Determine if existing app can be used or new one needed
  - Complete Google app verification process for production
  - Review Google Cloud Console notifications

## Localization for Argentina
- Research best practices for internationalization with current tech stack
- Implementation strategy brainstorming session needed