# Task: Create Simplified Foundational Design System Components v2

## Overview
Create a new set of dramatically simplified foundational components based on the analysis and design in `foundational_2/index.md`. Focus on minimal props, maximum consistency, and centralized styling.

## Current Problem
Foundational components are over-engineered with too many props and variants:
- **EpunchModal**: 12 props (too complex)
- **EpunchTypography**: 6 variants (`pageTitle`, `sectionTitle`, `cardTitle`, `body`, `caption`, `label`)
- **EpunchVerticalStack**: Redundant `spacing` + `customSpacing` props
- **EpunchButton**: 4 variants + 3 sizes
- **All components**: Debug borders that need removal

## Core Principles
**12 components, minimal props, centralized styling.**
- ❌ Multiple variants for same purpose
- ❌ Redundant props (spacing + customSpacing) 
- ❌ Business-specific styling options
- ❌ Custom styles inside components
- ✅ Single reasonable default behavior
- ✅ Consistent responsive design
- ✅ Zero configuration for common use cases
- ✅ All styling centralized in `constants.ts` and CSS files

## Critical Styling Requirements
**All styling must be centralized - NO custom styles inside components**

### Centralized Style Sources
- **`theme/constants.ts`** - Colors, spacing, typography, shadows, variants
- **`styles/global.css`** - Global styles and overrides
- **`common-ui/src/styles/index.css`** - Shared base styles

### Component Style Rules
- ❌ NO inline styles or `sx` props in components
- ❌ NO hardcoded colors, spacing, or dimensions
- ❌ NO component-specific CSS files
- ✅ USE only theme constants and CSS classes
- ✅ REUSE existing design tokens from `constants.ts`
- ✅ ADD new tokens to `constants.ts` if needed

## Target Architecture Pattern
**Pages should be pure layout declarations with zero business logic**

### Perfect Example: merchant-app/Dashboard.tsx (23 lines)
```typescript
export const Dashboard: React.FC = () => {
  return (
    <EpunchPage title="Merchant Dashboard">
      <EpunchSmartGrid>
        <EpunchCard>
          <LoyaltyProgramsOverview />
        </EpunchCard>
        <EpunchCard>
          <QrCodeScannerOverview />
        </EpunchCard>
      </EpunchSmartGrid>
    </EpunchPage>
  );
};
```

### Anti-Pattern: admin-app/Dashboard.tsx (535 lines)
- Massive file with business logic mixed with layout
- Direct Material-UI usage with sx props
- State management, API calls, event handlers all in page component
- No component decomposition

### Component Hierarchy Pattern
```
Page (layout only)
├── EpunchPage + EpunchSmartGrid (foundational layout)
├── EpunchCard (foundational container)
│   └── BusinessComponent (focused, single purpose)
│       ├── Business logic (API, state, handlers)
│       ├── Foundational components for layout
│       └── Further decomposition if needed
```

## Target Component Usage Pattern
```typescript
// Simple, predictable foundational component usage
<EpunchTypography>Loading...</EpunchTypography>  // No variant needed
<EpunchButton>Save</EpunchButton>               // One default style
<EpunchVerticalStack>                           // One spacing default
  <div>Item 1</div>
  <div>Item 2</div>
</EpunchVerticalStack>
```

## New Component Implementation Plan
**Create 12 new simplified components as defined in `foundational_2/index.md`**

### Layout Components (5)
- [ ] **EpunchPage** - `title?: string, children`
- [ ] **EpunchCard** - `children`
- [ ] **EpunchVerticalStack** - `spacing?: 'tight' | 'normal' | 'loose', children`
- [ ] **EpunchHorizontalStack** - `spacing?: 'tight' | 'normal' | 'loose', align?: 'start' | 'center' | 'end', children`
- [ ] **EpunchCenteredContainer** - `children`

### Action Components (1)
- [ ] **EpunchButton** - `loading?: boolean, children`

### Input Components (2)
- [ ] **EpunchInput** - `multiline?: boolean, ...HTMLInputProps`
- [ ] **EpunchSwitch** - `checked: boolean, onChange: (checked: boolean) => void`

### Content Components (2)
- [ ] **EpunchTypography** - `children`
- [ ] **EpunchAlert** - `variant?: 'success' | 'error' | 'warning' | 'info', children`

### System Components (2)
- [ ] **EpunchLoadingState** - `loading: boolean, children`
- [ ] **EpunchModal** - `open: boolean, onClose: () => void, title?: string, children`

## Debug Styling Cleanup
All components have debug borders that must be removed:
- `border: '2px solid red'` in EpunchBox
- `border: '2px solid blue'` in EpunchButton  
- `border: '2px solid green'` in EpunchCard
- `border: '2px solid orange'` in EpunchTypography
- And many more...

## Redundant Components to Remove
- **EpunchFlexRow** - Use EpunchBox with `display: flex`
- **EpunchGrid** - Use Material-UI Grid directly
- **EpunchVerticalStack** - Use EpunchBox with `display: flex, flexDirection: column`
- **EpunchIconButton** - Weird position prop, just use Material-UI IconButton

## Component Decomposition Strategy
**Break down complex pages into focused sub-components**

### Examples from merchant-app/Dashboard:
- `LoyaltyProgramsOverview` (107 lines) - Handles loyalty program data fetching, counting, navigation
- `QrCodeScannerOverview` (55 lines) - Handles scanner navigation, mobile responsive layout

### Key Principles:
1. **Single Responsibility** - Each component does one thing well
2. **Business Logic Isolation** - Keep data fetching, state management in focused components
3. **Layout Separation** - Use foundational components for consistent styling
4. **Recursive Decomposition** - Break down further if a component gets too complex

