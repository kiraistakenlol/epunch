# Cognito Custom Domain Implementation Summary

## Overview
This document summarizes all changes made to implement custom domain authentication for AWS Cognito with Google OAuth, replacing the default AWS domain with branded domains (`auth.epunch.app` / `dev-auth.epunch.app`).

---

## 📚 **Foundational Concepts**

### **Understanding OAuth 2.0 Flow**
OAuth is like a "valet key" system for digital services:

```
1. User: "I want to sign in to ePunch using Google"
2. ePunch: "Ok, let me send you to Google to verify who you are"
3. Google: "User, do you allow ePunch to access your basic info?"
4. User: "Yes" (clicks allow)
5. Google: "ePunch, here's a token proving this user said yes"
6. ePunch: "Great! Welcome, [user's name from Google]"
```

**Key Players:**
- **Resource Owner**: The user (owns their Google account data)
- **Client**: Your app (ePunch - wants access to user data)
- **Authorization Server**: Google (decides if access is allowed)
- **Resource Server**: Google's API (serves the actual user data)

### **What AWS Cognito Does**
Think of Cognito as a "authentication hub" that:
- **Speaks OAuth**: Handles the complex OAuth flow so your app doesn't have to
- **Manages Users**: Stores user sessions, handles login/logout
- **Bridges Services**: Connects your app to Google, Facebook, etc.
- **Provides Tokens**: Gives your app JWT tokens to verify users

