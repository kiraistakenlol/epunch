# Foundational Design System Components

**Principle: Minimal props, maximum consistency. Zero configuration for common use cases.**

These components provide consistent styling and responsive behavior across the entire application. Each component has minimal props and focuses on a single responsibility.

## Architecture Philosophy

### Design Goals
- **Zero decision paralysis** - One good default for everything
- **Consistent responsive behavior** - Works perfectly on desktop and mobile
- **No business logic** - Pure styling and layout components
- **Minimal API surface** - Fewer props = fewer bugs

### Usage Pattern
```typescript
// Pages are pure layout declarations
<EpunchPage title="Page Name">
  <EpunchSmartGrid>
    <EpunchCard><BusinessComponent1 /></EpunchCard>
    <EpunchCard><BusinessComponent2 /></EpunchCard>
  </EpunchSmartGrid>
</EpunchPage>
```

## Core Layout Components

### EpunchPage
**Purpose**: Top-level page wrapper with consistent header and responsive layout
**Justification**: Every page needs consistent spacing, responsive behavior, and optional titles
```typescript
<EpunchPage title="Dashboard">
  {children}
</EpunchPage>
```

### EpunchSmartGrid
**Purpose**: Responsive grid that adapts columns based on screen size
**Justification**: Common pattern for dashboard-style layouts that need to stack on mobile
```typescript
<EpunchSmartGrid>
  <div>Auto-responsive grid item</div>
  <div>Another grid item</div>
</EpunchSmartGrid>
```

### EpunchCard
**Purpose**: Consistent container with elevation, padding, and rounded corners
**Justification**: Primary content container used throughout the app
```typescript
<EpunchCard>
  <div>Card content with consistent styling</div>
</EpunchCard>
```

### EpunchBox
**Purpose**: Generic container with consistent spacing - thin wrapper over Material-UI Box
**Justification**: Sometimes you need a simple container without card styling
```typescript
<EpunchBox>
  <div>Simple container</div>
</EpunchBox>
```

### EpunchVerticalStack
**Purpose**: Vertical layout with consistent spacing between items
**Justification**: Common pattern for forms, lists, and vertical content
```typescript
<EpunchVerticalStack>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</EpunchVerticalStack>
```

## Form Components

### EpunchInput
**Purpose**: Consistent text input with unified styling
**Props**: `multiline?` (only prop needed)
**Justification**: All text inputs should look and behave the same
```typescript
<EpunchInput placeholder="Enter text" />
<EpunchInput multiline placeholder="Enter long text" />
```

### EpunchButton
**Purpose**: Primary button with loading state support
**Props**: `loading?` (only prop needed)
**Justification**: All buttons should have consistent styling and loading UX
```typescript
<EpunchButton>Save Changes</EpunchButton>
<EpunchButton loading={isLoading}>Processing...</EpunchButton>
```

### EpunchSwitch
**Purpose**: Boolean toggle input with consistent styling
**Justification**: Standard form control for on/off states
```typescript
<EpunchSwitch checked={enabled} onChange={setEnabled} />
```

## Content Components

### EpunchTypography
**Purpose**: Consistent text styling across the app
**Props**: `children` (no variants needed)
**Justification**: All text should have consistent font, size, and color
```typescript
<EpunchTypography>Any text content</EpunchTypography>
```

### EpunchAlert
**Purpose**: User feedback for success, error, warning, info states
**Props**: `variant?` (success | error | warning | info)
**Justification**: Semantic variants are meaningful for user feedback
```typescript
<EpunchAlert variant="success">Operation completed</EpunchAlert>
<EpunchAlert variant="error">Something went wrong</EpunchAlert>
```

### EpunchModal
**Purpose**: Responsive modal (dialog on desktop, fullscreen on mobile)
**Props**: `open, onClose, title?, children`
**Justification**: Common pattern for forms, confirmations, and detailed views
```typescript
<EpunchModal open={isOpen} onClose={handleClose} title="Edit Item">
  <div>Modal content</div>
</EpunchModal>
```

## Specialized Components

