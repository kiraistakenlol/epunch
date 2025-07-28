# TASK: Bundle Feature Implementation

## Problem
Users can only collect punches through loyalty programs. Merchants need ability to pre-sell bundles (e.g., 10 gym visits, 20 coffee vouchers) that users can redeem over time with expiration dates.

## GOAL
Implement bundle system allowing merchants to create bundle programs with quantity presets, give bundles to users via QR scanning, and enable users to redeem bundle items with usage tracking.

## Implementation plan
* Agree on entities structure
* Outline main user and merchant flow
* Think through API that has to be implemented

## Implementation progress
- [x] Add table definitions to core-schema.sql
- [x] Create DTOs and mappers
- [x] Implement backend services and controllers
- [x] Update merchant app UI for bundle management
- [x] **Add bundle usage to QR scanning flow**
- [x] **Implement bundle repository, service, and controller**
- [x] **Add bundle events system (BUNDLE_CREATED, BUNDLE_USED)**
- [x] **Complete API client integration for bundle endpoints**
- [ ] Update user app UI for bundle display
- [ ] Test end-to-end workflows

## Current Progress Overview

### ✅ **Backend Infrastructure Complete**
- **Database**: Bundle program, bundle, bundle usage tables with soft delete
- **API Endpoints**: Full CRUD with authentication following punch-cards pattern
  - `GET /merchants/:merchantId/bundle-programs` (list programs)
  - `POST/PUT/DELETE /bundle-programs/*` (authenticated CRUD)
  - **`GET /bundles/:bundleId`** (get bundle details for scanning)
  - **`POST /bundles/:bundleId/use`** (redeem bundle quantity)
  - **`POST /bundles`** (create bundle for user)
  - **`GET /users/:userId/bundles`** (get user's bundles)
- **Bundle Repository**: Database operations for individual user bundles
- **Bundle Service**: Business logic with authentication and merchant authorization
- **Bundle Controller**: REST endpoints with proper auth decorators
- **Bundle Module**: Dependency injection and module wiring
- **Bundle Mapper**: Entity-to-DTO conversion with program details
- **Soft Delete**: Programs marked `is_deleted=true`, filtered from queries
- **DTOs**: Separate merchant/user DTOs with proper validation
- **Events System**: `BUNDLE_CREATED` and `BUNDLE_USED` events for real-time updates

### ✅ **Merchant App Complete**
- **Bundle Program Management**: Create, edit, view, delete programs
- **Redux Integration**: Centralized state management with `bundleProgramsSlice`
- **UI Components**: Form validation, data tables, loading states
- **Quantity Presets**: Dynamic array management with add/remove

### ✅ **QR Scanner Integration Complete**
- **Bundle QR Recognition**: `ScannerCamera` recognizes `bundle_id` QR codes
- **Bundle Scan Result UI**: Complete bundle scanning interface with:
  - Bundle details display (name, merchant, remaining quantity)
  - Quantity input with +/- buttons for flexible usage amounts
  - Expiration date validation and warnings
  - Availability checks and status badges (Available/Used Up/Expired)
  - Comprehensive error handling and loading states
- **Scanner State Management**: `useScanner` hook handles `bundleQR` state
- **Bundle Usage Action**: `handleUseBundle` with quantity validation
- **API Integration**: Real-time bundle usage via `apiClient.useBundle`

### 🔄 **Next Steps Required**

#### **User App Bundle Display**
- Show bundles alongside punch cards in dashboard
- Bundle cards with remaining quantity and expiration
- QR code switching to `bundle_id` for redemption

#### **Additional Scanner Features** (Future)
- Add bundle program selection to merchant scanner flow
- Implement "Give Bundle" action when scanning `user_id` QR codes

---

## ✅ **Major Accomplishments**

### **Complete Bundle Scanning Workflow**
- **QR Code Recognition**: Extended `ScannerCamera` to parse `bundle_id` QR codes
- **Bundle Details UI**: Professional interface showing bundle info, quantity controls, expiration status
- **Smart Validation**: Quantity input with +/- buttons, validation for available quantity and expiration
- **Real-time Usage**: Immediate bundle quantity updates via authenticated API calls
- **Error Handling**: Comprehensive error states for expired, used up, and not found bundles

### **Production-Ready Backend**
- **Authentication & Authorization**: Merchant users can only access their own bundles
- **Data Integrity**: Proper validation for quantity limits, expiration checks, merchant ownership
- **Event System**: Real-time notifications via `BUNDLE_CREATED` and `BUNDLE_USED` events
- **Database Design**: Efficient queries with proper relationships and soft delete support

### **Clean Architecture**
- **Separation of Concerns**: Bundle logic separated from punch card logic
- **Reusable Components**: Consistent UI patterns following existing design system
- **Type Safety**: Full TypeScript implementation with proper DTOs and interfaces

---

## Implementation Details

### Database changes

```sql
-- Bundle Program (Template)
CREATE TABLE bundle_program (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,                    -- "Gym Membership Package"
    item_name VARCHAR(100) NOT NULL,               -- "Gym Visit" 
    description TEXT,
    quantity_presets JSONB NOT NULL,              -- [{"quantity": 10, "validity_days": 90}, {"quantity": 20, "validity_days": 180}]
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Bundle Instance (User's Bundle)
CREATE TABLE bundle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    bundle_program_id UUID NOT NULL REFERENCES bundle_program(id) ON DELETE CASCADE,
    original_quantity INTEGER NOT NULL,           -- What they received initially
    remaining_quantity INTEGER NOT NULL,          -- Current remaining count
    expires_at TIMESTAMP,                         -- When it expires (nullable)
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMP
);

-- Bundle Usage Tracking  
CREATE TABLE bundle_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID NOT NULL REFERENCES bundle(id) ON DELETE CASCADE,
    quantity_used INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Main Flows

**Merchant:**
1. Create bundle programs with quantity presets ✅
2. Scan user QR (user_id) → see available bundle programs → select → choose preset → give to user 🔄
3. **Scan bundle QR (bundle_id) → see bundle details → redeem quantity ✅**

**User:**
1. View bundles alongside punch cards in app 🔄
2. Select bundle → QR switches to bundle_id mode for redemption 🔄

### QR Code Types ✅

```typescript
// Completed - Added to existing QRValueDto:
export type QRValueType = 'user_id' | 'redemption_punch_card_id' | 'bundle_id';

export interface QRValueBundleIdDto {
  type: 'bundle_id';
  bundle_id: string;
}

// Full QR Value DTO union type:
export type QRValueDto = QRValueUserIdDto | QRValuePunchCardIdDto | QRValueBundleIdDto;
```

### API Endpoints

```typescript
// Bundle Program Management ✅
GET    /merchants/{merchantId}/bundle-programs  // Get merchant's programs
POST   /bundle-programs                         // Create program (auth required)
PUT    /bundle-programs/{programId}             // Update program (auth required)  
DELETE /bundle-programs/{programId}             // Soft delete program (auth required)

// Bundle Operations ✅
POST /bundles                    // Give bundle to user (auth required)
GET  /users/{userId}/bundles     // Get user's bundles
POST /bundles/{bundleId}/use     // Redeem bundle quantity (auth required)
GET  /bundles/{bundleId}         // Get bundle details (auth required)
```

### Soft Delete Implementation

- ✅ **Soft Delete Pattern**: Programs marked as `is_deleted = true` instead of hard deletion
- ✅ **Bundle Preservation**: Existing user bundles remain intact when program is "deleted"
- ✅ **Filtered Queries**: All GET operations filter out soft-deleted programs
- ✅ **Audit Trail**: `deleted_at` timestamp tracks when deletion occurred
- ✅ **Updated Tracking**: `updated_at` field automatically set on program updates

### Authentication Pattern

- ✅ **Follows punch-cards pattern**: Uses `@RequireMerchantUser()` and `@Auth()` decorators
- ✅ **No merchant ID in URLs**: Authentication provides merchant context
- ✅ **Cleaner API**: Bundle operations use `/bundle-programs/*` instead of `/merchants/:id/bundle-programs/*`

### Key DTOs

```typescript
interface BundleProgramPreset {
  quantity: number;
  validityDays: number | null;
}

// For merchants (includes presets)
interface BundleProgramDto {
  id: string;
  merchantId: string;
  name: string;                    // "Gym Membership Package"
  itemName: string;               // "Gym Visit"
  description: string | null;
  quantityPresets: BundleProgramPreset[];
  isActive: boolean;
}

// For users (no presets needed)
interface BundleProgramSummaryDto {
  id: string;
  name: string;                    // "Gym Membership Package"
  itemName: string;               // "Gym Visit"
  description: string | null;
  merchantName: string;           // Users want to see which merchant
}

interface BundleDto {
  id: string;
  userId: string;
  bundleProgram: BundleProgramSummaryDto;
  originalQuantity: number;
  remainingQuantity: number;
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

// Create/Update DTOs
interface BundleProgramCreateDto {
  name: string;
  itemName: string;
  description?: string;
  quantityPresets: BundleProgramPreset[];
  isActive?: boolean;
}

interface BundleProgramUpdateDto {
  name?: string;
  itemName?: string;
  description?: string;
  quantityPresets?: BundleProgramPreset[];
  isActive?: boolean;
}

interface BundleCreateDto {
  userId: string;
  bundleProgramId: string;
  quantity: number;
  validityDays?: number;          // Optional override
}

interface BundleUseDto {
  quantityUsed?: number;          // Default 1
}

// QR Value DTO extension
interface QRValueBundleIdDto {
  type: 'bundle_id';
  bundle_id: string;
}
```