**Without Cognito** (what you'd need to build):
```javascript
// You'd need to implement all this OAuth complexity:
const authUrl = `https://accounts.google.com/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=profile+email&response_type=code`;
// Handle callback, exchange code for token, verify token, manage sessions...
```

**With Cognito** (what you actually write):
```javascript
// Cognito handles OAuth complexity, you just call:
signInWithRedirect({ provider: 'Google' });
```

### **SSL Certificates Explained**
SSL certificates are like "digital passports" for websites:

**What they do:**
- **Encrypt Traffic**: Scrambles data between browser and server
- **Verify Identity**: Proves the website is really who it claims to be
- **Enable HTTPS**: Required for the green lock in browser address bar

**Why Custom Domains Need Certificates:**
```
Without Certificate:
User → https://auth.epunch.app → ❌ "Certificate Error" → User scared away

With Certificate:
User → https://auth.epunch.app → ✅ Green lock → User trusts site
```

**Certificate Validation Process:**
1. **You request**: "I want a certificate for auth.epunch.app"
2. **AWS asks**: "Prove you own auth.epunch.app"
3. **You prove it**: Add special DNS record to your domain
4. **AWS verifies**: Checks the DNS record exists
5. **AWS issues**: Certificate is now valid and trusted

### **DNS (Domain Name System) Fundamentals**
DNS is like a "phone book" for the internet:

```
User types: auth.epunch.app
DNS says: "That's actually IP address 1.2.3.4"
Browser connects to: 1.2.3.4 (AWS CloudFront)
```

**DNS Record Types:**
- **A Record**: Points domain directly to IP address
- **CNAME Record**: Points domain to another domain
- **ALIAS Record**: AWS-specific, like CNAME but for root domains

**Our DNS Setup:**
```
auth.epunch.app (A Record with ALIAS) 
    ↓
AWS CloudFront Distribution (managed by Cognito)
    ↓
Cognito Authentication Service
```

---

## 🔧 **AWS Infrastructure Changes (Detailed)**

### 1. **ACM Certificate Creation** (`infra/terraform/cognito.tf`)
```hcl
resource "aws_acm_certificate" "cognito_custom_domain" {
  provider    = aws.us_east_1  # ← Why us-east-1? See explanation below
  domain_name = local.cognito_custom_domain
  validation_method = "DNS"   # ← Alternative: email validation
  
  lifecycle {
    create_before_destroy = true  # ← Prevents downtime during updates
  }
}
```

**Why needed**: **NECESSARY** 
- **HTTPS Requirement**: Modern browsers require HTTPS for OAuth flows (security)
- **Cognito Requirement**: AWS Cognito won't serve custom domains without valid SSL
- **Trust**: Users see green lock, don't get scary certificate warnings

**Deep Dive - Why us-east-1?**
This is an AWS architectural decision:
- **CloudFront Global**: AWS CloudFront (CDN) is managed globally from us-east-1
- **Cognito Uses CloudFront**: Custom domains are served via CloudFront
- **Certificate Location**: CloudFront can only use certificates from us-east-1
- **Not Configurable**: This is hardcoded in AWS architecture

**Alternative Approaches:**
- **Wildcard Certificate**: Could use `*.epunch.app` to cover all subdomains
- **Multiple Domains**: Could add additional domains to same certificate

---

### 2. **Certificate Validation Records** (`infra/terraform/cognito.tf`)
```hcl
resource "aws_route53_record" "cognito_cert_validation" {
  for_each = {
    # AWS ACM provides these validation records automatically
    for dvo in aws_acm_certificate.cognito_custom_domain.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name     # Like: _acme-challenge.auth.epunch.app
      record = dvo.resource_record_value    # Random token from AWS
      type   = dvo.resource_record_type     # Usually CNAME
    }
  }
  
  allow_overwrite = true  # ← In case record already exists
  ttl             = 60    # ← Short TTL for faster validation
}
```

**Why needed**: **NECESSARY**
- **Domain Ownership Proof**: Anyone can request a certificate, but only domain owners can add DNS records
- **Automatic Process**: AWS checks for these records, if found → certificate issued
- **Security**: Prevents someone else from getting certificates for your domain

**Deep Dive - Validation Process:**
```
1. You request certificate for auth.epunch.app
2. AWS generates random token: "abc123def456"
3. AWS says: "Add DNS record: _acme-challenge.auth.epunch.app → abc123def456"
4. You add the record (this Terraform does it automatically)
5. AWS checks: "Does _acme-challenge.auth.epunch.app exist with our token?"
6. If yes → Certificate issued, if no → Certificate remains pending
```

**Alternative Validation Methods:**
- **Email Validation**: AWS sends email to admin@epunch.app, webmaster@epunch.app
- **DNS is Better**: Email validation requires manual intervention

---

### 3. **Certificate Validation Resource** (`infra/terraform/cognito.tf`)
```hcl
resource "aws_acm_certificate_validation" "cognito_custom_domain" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.cognito_custom_domain.arn
  validation_record_fqdns = [for record in aws_route53_record.cognito_cert_validation : record.fqdn]
}
```

**Why needed**: **NECESSARY**
- **Terraform Orchestration**: Ensures Terraform waits for certificate validation before creating dependent resources
- **Prevents Race Conditions**: Without this, Cognito domain creation might fail because certificate isn't ready
- **Dependency Management**: Makes deployment reliable and repeatable

**Deep Dive - Terraform Dependencies:**
```
Without validation resource:
Certificate (pending) → Cognito Domain Creation → ❌ Fails (cert not ready)

With validation resource:
Certificate → Wait for validation → Cognito Domain Creation → ✅ Success
```

---

### 4. **Updated Cognito Domain Configuration** (`infra/terraform/cognito.tf`)
```hcl
resource "aws_cognito_user_pool_domain" "main" {
  # OLD: domain = "epunch-${var.environment}"  # AWS-managed subdomain
  # NEW: 
  domain          = local.cognito_custom_domain  # Your custom domain
  certificate_arn = aws_acm_certificate.cognito_custom_domain.arn  # Required for custom
  user_pool_id    = aws_cognito_user_pool.main.id
  
  depends_on = [aws_acm_certificate_validation.cognito_custom_domain]
}
```

**Why needed**: **NECESSARY**
- **Core Functionality**: This is the actual switch from AWS domain to your domain
- **Certificate Link**: `certificate_arn` tells Cognito which SSL certificate to use
- **DNS Integration**: Cognito creates CloudFront distribution using your domain

**Deep Dive - What Happens Behind the Scenes:**
```
AWS Managed Domain (old):
epunch-dev.auth.us-east-1.amazoncognito.com
    ↓
