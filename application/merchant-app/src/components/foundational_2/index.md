# Foundational Components v2 - Simplified Design System

**Principle: 10 components, minimal props, maximum consistency**

## Overview
This is the next generation of foundational **components**, dramatically simplified based on real-world usage patterns. We're reducing from 25+ components to just 10 essential ones.

## Core Philosophy
- **Zero decision paralysis** - One component, one purpose, one way to use it
- **Minimal API surface** - Most components have just `children` prop
- **Responsive by default** - Works perfectly on mobile and desktop
- **Business logic free** - Pure presentation layer

## Component Structure (12 Total)

### 1. Layout Components (5)

#### `EpunchPage`
**Purpose**: Top-level page wrapper with consistent spacing and optional title
**Props**: `title?: string, children`
```typescript
<EpunchPage title="Dashboard">
  {children}
</EpunchPage>
```

#### `EpunchCard`  
**Purpose**: Content container with consistent elevation and padding
**Props**: `children`
```typescript
<EpunchCard>
  <div>Card content</div>
</EpunchCard>
```

#### `EpunchVerticalStack`
**Purpose**: Vertical layout with consistent spacing
**Props**: `spacing?: 'tight' | 'normal' | 'loose', children`
```typescript
<EpunchVerticalStack>               {/* 16px default */}
  <div>Item 1</div>
  <div>Item 2</div>
</EpunchVerticalStack>
<EpunchVerticalStack spacing="tight">  {/* 8px */}
  <div>Compact item 1</div>
  <div>Compact item 2</div>
</EpunchVerticalStack>
```

#### `EpunchHorizontalStack`
**Purpose**: Horizontal layout with consistent spacing and alignment
**Props**: `spacing?: 'tight' | 'normal' | 'loose', align?: 'start' | 'center' | 'end', children`
```typescript
<EpunchHorizontalStack>             {/* 16px spacing, center aligned */}
  <EpunchButton>Cancel</EpunchButton>
  <EpunchButton>Save</EpunchButton>
</EpunchHorizontalStack>
<EpunchHorizontalStack align="end" spacing="tight">
  <div>Right aligned items</div>
</EpunchHorizontalStack>
```

#### `EpunchCenteredContainer`
**Purpose**: Centers content both horizontally and vertically
**Props**: `children`
```typescript
<EpunchCenteredContainer>
  <div>Perfectly centered content</div>
</EpunchCenteredContainer>
```

### 2. Action Components (1)

#### `EpunchButton`
**Purpose**: Primary action button with loading state
**Props**: `loading?: boolean, children`
```typescript
<EpunchButton>Save Changes</EpunchButton>
<EpunchButton loading={isLoading}>Processing...</EpunchButton>
```

### 3. Input Components (2)

#### `EpunchInput`
**Purpose**: Text input with consistent styling (handles text, email, password, number)
**Props**: `multiline?: boolean, ...HTMLInputProps`
```typescript
<EpunchInput placeholder="Enter text" />
<EpunchInput multiline placeholder="Long text" />
<EpunchInput type="email" placeholder="Email" />
```

#### `EpunchSwitch`
**Purpose**: Boolean toggle with consistent styling
**Props**: `checked: boolean, onChange: (checked: boolean) => void`
```typescript
<EpunchSwitch checked={enabled} onChange={setEnabled} />
```

### 4. Content Components (2)

#### `EpunchTypography`
**Purpose**: Consistent text styling for all content
**Props**: `children`
```typescript
<EpunchTypography>Any text content</EpunchTypography>
```

#### `EpunchAlert`
**Purpose**: User feedback messages
**Props**: `variant?: 'success' | 'error' | 'warning' | 'info', children`
```typescript
<EpunchAlert variant="success">Operation completed</EpunchAlert>
<EpunchAlert variant="error">Something went wrong</EpunchAlert>
```

### 5. System Components (2)

#### `EpunchLoadingState`
**Purpose**: Loading indicators and skeleton states
**Props**: `loading: boolean, children`
```typescript
<EpunchLoadingState loading={isLoading}>
  <div>Content to show when loaded</div>
</EpunchLoadingState>
```

#### `EpunchModal`
**Purpose**: Responsive modal (dialog on desktop, fullscreen on mobile)
**Props**: `open: boolean, onClose: () => void, title?: string, children`
```typescript
<EpunchModal open={isOpen} onClose={handleClose} title="Edit Item">
  <div>Modal content</div>
</EpunchModal>
```

## Component Implementation Plan

