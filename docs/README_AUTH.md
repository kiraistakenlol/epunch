# Authentication System Overview

## 🏗️ Architecture Summary

E-Punch uses a **unified authentication middleware** that supports **three distinct user types** across **three frontend applications**, all served by a **single backend**. The system is designed for flexibility, type safety, and clear separation of concerns.

## 🎯 Three Apps, Three User Types

| App | User Type | Auth Method | Endpoint | Token Source |
|-----|-----------|-------------|----------|--------------|
| **user-app** | End Users | Cognito JWT | `POST /auth` | AWS Cognito |
| **merchant-app** | Merchant Users | Login/Password | `POST /merchants/auth` | Backend JWT |
| **admin-app** | Super Admin | Hardcoded | `POST /admin/auth` | Backend JWT |

## 🔐 Authentication Flow

### 1. End Users (user-app)
```typescript
// Flow:
// 1. User authenticates with Cognito (external)
// 2. Frontend gets Cognito JWT token
// 3. Frontend calls backend with Cognito token + temp user ID
POST /auth
{
  "authToken": "cognito-jwt-token",
  "userId": "temp-anonymous-id"
}

// Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com", 
    "superAdmin": false
  }
}
```

### 2. Merchant Users (merchant-app)
```typescript
// Flow:
// 1. User enters login/password in frontend
// 2. Frontend calls backend for authentication
POST /merchants/auth
{
  "login": "cafe-admin",
  "password": "password123"
}

// Response:
{
  "token": "backend-generated-jwt"
}
```

### 3. Super Admin (admin-app)
```typescript
// Flow:
// 1. Admin enters hardcoded credentials
// 2. Frontend calls backend (credentials validated server-side)
POST /admin/auth
{
  "login": "admin",
  "password": "0000"
}

// Response:
{
  "token": "super-admin-jwt"
}
```

## 🛡️ Unified Authentication Middleware

**Location**: `backend/src/core/middleware/auth.middleware.ts`

The middleware intelligently detects and parses different token types with **three dedicated parsing methods**:

- `tryParseAdminToken()` - Detects super admin tokens
- `tryParseEndUserToken()` - Detects Cognito user tokens  
- `tryParseMerchantUserToken()` - Detects merchant user tokens

```typescript
interface Authentication {
  merchantUser?: MerchantUserAuthentication;
  endUser?: EndUserAuthentication;
  superAdmin: boolean; // true if ANY user type is super admin
}
```

### Token Detection Logic:
1. **Try Admin Token** (has `type: 'admin'` + `sub: 'admin-user'`) - **Highest Priority**
2. **Try Cognito Token** (has `sub` + `email`) - Regular end users  
3. **Try Merchant Token** (has `userId` + `merchantId` + `role`) - Merchant users

### JWT Payload Structures:

```typescript
// Cognito Token (End Users)
{
  sub: "cognito-user-id",
  email: "user@example.com",
  // ... other Cognito fields
}

// Merchant Token
{
  userId: "merchant-user-uuid",
  merchantId: "merchant-uuid", 
  role: "admin" | "staff"
}

// Admin Token
{
  sub: "admin-user",
  email: "admin@epunch.io",
  login: "admin",
  superAdmin: true,
  type: "admin" // 🔑 Key identifier
}
```

## 🎛️ Security Decorators System

**Location**: `backend/src/core/decorators/security.decorators.ts`

### Basic Usage:
```typescript
@Get('endpoint')
@RequireEndUser()                    // Only end users
@RequireMerchantUser(['admin'])      // Only merchant admins
@RequireMerchantUser(['staff', 'admin']) // Staff OR admin
@RequireAnyAuth()                    // Any authenticated user
```

### Advanced OR Logic:
```typescript
@Get('complex-endpoint')
@RequireAuth(Or(
  EndUser(),                         // End users
  MerchantUser(['admin'])           // OR merchant admins
))
async complexEndpoint(@Auth() auth: Authentication) {
  if (isEndUser(auth)) {
    // Handle end user logic
  } else if (isMerchantUser(auth)) {
    // Handle merchant user logic  
  }
}
```

### Type Safety:
```typescript
// Type guards provide runtime safety
if (isEndUser(auth)) {
  auth.endUser.email;     // ✅ TypeScript knows this exists
  auth.merchantUser.role; // ❌ Compiler error
}

if (isMerchantUser(auth)) {
  auth.merchantUser.role;      // ✅ Available
  auth.merchantUser.merchantId; // ✅ Available
}
```