Cognito automatically handles SSL, DNS, everything

Custom Domain (new):
auth.epunch.app → Your Route53 → AWS CloudFront → Cognito
    ↓
You handle SSL certificate, DNS routing
```

**Trade-offs:**
- **Pro**: Branded URL, professional appearance
- **Con**: More complexity, additional AWS resources to manage

---

### 5. **Custom Domain DNS Record** (`infra/terraform/cognito.tf`)
```hcl
resource "aws_route53_record" "cognito_custom_domain" {
  depends_on = [aws_cognito_user_pool_domain.main]
  
  zone_id = local.zone_id  # Your epunch.app hosted zone
  name    = local.cognito_custom_domain  # auth.epunch.app
  type    = "A"           # IPv4 address record
  
  alias {  # AWS-specific: points to AWS service instead of IP
    name                   = aws_cognito_user_pool_domain.main.cloudfront_distribution_arn
    zone_id                = "Z2FDTNDATAQYW2"  # CloudFront's hosted zone (fixed)
    evaluate_target_health = false  # Don't check if CloudFront is healthy
  }
}
```

**Why needed**: **NECESSARY**
- **Traffic Routing**: Routes requests from auth.epunch.app to AWS Cognito service
- **CloudFront Integration**: Cognito automatically creates CloudFront distribution for performance
- **Global Performance**: CloudFront serves auth pages from edge locations worldwide

**Deep Dive - DNS Resolution Flow:**
```
1. User types: https://auth.epunch.app
2. Browser asks DNS: "What's the IP for auth.epunch.app?"
3. Route53 responds: "It's an alias to CloudFront distribution xyz123"
4. Browser connects to: CloudFront edge location (nearest to user)
5. CloudFront serves: Cognito authentication pages
```

**Why ALIAS instead of CNAME:**
```
CNAME (doesn't work at root):
auth.epunch.app CNAME xyz123.cloudfront.net  ✅ Works
epunch.app CNAME xyz123.cloudfront.net       ❌ DNS spec violation

ALIAS (AWS extension, works anywhere):
auth.epunch.app ALIAS xyz123.cloudfront.net  ✅ Works
epunch.app ALIAS xyz123.cloudfront.net       ✅ Also works
```

---

### 6. **AWS Provider for us-east-1** (`infra/terraform/main.tf`)
```hcl
# Default provider (your main region, e.g., us-west-2)
provider "aws" {
  region = var.aws_region
}

# Special provider for services that require us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
```

**Why needed**: **NECESSARY**
- **AWS Architecture**: Some AWS services are "global" but managed from us-east-1
- **CloudFront Certificates**: Must be in us-east-1 (not configurable)
- **Multi-Region Deployment**: Your app can be in any region, but cert must be us-east-1

**Deep Dive - AWS Global Services:**
```
Global Services (managed from us-east-1):
- CloudFront certificates
- IAM (users, roles, policies)
- Route53 (DNS)

Regional Services (managed per region):
- EC2 instances
- RDS databases
- Lambda functions
- Cognito User Pools (can be anywhere)
```

**Common Confusion:**
- **Cognito User Pool**: Can be in any region (us-west-2, eu-west-1, etc.)
- **Custom Domain Certificate**: Must be in us-east-1
- **Same deployment, different regions for different resources**

---

### 7. **Custom Domain Local Variable** (`infra/terraform/locals.tf`)
```hcl
locals {
  # Centralized domain configuration
  cognito_custom_domain = var.environment == "prod" ? "auth.epunch.app" : "dev-auth.epunch.app"
}
```

**Why needed**: **GOOD PRACTICE**
- **DRY Principle**: Define once, use everywhere
- **Environment Separation**: Different domains for dev/prod
- **Maintainability**: Change domain in one place

**Deep Dive - Environment Strategy:**
```
Production Environment:
- User App: https://epunch.app
- Merchant App: https://merchant.epunch.app
- Auth: https://auth.epunch.app
- API: https://api.epunch.app

Development Environment:
- User App: https://dev.epunch.app
- Merchant App: https://dev-merchant.epunch.app
- Auth: https://dev-auth.epunch.app
- API: https://dev-api.epunch.app
```

**Alternative Approaches:**
- **Subdomain Strategy**: dev.auth.epunch.app, prod.auth.epunch.app
- **Separate Domains**: auth.epunch-dev.com, auth.epunch.com
- **Port-based**: auth.epunch.app:3000 (not recommended for production)

---

### 8. **Updated Outputs** (`infra/terraform/outputs.tf`)
```hcl
output "cognito_domain" {
  description = "Cognito domain URL"
  value       = "https://${local.cognito_custom_domain}"  # Custom domain
  # OLD: value = "${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
}

output "custom_domains" {
  description = "Custom domain URLs"
  value = {
    user_app     = var.environment == "prod" ? "epunch.app" : "dev.epunch.app"
    merchant_app = var.environment == "prod" ? "merchant.epunch.app" : "dev-merchant.epunch.app"
    admin_app    = var.environment == "prod" ? "admin.epunch.app" : "dev-admin.epunch.app"
    api          = local.api_domain
    auth         = local.cognito_custom_domain  # ← Added this
  }
}
```

**Why needed**: **GOOD PRACTICE**
- **Documentation**: Other developers can see what URLs are created
- **Automation**: CI/CD can use these outputs for configuration
- **Troubleshooting**: Easy to verify correct URLs are generated

**Deep Dive - Terraform Outputs Usage:**
```bash
# View outputs after deployment
terraform output

# Use in scripts
AUTH_URL=$(terraform output -raw cognito_domain)
echo "Configure your app to use: $AUTH_URL"

# Use in other Terraform modules
module "backend" {
  auth_domain = module.frontend.custom_domains.auth
}
```

---

### 9. **Updated Amplify Environment Variables** (`infra/terraform/amplify.tf`)
```hcl
environment_variables = {
  VITE_API_URL                     = "https://${local.api_domain}/api/v1"
  VITE_AWS_REGION                  = var.aws_region
  VITE_COGNITO_USER_POOL_ID        = aws_cognito_user_pool.main.id
  VITE_COGNITO_USER_POOL_CLIENT_ID = aws_cognito_user_pool_client.main.id
  # OLD: VITE_COGNITO_DOMAIN = "${aws_cognito_user_pool_domain.main.domain}.auth.${var.aws_region}.amazoncognito.com"
  VITE_COGNITO_DOMAIN              = "https://${local.cognito_custom_domain}"  # NEW
}
```

**Why needed**: **NECESSARY**
- **Frontend Configuration**: React app needs to know where to send OAuth requests
- **Build-time Variables**: Vite injects these into your bundle during build
- **Environment Separation**: Different URLs for dev/prod builds

**Deep Dive - How Frontend Uses This:**
```javascript
// In your React app:
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,  // ← Uses custom domain
          redirectSignIn: [window.location.origin],
          redirectSignOut: [window.location.origin],
        },
      },
    },
  },
});

