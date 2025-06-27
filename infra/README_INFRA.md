# E-PUNCH.io Infrastructure Reference

## HOW TO

*From project root:*

### 1. Deploy Infra (terraform)
```bash
sh infra/terraform/scripts/plan.sh {yourepunchawsprofile} {dev|prod}     # Review changes
sh infra/terraform/scripts/apply.sh {yourepunchawsprofile} {dev|prod}    # Apply changes
```

### 2. Deploy Backend
```bash
sh deploy-backend.sh {yourepunchawsprofile} {dev|prod}    # Build & push to ECR (auto-deploys)
```

*Alternative (direct call):*
```bash
sh infra/backend/docker/build-and-push-ecr.sh {yourepunchawsprofile} {dev|prod}    # Build & push to ECR (auto-deploys)
```

### 3. Deploy Frontend
```bash
git push origin dev        # Deploys to development
git push origin master     # Deploys to production
```

**Note**: All 3 frontend apps deploy on every push (excessive but simple). Could optimize with GitHub Actions + manual deployments if needed.

## URLs

**Production:**
- User: https://epunch.app
- Merchant: https://merchant.epunch.app  
- Admin: https://admin.epunch.app
- API: https://api.epunch.app

**Development:**
- User: https://dev.epunch.app
- Merchant: https://dev-merchant.epunch.app
- Admin: https://dev-admin.epunch.app  
- API: https://dev-api.epunch.app

## Architecture

**Backend**: `@/application/backend` → App Runner (Docker via ECR)  
**Frontend**: `@/application/{user-app,merchant-app,admin-app}` → Amplify  
**Database**: RDS PostgreSQL  
**Auth**: Cognito + Google OAuth  
**DNS**: Route 53. epunch.app registered at Dynadot.com. Shared Resouce for dev and prod. 
**Storage**: S3  
**IaC**: Terraform workspaces

## Google OAuth
- **Two projects**: `epunch-dev` and `epunch-production`
- **Project Management**: Managed by @Kira via `kirill.sobolev.indo@gmail.com` through Google Console
- **Required APIs**: Google+ API, IAM API
- **OAuth redirect URIs**: `https://epunch-{env}.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
- **Cognito needs**: Google client ID and secret in `env/*.tfvars`
- **Google needs**: Cognito redirect URL configured in OAuth client

## Terraform
Common `.tf` files + specific `.tfvars` files + Terraform workspaces to differentiate between dev/prod.  
**State Backend**: S3 bucket `epunch-terraform-state` + DynamoDB table `epunch-terraform-state-lock` (created manually).

## Troubleshooting

### Force Unlock Terraform State
If Terraform state gets locked (e.g., interrupted deployment):
```bash
# From infra/terraform directory
sh scripts/force-unlock.sh {yourepunchawsprofile} {lock-id}

# Example:
sh scripts/force-unlock.sh personal 5e671c2c-2921-0337-2c6e-92d4aa5d5448
```
*Get the lock ID from the error message when Terraform fails due to state lock.*

## Directory Structure

```
infra/
├── terraform/                     # Terraform infrastructure code
│   ├── scripts/                   # Deployment scripts
│   │   ├── plan.sh               # Plan with auto workspace switching
│   │   └── apply.sh              # Apply with validation & prod confirmation
│   ├── env/                      # Environment-specific variables
│   │   ├── example.tfvars        # Template with placeholder values
│   │   ├── dev.tfvars            # Development config (gitignored)
│   │   └── prod.tfvars           # Production config (gitignored)
│   ├── *.tf                      # Terraform resource definitions
│   └── .gitignore                # Excludes credentials & state files
└── backend/docker/               # Backend Docker deployment
    ├── Dockerfile                # Multi-stage production build
    ├── docker-compose.yml        # Local development setup
    └── build-and-push-ecr.sh     # ECR deployment script
```

## INITIAL DEPLOYMENT (First Time Setup)

### Prerequisites
1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with your profile
3. **Terraform** installed
4. **Docker** installed
5. **GitHub Personal Access Token** with repo permissions

### Step-by-Step Initial Deployment

#### 1. Google Cloud Console Setup
1. Create a new project in [Google Cloud Console](https://console.cloud.google.com)
   - For dev: `epunch-dev`
   - For prod: `epunch-production`
2. Enable **Google+ API** and **IAM API**
3. Create OAuth 2.0 credentials:
   - Application type: **Web application**
   - Authorized redirect URIs: `https://epunch-{env}.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
4. Copy **Client ID** and **Client Secret** to your `env/{env}.tfvars` file:
   ```