- [ ] `EpunchPage` - Page wrapper with title and responsive padding
- [ ] `EpunchCard` - Content container with elevation and padding
- [ ] `EpunchVerticalStack` - Vertical layout with spacing options
- [ ] `EpunchHorizontalStack` - Horizontal layout with spacing and alignment
- [ ] `EpunchCenteredContainer` - Centers content horizontally and vertically
- [ ] `EpunchButton` - Primary button with loading state
- [ ] `EpunchInput` - Text input with multiline support
- [ ] `EpunchSwitch` - Boolean toggle
- [ ] `EpunchTypography` - Consistent text styling
- [ ] `EpunchAlert` - User feedback messages
- [ ] `EpunchLoadingState` - Loading indicators
- [ ] `EpunchModal` - Responsive modal

## Design Tokens

### Spacing
- **Tight**: 8px (compact layouts)
- **Normal**: 16px (default for all stacks)
- **Loose**: 24px (relaxed layouts)
- **Card padding**: 24px
- **Page padding**: 16px mobile, 24px desktop

### Typography
- **Font family**: Inter (system fallback)
- **Font size**: 16px base (mobile and desktop)
- **Line height**: 1.5

### Colors
- **Primary**: #1976d2
- **Background**: #ffffff
- **Text**: #333333
- **Border**: #e0e0e0

### Elevation
- **Card shadow**: 0 2px 8px rgba(0,0,0,0.1)
- **Modal shadow**: 0 8px 32px rgba(0,0,0,0.15)

## Usage Examples

### Complete Page Example
```typescript
export const Dashboard: React.FC = () => {
  return (
    <EpunchPage title="Dashboard">
      <EpunchVerticalStack>
        <EpunchCard>
          <EpunchTypography>Welcome back!</EpunchTypography>
          <EpunchButton>Get Started</EpunchButton>
        </EpunchCard>
        <EpunchCard>
          <EpunchTypography>Settings</EpunchTypography>
          <EpunchSwitch checked={enabled} onChange={setEnabled} />
        </EpunchCard>
      </EpunchVerticalStack>
    </EpunchPage>
  );
};
```

### Form Example
```typescript
export const SettingsForm: React.FC = () => {
  return (
    <EpunchCard>
      <EpunchVerticalStack>
        <EpunchTypography>Account Settings</EpunchTypography>
        <EpunchInput placeholder="Display Name" />
        <EpunchInput type="email" placeholder="Email" />
        <EpunchInput multiline placeholder="Bio" />
        <EpunchSwitch checked={notifications} onChange={setNotifications} />
        <EpunchButton loading={saving}>Save Changes</EpunchButton>
      </EpunchVerticalStack>
    </EpunchCard>
  );
};
```

## Migration Strategy

### From Current Components
- `EpunchTypography` variants → Single `EpunchTypography`
- `EpunchButton` variants → Single `EpunchButton`  
- `EpunchCard` variants → Single `EpunchCard`
- `EpunchVerticalStack` spacing props → Fixed 16px spacing
- `EpunchModal` 12 props → 4 props

### Components Being Removed
- `EpunchFlexRow` → Use CSS flexbox directly
- `EpunchGrid` → Use CSS Grid or Material-UI Grid
- `EpunchIconButton` → Use Material-UI IconButton
- `EpunchContainer` → Use `EpunchPage` or `EpunchCard`
- `EpunchBox` → Use HTML div with CSS
- `EpunchProgress` → Use Material-UI CircularProgress
- `EpunchToggleButton` → Use `EpunchSwitch` or Material-UI directly

## Success Metrics
- [ ] 10 components total (down from 25+)
- [ ] Average 1.5 props per component (down from 5+)
- [ ] Zero variant confusion
- [ ] 100% responsive without configuration
- [ ] Zero debug styling
- [ ] All pages use only these 10 components for UI

## File Structure
```
foundational_2/
├── index.ts                 # Export all components
├── EpunchPage.tsx          # Page wrapper
├── EpunchCard.tsx          # Content container
├── EpunchVerticalStack.tsx # Vertical layout
├── EpunchButton.tsx        # Action button
├── EpunchInput.tsx         # Text input
├── EpunchSwitch.tsx        # Boolean toggle
├── EpunchTypography.tsx    # Text content
├── EpunchAlert.tsx         # User feedback
├── EpunchLoadingState.tsx  # Loading indicators
├── EpunchModal.tsx         # Modal dialogs
└── theme.ts                # Design tokens
```

---

**Goal**: Build 90% of UI needs with just these 10 components. Anything else should be a business component or use Material-UI directly. 