// When user clicks "Sign in with Google":
signInWithRedirect({ provider: 'Google' });
// → Redirects to: https://auth.epunch.app/oauth2/authorize?...
```

---

## 🌐 **AWS ↔ Google Cloud Console Mapping (Detailed)**

### **The Complete OAuth Ecosystem**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Your App      │    │  AWS Cognito    │    │  Google OAuth   │
│  (React/Vue)    │    │  (Auth Hub)     │    │  (Identity)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │ 1. User clicks         │                        │
         │    "Sign in with Google"│                        │
         │                        │                        │
         │ 2. Redirect to         │                        │
         │    auth.epunch.app     │                        │
         │───────────────────────▶│                        │
         │                        │ 3. Show Google         │
         │                        │    OAuth consent       │
         │                        │───────────────────────▶│
         │                        │                        │ 4. User approves
         │                        │ 5. Google sends        │
         │                        │    auth code           │
         │                        │◀───────────────────────│
         │                        │                        │
         │ 6. Redirect back with  │                        │
         │    Cognito JWT tokens  │                        │
         │◀───────────────────────│                        │
```

### **Configuration Synchronization Points**

| Configuration Point | AWS Side | Google Side | Must Match? |
|-------------------|----------|-------------|-------------|
| **OAuth Client ID** | `google_oauth_client_id` in Terraform | OAuth 2.0 Client ID | ✅ Exact |
| **OAuth Client Secret** | `google_oauth_client_secret` in Terraform | OAuth 2.0 Client Secret | ✅ Exact |
| **Redirect URI** | Auto: `{domain}/oauth2/idpresponse | Authorized redirect URIs | ✅ Exact |
| **Auth Domain** | `local.cognito_custom_domain` | Must be in Authorized domains | ✅ Exact |
| **App Name** | Not configurable in AWS | OAuth consent screen app name | ❌ Independent |
| **App Logo** | Not configurable in AWS | OAuth consent screen logo | ❌ Independent |

### **Deep Dive - OAuth Flow Step by Step**

#### **Step 1: User Initiates Login**
```javascript
// In your React app
signInWithRedirect({ provider: 'Google' });
```

**What happens:**
- AWS Amplify constructs OAuth URL
- Redirects browser to your custom domain

#### **Step 2: Cognito Handles OAuth**
```
Browser navigates to:
https://auth.epunch.app/oauth2/authorize?
  client_id=your_cognito_client_id&
  response_type=code&
  scope=email+profile+openid&
  redirect_uri=https://your-app.com/&
  identity_provider=Google