## 👑 Super Admin Override

**Super admins bypass ALL security checks automatically.**

```typescript
@Get('sensitive-merchant-data')
@RequireMerchantUser(['admin'])
getData(@Auth() auth: Authentication) {
  // Merchant admin: ✅ Access granted (has admin role)
  // Merchant staff: ❌ Access denied (missing admin role)
  // End user: ❌ Access denied (wrong user type)
  // Super admin: ✅ Access granted (bypasses all checks)
}
```

## 🗄️ Database Schema

### End Users Table
```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  external_id TEXT UNIQUE,      -- Cognito user ID
  external_provider TEXT,       -- 'cognito'
  super_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Merchant Users Table  
```sql
CREATE TABLE merchant_user (
  id UUID PRIMARY KEY,
  merchant_id UUID REFERENCES merchant(id),
  login TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role_id UUID REFERENCES merchant_role(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_login_per_merchant UNIQUE(merchant_id, login)
);

CREATE TABLE merchant_role (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE -- 'admin', 'staff'
);
```

### Admin Users
**No database table** - hardcoded in `AdminAuthService`:
- Login: `admin`
- Password: `0000`
- Always `superAdmin: true`

## 🔧 Implementation Files

### Core Authentication:
- `auth.middleware.ts` - Unified token parsing
- `security.decorators.ts` - Type-safe auth decorators
- `security-check.guard.ts` - Permission evaluation
- `authentication.interface.ts` - TypeScript types

### Controllers:
- `auth.controller.ts` - End user authentication
- `merchant.controller.ts` - Merchant user authentication (+ CRUD)
- `admin-auth.controller.ts` - Super admin authentication

### Services:
- `auth.service.ts` - End user auth logic
- `merchant.service.ts` - Merchant auth + business logic
- `admin-auth.service.ts` - Super admin auth logic

## 🎨 Usage Patterns

### 1. Public Endpoints (No Auth)
```typescript
@Get('public-data')
async getPublicData() {
  // No decorators = no auth required
}
```

### 2. End User Only
```typescript
@Get('my-punch-cards')
@RequireEndUser()
async getMyCards(@Auth() auth: Authentication) {
  return this.service.getCards(auth.endUser!.id);
}
```

### 3. Merchant Users Only
```typescript
@Get('merchant-dashboard')
@RequireMerchantUser()
async getDashboard(@Auth() auth: Authentication) {
  return this.service.getDashboard(auth.merchantUser!.merchantId);
}
```

### 4. Role-Based Access
```typescript
@Post('merchant-users')
@RequireMerchantUser(['admin'])  // Only merchant admins
async createUser(@Auth() auth: Authentication) {
  // Create user for auth.merchantUser!.merchantId
}
```

### 5. Cross-User-Type Access
```typescript
@Get('loyalty-programs/:merchantId')
@RequireAuth(Or(EndUser(), MerchantUser(['staff', 'admin'])))
async getPrograms(
  @Param('merchantId') merchantId: string,
  @Auth() auth: Authentication
) {
  if (isEndUser(auth)) {
    // End users can view any merchant's programs
    return this.service.getPrograms(merchantId);
  } else {
    // Merchant users can only view their own
    if (auth.merchantUser!.merchantId !== merchantId) {
      throw new ForbiddenException();
    }
    return this.service.getPrograms(merchantId);
  }
}
```

## 🚨 Security Considerations

### Token Validation:
- **Cognito tokens**: Verified against AWS Cognito public keys
- **Merchant tokens**: Signed with backend JWT secret
- **Admin tokens**: Signed with backend JWT secret

### Password Security:
- Merchant user passwords hashed with bcrypt
- Admin password hardcoded (development only)

### RBAC (Role-Based Access Control):
- Simple roles: `admin`, `staff`
- Roles stored in `merchant_role` table
- Users assigned roles via `merchant_user.role_id`

### Super Admin Privileges:
- Bypasses all role and user type checks
- Should be used sparingly in production
- Currently hardcoded for development

## 📱 Frontend Integration

### API Client Usage:
```typescript
// user-app
const response = await apiClient.authenticateUser(cognitoToken, tempUserId);

// merchant-app  
const response = await apiClient.authenticateMerchant('login', 'password');

// admin-app
const response = await apiClient.authenticateAdmin('admin', '0000');
```

### Token Storage:
- **user-app**: Cognito handles token management
- **merchant-app**: Store JWT in localStorage as `merchant_token`
- **admin-app**: Store JWT in localStorage as `admin_token` 