### EpunchDropzone
**Purpose**: File upload with drag-and-drop support
**Justification**: Specific business need for image/file uploads
```typescript
<EpunchDropzone onFilesSelected={handleFiles}>
  Drop files here or click to browse
</EpunchDropzone>
```

### EpunchImageDisplay
**Purpose**: Consistent image display with loading states and fallbacks
**Justification**: Common pattern for logos, avatars, and content images
```typescript
<EpunchImageDisplay src={imageUrl} alt="Description" />
```

### EpunchLoadingState
**Purpose**: Loading indicators and skeleton states
**Justification**: Consistent loading UX across the app
```typescript
<EpunchLoadingState loading={isLoading}>
  <div>Content to show when loaded</div>
</EpunchLoadingState>
```

## Container Utilities

### EpunchContainer
**Purpose**: Max-width container with responsive padding
**Justification**: Standard layout container for content sections
```typescript
<EpunchContainer>
  <div>Constrained width content</div>
</EpunchContainer>
```

### EpunchCenteredContainer
**Purpose**: Flexbox container that centers content
**Justification**: Common pattern for empty states, loading screens, and simple layouts
```typescript
<EpunchCenteredContainer>
  <div>Centered content</div>
</EpunchCenteredContainer>
```

## Components Being Removed

### EpunchFlexRow ❌
**Reason**: Use EpunchBox with `display: flex` - wrapper adds no value

### EpunchGrid ❌
**Reason**: Material-UI Grid is already simple enough - wrapper adds complexity

### EpunchIconButton ❌
**Reason**: Weird position prop, just use Material-UI IconButton directly

### EpunchToggleButton ❌
**Reason**: Rarely used, can use Material-UI directly when needed

### EpunchNumberInput ❌
**Reason**: Use EpunchInput with `type="number"` - no wrapper needed

### EpunchProgress ❌
**Reason**: Use Material-UI CircularProgress directly - wrapper adds no value

## Complex Business Components

### EpunchPropertyEditor
**Purpose**: Generic key-value property editing interface
**Justification**: Reusable across multiple business contexts (styles, settings, metadata)

### EpunchPropertyDisplay
**Purpose**: Read-only display of key-value properties
**Justification**: Consistent formatting for displaying object properties

### EpunchForm
**Purpose**: Form wrapper with validation and submission handling
**Justification**: Consistent form behavior and error handling

## Design Principles

### 1. Minimal Configuration
- Most components have zero required props beyond `children`
- Sensible defaults eliminate decision making
- No variant props unless semantically meaningful

### 2. Responsive by Default
- All components work perfectly on mobile and desktop
- No need to specify responsive behavior
- Mobile-first approach with desktop enhancements

### 3. Consistent Theming
- All components use the same color palette
- Consistent spacing, typography, and shadows
- Theme changes automatically apply to all components

### 4. Zero Business Logic
- Components are pure presentation layer
- No API calls, state management, or business rules
- Business components compose these for functionality

## Migration Guide

### Before (Over-engineered)
```typescript
<EpunchTypography variant="cardTitle" color="primary" bold>
  Title Text
</EpunchTypography>
<EpunchButton variant="secondary" size="large" fullWidth>
  Save
</EpunchButton>
<EpunchVerticalStack spacing="large" align="center">
  <div>Item</div>
</EpunchVerticalStack>
```

### After (Simplified)
```typescript
<EpunchTypography>Title Text</EpunchTypography>
<EpunchButton>Save</EpunchButton>
<EpunchVerticalStack>
  <div>Item</div>
</EpunchVerticalStack>
```

## Development Guidelines

1. **Use foundational components for all styling** - No direct Material-UI imports in business logic
2. **No sx props outside foundational components** - Keep styling centralized  
3. **Compose, don't configure** - Create new components instead of adding props
4. **Business logic belongs in business components** - Keep foundational components pure
5. **Responsive design is built-in** - Don't manually handle mobile/desktop differences

## Success Metrics

- [ ] All components have ≤2 props (except children)
- [ ] Zero debug styling in any component  
- [ ] Zero decision making for basic usage
- [ ] Consistent responsive behavior
- [ ] No variant prop confusion

---

**Remember**: The goal is consistency and simplicity. When in doubt, choose the option with fewer props and more sensible defaults. 