```

**What AWS Cognito does:**
- Recognizes this is a Google OAuth request
- Uses your stored Google client_id and client_secret
- Redirects to Google with proper parameters

#### **Step 3: Google Shows Consent Screen**
```
Browser redirected to:
https://accounts.google.com/oauth2/auth?
  client_id=your_google_client_id&
  redirect_uri=https://auth.epunch.app/oauth2/idpresponse&
  scope=email+profile+openid&
  response_type=code
```

**What Google shows:**
- **App name from Google Console**: "ePunch" (not AWS domain)
- **App logo from Google Console**: Your uploaded logo
- **Permissions**: "ePunch wants to access your basic profile info and email"
- **Domain info**: "You'll be redirected to auth.epunch.app"

#### **Step 4: User Approves**
User clicks "Allow" on Google's consent screen.

#### **Step 5: Google Redirects to AWS**
```
Google redirects back to:
https://auth.epunch.app/oauth2/idpresponse?
  code=google_authorization_code&
  state=random_security_token
```

**What AWS Cognito does:**
- Receives the authorization code from Google
- Exchanges code for Google access token (behind the scenes)
- Gets user info from Google API
- Creates/updates user in Cognito User Pool
- Generates Cognito JWT tokens

#### **Step 6: AWS Redirects to Your App**
```
AWS redirects to:
https://your-app.com/#
  access_token=cognito_access_token&
  id_token=cognito_id_token&
  expires_in=3600&
  token_type=Bearer
```

**What your app does:**
- AWS Amplify automatically captures these tokens
- Stores them securely (localStorage/sessionStorage)
- User is now logged in

### **Security Deep Dive**

#### **Why Custom Domains Improve Security**
```
AWS Default Domain:
https://epunch-dev.auth.us-east-1.amazoncognito.com/oauth2/authorize
↑ Users see complex AWS URL, might think it's phishing

Custom Domain:
https://auth.epunch.app/oauth2/authorize
↑ Users see your brand, builds trust
```

#### **SSL Certificate Chain**
```
Your Browser
    ↓ (validates certificate)
Let's Encrypt / AWS Certificate Authority
    ↓ (signed by)
