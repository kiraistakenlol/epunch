# Task: Refactor Merchant-App Components Using Design System Pattern

## Overview
Refactor merchant-app components to separate business logic from styling. Apply the established design system pattern where pages become pure layout declarations.

## Exploration Required
Analyze merchant-app components to identify:
1. **Business logic components** - Data fetching, state management, event handlers
2. **Styling complexity** - Inline styles, sx props, hardcoded values
3. **Layout patterns** - Repeated responsive behavior, spacing, positioning
4. **Missing design system components** - Gaps in current component library

## Design System Principle
**All design system components must be generic with zero business context knowledge.**
- ❌ `variant="dashboard"` (business-specific)
- ✅ `variant="grid"` or `variant="centered"` (generic)
- ✅ Extract specific business components like `DashboardLayout` that use generic components

## Target Pattern
```typescript
// Pages should become layout declarations
<EpunchPage title="Page Name">
  <EpunchSmartGrid>
    <EpunchCard><BusinessComponent1 /></EpunchCard>
    <EpunchCard><BusinessComponent2 /></EpunchCard>
  </EpunchSmartGrid>
</EpunchPage>
```

## Available Design System Components
- **Layout**: EpunchPage, EpunchSmartGrid, EpunchCard, EpunchBox, EpunchContainer, EpunchFlexRow
- **Forms**: EpunchInput, EpunchButton, EpunchIconButton, EpunchSwitch, EpunchToggleButton
- **Content**: EpunchTypography, EpunchAlert, EpunchProgress, EpunchModal

## Target Files for Refactoring
- [ ] `features/scanner/ScannerPage.tsx` (574 lines)
- [ ] `pages/Design.tsx` (620 lines)
- [ ] `components/ImagePicker.tsx` (461 lines)
- [ ] `components/IconCustomizer/` (6 files)
- [ ] Any other components with significant styling complexity

## Process
1. **Extract business components** - Move data fetching, state, handlers into focused components
2. **Create missing design components** - Add generic layout/styling components as needed
3. **Transform pages** - Replace with pure layout declarations using design system

## Requirements
- [ ] Zero Material-UI imports in business logic components
- [ ] Zero `sx` props outside design system components
- [ ] Zero business context in design system components
- [ ] Zero hardcoded colors/spacing in business logic
- [ ] Mobile responsiveness handled by design system
- [ ] All styling centralized in design system components

## Progress

### Phase 1: Analysis Complete ✅
- [x] **Codebase structure exploration** - Identified 7 pages, 9 components, 1 feature
- [x] **Styling complexity audit** - Found 75+ sx prop usages across components
- [x] **Material-UI import analysis** - Found 25+ files with direct Material-UI imports
- [x] **Target file evaluation** - Confirmed high complexity in Design.tsx (620 lines), ScannerPage.tsx (574 lines), ImagePicker.tsx (461 lines)

### Phase 2: Design System Gaps Identified ✅
- [x] **Create EpunchDropzone** - For file upload UI patterns (ImagePicker needs)
- [x] **Create EpunchModal variants** - Fullscreen, dialog, drawer, overlay variants
- [x] **Create EpunchImageDisplay** - For logo/image preview patterns
- [x] **Create EpunchPropertyEditor** - For form-based property editing
- [x] **Create EpunchLoadingState** - For loading overlays and states
- [x] **EpunchDragDropArea** - Integrated into EpunchDropzone (no separate component needed)

### Phase 3: Business Logic Component Extraction
- [x] **ImagePicker** - Extract from ImagePicker.tsx (S3 upload, validation, cropping)
- [ ] **QRScannerLogic** - Extract from ScannerPage.tsx (camera, QR detection, parsing)  
- [ ] **ColorCustomizerLogic** - Extract from Design.tsx (color picker, style management)
- [x] **IconCustomizerLogic** - Extract from Design.tsx (icon search, selection, properties)
- [x] **PunchCardStyleLogic** - Extract from Design.tsx (style API calls, state management)
- [ ] **LoyaltyProgramSelectorLogic** - Extract from ScannerPage.tsx (program selection)

### Phase 4: Page Refactoring
- [x] **Design.tsx** (620 lines → 85 lines = 86% reduction) ✅
  - [x] Remove all sx props (15+ instances)
  - [x] Extract ColorCustomizer, IconCustomizer, LogoUploader components
  - [x] Replace with EpunchPage + EpunchSmartGrid layout
- [x] **ScannerPage.tsx** (574 lines → 87 lines = 85% reduction) ✅
  - [x] Remove all sx props (8+ instances)  
  - [x] Extract QRScanner, UserPersonalQR, PunchCardQR, ProcessingState, MessageDisplay components
  - [x] Replace with EpunchPage + state machine pattern
  - [x] Implement mutually exclusive state rendering
- [ ] **Other pages with styling complexity**
  - [ ] LoyaltyProgramEdit.tsx - Remove sx props, use design system
  - [ ] LoyaltyPrograms.tsx - Remove direct Material-UI usage
  - [ ] Settings.tsx - Consolidate form patterns

### Phase 5: Component Refactoring  
- [x] **ImagePicker.tsx** (459 lines → 145 lines = 68% reduction) ✅
  - [x] Remove all sx props (20+ instances)
  - [x] Extract ImageUpload, ImageDisplay, FileDropzone components
  - [x] Use EpunchBox, EpunchModal, EpunchButton design system components
  - [x] Implement state machine pattern with ModalState
- [ ] **IconCustomizer/** (6 files → business logic + design components)
  - [ ] IconGrid.tsx - Remove sx props, use EpunchGrid
  - [ ] SVGPropertyEditor.tsx - Use EpunchInput, EpunchButton forms
  - [ ] IconPreviewSection.tsx - Use EpunchCard layouts
  - [ ] IconCustomizationPanel.tsx - Use design system components
- [ ] **DashboardLayout.tsx** - Remove remaining sx props

### Phase 6: Design System Cleanup
- [ ] **Remove debug styling** - Clean up EpunchGrid debug borders
- [ ] **Fix remaining sx usage** - Address any sx props in design system components
- [ ] **Material-UI import audit** - Ensure no business logic files import Material-UI
- [ ] **CSS module cleanup** - Remove ScannerPage.module.css (197 lines)

### Phase 7: Validation
- [ ] **Build verification** - Ensure all components compile
- [ ] **Visual regression check** - Verify no UI changes
- [ ] **Mobile responsiveness test** - Confirm responsive behavior
- [ ] **Design system enforcement** - Audit for violations

## Deliverables
- Refactored components following the established pattern
- New design system components if needed
- Business logic components with pure focus
- Pages as layout declarations

## Current Analysis Summary
**Files with Heavy Styling (Priority Order):**
1. **Design.tsx** - 620 lines, 15+ sx props, complex icon/color customization
2. **ScannerPage.tsx** - 574 lines, CSS module + sx props, camera/QR logic
3. **ImagePicker.tsx** - 461 lines, 20+ sx props, complex upload/crop logic
4. **IconCustomizer/** - 6 files, multiple sx props per file

**Design System Needs:**
- File upload patterns (dropzone, preview, cropping)
- Modal/dialog variants (fullscreen, drawer)
- Property editing forms (color pickers, sliders)
- Loading states and overlays
