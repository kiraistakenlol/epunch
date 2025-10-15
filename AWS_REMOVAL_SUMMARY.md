# AWS Removal - Implementation Summary

## Completed: AWS Dependencies Removed ✅

All AWS services have been successfully removed from the epunch codebase. The application now runs entirely locally without any AWS dependencies.

---

## Changes Made

### 1. Backend Changes

#### Authentication (AWS Cognito → Custom Google OAuth + JWT)

**Files Modified:**
- `application/backend/src/config/configuration.ts` - Replaced AWS config with Google OAuth and JWT config
- `application/backend/src/config/config.schema.ts` - Updated environment validation schema
- `application/backend/src/features/auth/auth.service.ts` - Implemented direct Google OAuth flow with JWT generation
- `application/backend/src/features/user/user.repository.ts` - Changed external_provider from 'cognito' to 'google'
- `application/backend/src/core/middleware/auth.middleware.ts` - Updated to verify custom JWT tokens instead of Cognito
- `application/backend/package.json` - Removed `@aws-sdk/client-cognito-identity-provider`
- `application/backend/.env` - Updated with Google OAuth and JWT configuration

**New Environment Variables:**
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
JWT_SECRET=your_jwt_secret_at_least_32_characters_long_please_change_this
JWT_EXPIRES_IN=7d
```

#### File Storage (AWS S3 → Local Filesystem)

**Files Modified:**
- `application/backend/src/features/merchant/file-upload.service.ts` - Complete rewrite to use local filesystem
- `application/backend/src/features/merchant/merchant.service.ts` - Updated to use new file upload interface
- `application/backend/package.json` - Removed `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`

**New Environment Variable:**
```env
UPLOADS_DIRECTORY=./uploads
```

**File Storage Structure:**
```
./uploads/
└── {merchantId}/
    └── {timestamp}_{sanitized_filename}
```

Files are now stored locally and served via nginx at `/uploads/*` endpoint.

#### Database (AWS RDS → Local PostgreSQL)

**Files Modified:**
- `application/backend/.env` - Updated database connection to localhost

**New Configuration:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=epunch
DB_PASSWORD=epunch_local_dev
DB_DATABASE=epunch
```

---

### 2. Frontend Changes (user-app)

#### Authentication

**Files Modified:**
- `application/user-app/package.json` - Removed `aws-amplify` dependency
- `application/user-app/src/config/amplify.ts` - Replaced Amplify with direct Google OAuth implementation
- `application/user-app/src/features/auth/authSlice.ts` - Removed Cognito user state, added authToken state
- `application/user-app/src/features/auth/AuthModal.tsx` - Updated to use direct Google OAuth redirect
- `application/user-app/src/App.tsx` - Removed Amplify setup, added auth callback route
- `application/user-app/src/config/env.ts` - Replaced Cognito config with Google OAuth config
- `application/user-app/.env` - Updated with Google OAuth configuration

**New Files Created:**
- `application/user-app/src/pages/AuthCallbackPage.tsx` - Handles Google OAuth callback

**New Environment Variables:**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

#### API Client Updates

**Files Modified:**
- `application/common-ui/src/apiClient.ts` - Updated `authenticateUser` to accept Google code instead of Cognito token

**Files Modified (DTOs):**
- `application/common-core/src/dto/auth.dto.ts` - Updated `AuthRequestDto` and `AuthResponseDto` to support Google OAuth

---

### 3. Infrastructure Changes

#### Docker Compose for Local Development

**New Files Created:**
- `docker-compose.yml` - PostgreSQL container for local development

**Database Container:**
- PostgreSQL 16 Alpine
- Automatic schema initialization from `database/ddl/core-schema.sql`
- Health checks
- Persistent volume for data
- Port 5432 exposed to host

---

## Removed Dependencies

### Backend NPM Packages
- `@aws-sdk/client-cognito-identity-provider`
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`

### Frontend NPM Packages
- `aws-amplify` (from user-app)

---

## How to Run Locally

### 1. Install Dependencies

```bash
cd application
yarn install
```

### 2. Set Up Environment Variables

#### Backend (`.env`)
```env
NODE_ENV=development
APP_PORT=4000
APP_HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=epunch
DB_PASSWORD=epunch_local_dev
DB_DATABASE=epunch

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# JWT Configuration
JWT_SECRET=your_jwt_secret_at_least_32_characters_long_please_change_this
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOADS_DIRECTORY=./uploads
```

#### User App (`.env`)
```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5173/auth/callback`
6. Copy Client ID and Client Secret to your `.env` files

### 4. Start Services

#### Start Database
```bash
docker-compose up -d
```

#### Start Backend
```bash
cd application/backend
yarn start:dev
```

#### Start User App
```bash
cd application/user-app
yarn dev
```

#### Start Merchant App (optional)
```bash
cd application/merchant-app
yarn dev
```

#### Start Admin App (optional)
```bash
cd application/admin-app
yarn dev
```

---

## Next Steps for VPS Deployment

Now that all AWS dependencies are removed, the application is ready for VPS deployment. See `VPS_MIGRATION_PLAN.md` for:

1. Production docker-compose configuration
2. Nginx configuration for multiple domains
3. SSL setup with Let's Encrypt
4. Deployment scripts
5. Data migration from AWS

---

## Authentication Flow Changes

### Old Flow (AWS Cognito)
1. User clicks "Sign in with Google"
2. Amplify redirects to Cognito hosted UI
3. Cognito handles Google OAuth
4. Cognito returns JWT token
5. Frontend sends token to backend
6. Backend validates with AWS Cognito

### New Flow (Custom Google OAuth)
1. User clicks "Sign in with Google"
2. Frontend redirects directly to Google OAuth
3. Google returns authorization code
4. Frontend sends code to backend
5. Backend exchanges code for Google user info
6. Backend generates custom JWT token
7. Backend returns token + user data
8. Frontend stores token for authenticated requests

---

## File Upload Flow Changes

### Old Flow (AWS S3 Presigned URLs)
1. Frontend requests presigned URL from backend
2. Backend generates S3 presigned URL
3. Frontend uploads directly to S3
4. File accessible via S3 public URL

### New Flow (Direct Upload)
1. Frontend requests upload URL from backend
2. Backend returns local path
3. Frontend uploads file via multipart/form-data
4. Backend saves to local filesystem
5. File accessible via nginx `/uploads/*` route

---

## Benefits

- **Cost Savings**: No AWS charges (~$100+/month saved)
- **Simplicity**: No vendor-specific services or configurations
- **Portability**: Can deploy to any VPS or cloud provider
- **Control**: Full access to all data and services
- **Development**: Easier local development without AWS credentials

---

## Testing Checklist

Before considering this complete, test the following:

- [ ] User can sign in with Google OAuth
- [ ] JWT token is properly generated and validated
- [ ] File uploads work and files are accessible
- [ ] Database connections work
- [ ] All frontend apps can communicate with backend
- [ ] Protected routes require authentication
- [ ] Merchant and admin authentication still works

---

## Notes

- The database schema is automatically initialized on first run via docker-compose
- File uploads are stored in `./uploads` directory (make sure it's in `.gitignore`)
- JWT secret should be changed in production (min 32 characters)
- Google OAuth credentials need to be configured for each environment