Root Certificate Authority (in browser trust store)
```

**Certificate validation ensures:**
- **Encryption**: Data encrypted in transit
- **Authentication**: Server is really auth.epunch.app
- **Integrity**: Data hasn't been tampered with

#### **OAuth Security Features**
- **State Parameter**: Prevents CSRF attacks
- **PKCE**: Prevents authorization code interception
- **Secure Redirect**: Only allows pre-registered redirect URIs
- **Token Expiration**: Access tokens expire (typically 1 hour)
- **Refresh Tokens**: Long-lived tokens for getting new access tokens

---

## 📋 **Deployment Dependencies (Detailed)**

### **Why Order Matters - Technical Deep Dive**

#### **Deployment Step 1: Create AWS Infrastructure**
```bash
terraform apply
```

**What happens in sequence:**
1. **ACM Certificate Created**: Status = "Pending Validation"
2. **DNS Validation Records Added**: Route53 records created
3. **Certificate Validation Waits**: Terraform polls until validated
4. **Cognito Domain Created**: Uses validated certificate
5. **CloudFront Distribution Created**: AWS automatically provisions
6. **DNS A Record Added**: Points to CloudFront

**Time Dependencies:**
- Certificate validation: 5-30 minutes (DNS propagation)
- CloudFront deployment: 10-45 minutes (global distribution)

#### **Deployment Step 2: Update Google OAuth**
```
Before AWS deployment:
Google Redirect URI: https://epunch-dev.auth.us-east-1.amazoncognito.com/oauth2/idpresponse

After AWS deployment:
Google Redirect URI: https://dev-auth.epunch.app/oauth2/idpresponse
```

**Why this must be second:**
- Google validates redirect URIs in real-time
- If you change Google first, OAuth breaks until AWS is deployed
- If AWS deployment fails, you're stuck with broken config

#### **Deployment Step 3: Frontend Applications**
```bash
# Amplify automatically rebuilds with new environment variables
git push origin dev
```

**What happens in sequence:**
1. **Build Process**: Vite injects new VITE_COGNITO_DOMAIN
2. **AWS Amplify Build**: Creates new bundle with custom domain
3. **Deployment**: New version goes live
4. **Cache Invalidation**: CloudFront cache cleared

### **Rollback Strategy**

#### **If Custom Domain Doesn't Work:**
1. **Immediate Fix**: Revert Google OAuth redirect URIs to AWS default
2. **Frontend Fix**: Deploy with old environment variables
3. **AWS Cleanup**: Can clean up AWS resources later (non-urgent)

#### **Common Failure Points:**
```
❌ Certificate Validation Failure
   → Check DNS records, wait longer

❌ Google OAuth Mismatch
   → Verify redirect URIs match exactly

❌ Frontend Still Using Old Domain
   → Check environment variables, clear cache

❌ DNS Not Resolving
   → Check Route53 records, wait for propagation
```

---

## 🚨 **Critical Requirements vs Nice-to-Haves (Detailed)**

### **NECESSARY (Will break without these)**

#### **✅ ACM Certificate in us-east-1**
**What breaks without it:**
- Custom domain returns SSL errors
- Modern browsers block OAuth flow
- Users see scary security warnings

**Technical details:**
- Certificate must cover exact domain name
- Must be validated (not pending)
- Must be in us-east-1 region

#### **✅ Certificate Validation Records**
**What breaks without it:**
- Certificate remains "Pending Validation" forever
- Cognito custom domain creation fails
- Deployment gets stuck

**Technical details:**
- DNS records must be in same hosted zone as domain
- Records are temporary (can be deleted after validation)
- Validation typically takes 5-10 minutes

#### **✅ Updated Cognito Domain Configuration**
**What breaks without it:**
- Still uses AWS default domain
- Users see epunch-dev.auth.us-east-1.amazoncognito.com
- No branding benefit

**Technical details:**
- This is the core change that enables custom domain
- Requires valid certificate ARN
- Creates CloudFront distribution automatically

#### **✅ Custom Domain DNS Record**
**What breaks without it:**
- auth.epunch.app doesn't resolve
- Users get "domain not found" errors
- OAuth flow completely broken

**Technical details:**
- Must be ALIAS record (not CNAME) for root domains
- Points to CloudFront distribution ARN
- Zone ID must be CloudFront's zone (Z2FDTNDATAQYW2)

#### **✅ Updated Google OAuth Redirect URIs**
**What breaks without it:**
- Google OAuth returns "redirect_uri_mismatch" error
- Users can't complete authentication
- App unusable

**Technical details:**
- Must match exactly (no trailing slashes, case-sensitive)
- Google validates in real-time
- Both dev and prod need separate configs

#### **✅ Updated Frontend Environment Variables**
**What breaks without it:**
- Frontend still redirects to old AWS domain
- OAuth flow starts but fails partway through
- Confusing user experience

**Technical details:**
- Variables injected at build time (not runtime)
- Requires rebuild and redeploy
- Different values for dev/prod

### **GOOD PRACTICE (Improves experience)**

#### **✅ Centralized Domain Configuration**
**Benefits:**
- Easier to change domains later
- Consistent naming across resources
- Better code maintainability

**Could work without it:**
- Hard-code domains in each resource
- More error-prone but technically functional

#### **✅ Updated Outputs**
**Benefits:**
- Better documentation
- Easier troubleshooting
- Automation-friendly

**Could work without it:**
- Manually track domain URLs
- Less convenient but functional

#### **✅ Google OAuth Consent Screen Branding**
**Benefits:**
- Professional appearance
- User trust and recognition
- Brand consistency

**Could work without it:**
- Works fine with default Google branding
- Just looks less professional

---

## 🔄 **Testing Checklist (Detailed)**

### **DNS and SSL Testing**
```bash
# 1. DNS Resolution
nslookup auth.epunch.app
# Should return: CloudFront IP addresses