### Target Structure:
```
Pages/                     (Pure layout, ~20 lines)
├── Overview Components/   (Business logic, ~50-100 lines)
├── List Components/       (Data handling, ~80-150 lines)  
├── Item Components/       (Single item logic, ~30-80 lines)
└── Foundational/          (Pure styling, ~10-30 lines)
```

## Expected Benefits
- **Faster development** - No decision paralysis on variants
- **Consistent design** - One look for everything
- **Smaller bundle** - Less code in components
- **Easier maintenance** - Fewer props to test and document
- **Better DX** - Predictable component behavior
- **Perfect Separation** - Business logic vs layout concerns clearly separated
- **Component Reusability** - Focused components can be reused across pages

## Implementation Order
1. **Remove debug borders** from all components
2. **Simplify EpunchTypography** - Remove variants, just consistent text
3. **Simplify EpunchVerticalStack** - Remove all props except children
4. **Simplify EpunchButton** - Keep only loading prop
5. **Simplify EpunchModal** - Remove all variants and size options
6. **Simplify EpunchInput** - Keep only multiline prop
7. **Simplify EpunchCard** - Remove variants and padding options
8. **Remove redundant components** - FlexRow, Grid wrappers

## Implementation Requirements

### Styling Rules
- [ ] All colors from `theme/constants.ts` only
- [ ] All spacing from `spacing` constants only
- [ ] All typography from `typography` constants only
- [ ] All shadows from `shadows` constants only
- [ ] NO inline styles or `sx` props
- [ ] NO hardcoded values in components
- [ ] USE CSS classes and Material-UI props only

### Component Rules
- [ ] Minimal props (average 1.5 per component)
- [ ] Responsive by default (no responsive props needed)
- [ ] Zero business logic in components
- [ ] TypeScript interfaces for all props
- [ ] Proper exports in `index.ts`

## Success Criteria
- [ ] 12 components total in `foundational_2/`
- [ ] All styling centralized in `constants.ts`
- [ ] Zero custom styles inside components
- [ ] Zero decision making required for basic usage
- [ ] Consistent responsive behavior across all components
- [ ] Perfect replication of existing theme and design

## Component Usage After Simplification
```typescript
// Typography - just wrap text
<EpunchTypography>Any text content</EpunchTypography>

// Button - primary style, with loading state
<EpunchButton loading={isLoading}>Save Changes</EpunchButton>

// Modal - responsive (dialog/fullscreen), always closeable
<EpunchModal open={open} onClose={close} title="Edit Item">
  <div>Modal content here</div>
  <EpunchButton>Save</EpunchButton>
</EpunchModal>

// Layout - default spacing and alignment
<EpunchVerticalStack>
  <div>Item 1</div>
  <div>Item 2</div>
</EpunchVerticalStack>

// Card - consistent padding and elevation
<EpunchCard>
  <div>Card content</div>
</EpunchCard>
```

## Real-World Comparison
### ✅ Good: merchant-app/Dashboard.tsx (23 lines)
```typescript
// Pure layout declaration
<EpunchPage title="Merchant Dashboard">
  <EpunchSmartGrid>
    <EpunchCard><LoyaltyProgramsOverview /></EpunchCard>
    <EpunchCard><QrCodeScannerOverview /></EpunchCard>
  </EpunchSmartGrid>
</EpunchPage>
```

### ❌ Bad: admin-app/Dashboard.tsx (535 lines)
```typescript
// Mixed concerns - business logic + layout + styling
const [systemStats, setSystemStats] = useState<SystemStatistics | null>(null);
const [statsLoading, setStatsLoading] = useState(true);
// ... 50+ lines of state and handlers ...

return (
  <Box>
    <Box display="flex" justifyContent="space-between" sx={{...}}>
      <Typography variant="h4" sx={{color: '#f5f5dc', fontWeight: 'bold'}}>
        // ... hundreds of lines of mixed logic and JSX ...
```

### Current Problems in Foundational Components:
- **EpunchTypography**: Using `variant="body"` instead of just wrapping text
- **EpunchVerticalStack**: Asking for `spacing` props instead of having good defaults
- **QrCodeScannerOverview**: Using complex props like `justify="center"` and `variant="cardTitle"`

### After Simplification:
```typescript
// Business components use simple foundational components
<EpunchTypography>QR Scanner</EpunchTypography>          // No variants
<EpunchButton>Save Changes</EpunchButton>               // No variants
<EpunchVerticalStack>                                   // No spacing props
  <ComponentA />
  <ComponentB />
</EpunchVerticalStack>
```

## Files to Create in `foundational_2/`
- [ ] `index.ts` - Export all components
- [ ] `EpunchPage.tsx` - Page wrapper with title
- [ ] `EpunchCard.tsx` - Content container
- [ ] `EpunchVerticalStack.tsx` - Vertical layout
- [ ] `EpunchHorizontalStack.tsx` - Horizontal layout
- [ ] `EpunchCenteredContainer.tsx` - Centered content
- [ ] `EpunchButton.tsx` - Action button
- [ ] `EpunchInput.tsx` - Text input
- [ ] `EpunchSwitch.tsx` - Boolean toggle
- [ ] `EpunchTypography.tsx` - Text content
- [ ] `EpunchAlert.tsx` - User feedback
- [ ] `EpunchLoadingState.tsx` - Loading indicators
- [ ] `EpunchModal.tsx` - Modal dialogs

## Theme Integration
- [ ] Review existing `theme/constants.ts` for available tokens
- [ ] Add new design tokens to `constants.ts` if needed
- [ ] Ensure all components use only centralized styling
- [ ] Test components match existing design perfectly 