## Current goal overview
Wre're in the process of refactoring project's compoents to stop using `/foundational` components and migrate to `/foundational_2` components with proper CSS modules and design tokens.

## Current Problem
The project currently uses over-engineered `/foundational` components throughout. We need to:
- Replace `/foundational` components with `/foundational_2` components when appropriate
- Use standard HTML elements with CSS modules for custom styling
- Always use `@css-variables.ts` and `@constants.ts` for all styling
- Eliminate Material-UI components in favor of native HTML + CSS
- Use react-toast for error handling instead of custom alert components

## Current Findings (LoginPage Investigation)

### Available Foundational_2 Components
- **Layout**: `EpunchPage`, `EpunchCard`
- **Actions**: `Button`, `SuccessButton`, `ErrorButton`, `ConfirmOrCancelButtons`
- **Inputs**: `EpunchInput`, `EpunchSwitch` 
- **System**: `EpunchModal`

### Critical Issue Found ✅ RESOLVED
✅ **EpunchInput Material-UI Eliminated**: Successfully refactored `EpunchInput` to use native HTML `<input>/<textarea>` with CSS modules, removing `@mui/material/TextField` dependency.

### Available Resources
- **CSS Variables**: All set up in `@css-variables.ts` with proper root injection
- **Theme Constants**: Complete theme system in `@constants.ts`
- **React-Toastify**: Available via `@utils/toast.ts` with helper functions:
  - `showSuccessToast(message)`
  - `showErrorToast(message)`
  - `showInfoToast(message)`
  - `showWarningToast(message)`

### LoginPage Refactoring Strategy ✅ COMPLETED
1. ✅ **Use EpunchCard for form container** - Replaced foundational EpunchCard
2. ✅ **Refactored EpunchInput** - Eliminated Material-UI, now uses native HTML with CSS modules
3. ✅ **Use Button from foundational_2** - Replaced EpunchButton
4. ✅ **Replace EpunchAlert with toast** - Use `showErrorToast()` for error messages
5. ✅ **Remove typography components** - Use native `<h1>`, `<p>` with CSS modules
6. ✅ **Full-page layout with CSS modules** - Custom layout without over-engineered page components

## Core Requirements

### 1. Use Foundational_2 Components
- **Foundational_2 is already created** - Use existing components from `/foundational_2`
- **When appropriate** - Use foundational_2 components for layout and common UI patterns
- **Standard HTML otherwise** - Use `div`, `p`, `span`, `section` with CSS modules for custom components
- **Ask before creating new components** - If you think we'd benefit from a new `@/foundational_2` component, ask me first

### 2. CSS-First Approach
- **Always use `@css-variables.ts`** - All styling must use available CSS variables
- **Always use `@constants.ts`** - Reference theme constants for consistency
- **CSS Modules with prefixes** - Create separate `.module.css` files with component-specific prefixes
- **No inline styles** - All styling in CSS files, not JSX

### 3. No Material-UI
- **Eliminate Material-UI** - Replace all Material-UI components with HTML + CSS
- **Use react-toast** - For error messages and notifications (already installed)
- **Standard HTML elements** - Button, input, div, p, etc. with proper CSS styling

### 4. Component Architecture
- **Pages** - Pure layout declarations using foundational_2 components
- **Business Components** - Focused components handling specific functionality
- **Shared Components** - Reusable components like DashboardCard with CSS modules

### 5. CSS Module Structure
- **Component prefixes** - Use consistent naming like `.dashboardCard`, `.loyaltyOverview`
- **Clear hierarchy** - `.componentName`, `.componentName-element`, `.componentName-modifier`
- **Only CSS variables** - Reference `@css-variables.ts` for all styling values

### 6. Error Handling
- **React-toast only** - Use react-toast for all error messages and notifications
- **No custom alerts** - Remove custom alert components in favor of toast

## Perfect Example: Merchant Dashboard Architecture

### Dashboard.tsx (Layout Only)
```typescript
import { EpunchPage } from '../components/foundational';
import { LoyaltyProgramsOverview } from './LoyaltyProgramsOverview';
import { QrCodeScannerOverview } from './QrCodeScannerOverview';

export const Dashboard: React.FC = () => {
  return (
    <EpunchPage title="Merchant Dashboard">
      <div className={styles.dashboardGrid}>
        <LoyaltyProgramsOverview />
        <QrCodeScannerOverview />
      </div>
    </EpunchPage>
  );
};
```

### Business Components (LoyaltyProgramsOverview.tsx)
- Handles API calls, state management, business logic
- Uses DashboardCard for consistent layout
- Uses CSS modules for custom styling

### Shared Components (DashboardCard.tsx)
- Uses foundational_2 EpunchCard component
- Adds dashboard-specific styling via CSS modules
- Reusable across dashboard components

## Success Criteria
- [x] Zero imports from `/foundational`
- [x] All components use `/foundational_2` when appropriate
- [x] All styling uses CSS variables from `@css-variables.ts`
- [x] All theme references use `@constants.ts`
- [x] No Material-UI components
- [x] React-toast for all error handling
- [x] CSS modules with proper prefixes
- [x] Visual appearance unchanged
- [x] Clear component separation (layout vs business logic)

## Reference Implementation
- **QRScanner.tsx** - Successfully refactored with CSS modules
- **Dashboard architecture** - Perfect example of layout separation
- **DashboardCard.tsx** - Shows foundational_2 + CSS module pattern
- **LoginPage.tsx** - Complete refactoring with EpunchInput + CSS modules + toast
- **EpunchInput** - Material-UI eliminated, native HTML + CSS modules
- **Form Components** - New foundational_2/form architecture for reusable forms

## New Form Architecture ✅ CREATED

### Form Components in `/foundational_2/form/`
- **FormContainer**: Replaces EpunchForm with clean layout + actions
- **FormField**: Wraps EpunchInput with validation display
- **useFormState**: Custom hook for form state management + validation

### Usage Pattern:
```typescript
const { formData, errors, handleFieldChange, validateForm } = useFormState(
  initialData, 
  validationRules
);

<FormContainer onSubmit={handleSubmit} submitText="Create">
  <FormField
    label="Name"
    value={formData.name}
    onChange={handleFieldChange('name')}
    error={!!errors.name}
    helperText={errors.name}
    required
  />
</FormContainer>
```