# 2. SSL Certificate
curl -I https://auth.epunch.app
# Should return: HTTP 200, valid SSL

# 3. Certificate Details
openssl s_client -connect auth.epunch.app:443 -servername auth.epunch.app
# Should show: Valid certificate, not expired
```

### **Cognito Service Testing**
```bash
# 4. Cognito Login Page
curl https://auth.epunch.app/login
# Should return: Cognito hosted UI HTML

# 5. OAuth Endpoints
curl https://auth.epunch.app/.well-known/openid_configuration
# Should return: JSON with OAuth endpoints
```

### **OAuth Flow Testing**
```javascript
// 6. Complete OAuth Flow
// In browser console on your app:
import { signInWithRedirect } from 'aws-amplify/auth';
signInWithRedirect({ provider: 'Google' });

// Should:
// - Redirect to https://auth.epunch.app/oauth2/authorize
// - Show Google consent screen with "ePunch" branding
// - Redirect back to your app with tokens
```

### **Error Scenarios to Test**
```bash
# 7. Invalid redirect URI (should fail gracefully)
# Temporarily change Google OAuth redirect URI to wrong URL
# OAuth should show clear error message

# 8. Expired certificate (simulate)
# Remove certificate, should show SSL warnings

# 9. DNS failure (simulate)
# Temporarily remove DNS record, should show domain not found
```

### **Performance Testing**
```bash
# 10. Global Performance
curl -w "%{time_total}" https://auth.epunch.app
# Should be fast from different locations (CloudFront CDN)

# 11. SSL Handshake Time
curl -w "%{time_appconnect}" https://auth.epunch.app
# Should be sub-second
```

---

## 🎓 **Learning Resources**

### **OAuth 2.0 Deep Dive**
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749) - Official specification
- [OAuth 2.0 Simplified](https://aaronparecki.com/oauth-2-simplified/) - Beginner-friendly guide

### **AWS Cognito Architecture**
- [AWS Cognito Developer Guide](https://docs.aws.amazon.com/cognito/latest/developerguide/)
- [Cognito Custom Domains](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html)

### **SSL/TLS and PKI**
- [How HTTPS Works](https://howhttps.works/) - Visual explanation
- [SSL/TLS Handshake Explained](https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/)

### **DNS Deep Dive**
- [How DNS Works](https://howdns.works/) - Visual guide
- [AWS Route 53 Documentation](https://docs.aws.amazon.com/route53/)

This comprehensive guide should give you a solid understanding of not just what changes to make, but why each change is necessary and how all the pieces fit together in the modern web authentication ecosystem! 