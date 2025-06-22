# Color Consolidation Plan

## Overview
This plan outlines the steps to replace ALL color variables in merchant-app with epunch color variables from common-ui, using a minimal set of three colors: mint (primary), white, and black.

## Files Affected

### Direct Color Imports (TS/TSX files)
Files that need to be updated to use appColors directly:

1. components/shared/
   - AppHeader.tsx: `colors.primary` -> `appColors.epunchMint`
   - AppLayout.tsx
   - AppSidebar.tsx
   - ProfileMenu.tsx

2. components/foundational/
   - inputs/EpunchColorPicker.tsx
   - inputs/EpunchSwitch.tsx
   - layout/EpunchCard.tsx
   - layout/EpunchPage.tsx

3. pages/dashboard/
   - LoyaltyProgramsOverview.tsx
   - QrCodeScannerOverview.tsx

4. pages/design/components/
   - PunchCardPreview.tsx

### CSS Files to Update
Replace all --color-* with --color-epunch-*:

1. pages/login/
   - LoginPage.module.css: `--color-primary` -> `--color-epunch-mint`

2. pages/design/components/
   - ColorEditor/ColorEditorModal.module.css
   - DesignLoadingState/DesignLoadingState.module.css
   - StylePreviewSection/StylePreviewSection.module.css
   - StyleSummaryCard/*.module.css
   - QuickActionsGrid/QuickActionsGrid.module.css

3. pages/scanner/components/
   - QRScanner.module.css
   - scan-result/customer-qr/CustomerScanResult.css
   - scan-result/punch-card-qr/ScanResultPunchCard.css
   - scan-result/ScanResultCard.css

## Color Mapping

```typescript
// Old -> New mapping
{
  // Primary colors
  primary: 'epunchMint',
  primaryLight: 'epunchWhite',
  primaryDark: 'epunchMint',
  secondary: 'epunchMint',
  secondaryLight: 'epunchWhite',
  secondaryDark: 'epunchMint',

  // Text colors
  'text.primary': 'epunchBlack',
  'text.secondary': 'epunchBlack',
  'text.light': 'epunchWhite',
  'text.disabled': 'epunchBlack',

  // Background colors
  'background.default': 'epunchWhite',
  'background.paper': 'epunchWhite',
  'background.variant': 'epunchMint',

  // Border colors
  'border.default': 'epunchBlack',
  'border.divider': 'epunchBlack',
  'border.focus': 'epunchMint',
  'border.input': 'epunchBlack',

  // Status colors (using primary colors)
  success: 'epunchMint',
  error: 'epunchMint',
  warning: 'epunchMint',
}
```

## Implementation Steps

1. Update css-variables.ts
   ```typescript
   import { appColors } from 'e-punch-common-ui';
   import { spacing, borderRadius, shadows, typography, animation } from '../theme/constants';
   
   export const injectCSSVariables = () => {
     const root = document.documentElement;
     
     // Inject epunch colors
     root.style.setProperty('--color-epunch-mint', appColors.epunchMint);
     root.style.setProperty('--color-epunch-white', appColors.epunchWhite);
     root.style.setProperty('--color-epunch-black', appColors.epunchBlack);
     
     // Special colors that don't have epunch equivalents
     root.style.setProperty('--color-epunch-overlay', 'rgba(0, 0, 0, 0.5)');
     root.style.setProperty('--color-epunch-hover', 'rgba(215, 249, 244, 0.1)'); // mint with opacity
     root.style.setProperty('--color-epunch-selected', 'rgba(215, 249, 244, 0.2)');
     root.style.setProperty('--color-epunch-selected-active', 'rgba(215, 249, 244, 0.3)');
     
     // Keep other non-color variables
     root.style.setProperty('--spacing-xs', `${spacing.xs}px`);
     // ... other non-color variables
   };
   ```

2. Update all CSS files
   ```bash
   # Create a script to replace color variables
   find application/merchant-app/src -name "*.css" -type f -exec sed -i '' \
     -e 's/--color-primary/--color-epunch-mint/g' \
     -e 's/--color-primary-light/--color-epunch-white/g' \
     -e 's/--color-primary-dark/--color-epunch-mint/g' \
     -e 's/--color-secondary/--color-epunch-mint/g' \
     -e 's/--color-secondary-light/--color-epunch-white/g' \
     -e 's/--color-secondary-dark/--color-epunch-mint/g' \
     -e 's/--color-background-default/--color-epunch-white/g' \
     -e 's/--color-background-paper/--color-epunch-white/g' \
     -e 's/--color-background-variant/--color-epunch-mint/g' \
     -e 's/--color-text-primary/--color-epunch-black/g' \
     -e 's/--color-text-secondary/--color-epunch-black/g' \
     -e 's/--color-text-light/--color-epunch-white/g' \
     -e 's/--color-text-disabled/--color-epunch-black/g' \
     -e 's/--color-success/--color-epunch-mint/g' \
     -e 's/--color-error/--color-epunch-mint/g' \
     -e 's/--color-warning/--color-epunch-mint/g' \
     -e 's/--color-border-default/--color-epunch-black/g' \
     -e 's/--color-border-divider/--color-epunch-black/g' \
     -e 's/--color-border-focus/--color-epunch-mint/g' \
     {} +
   ```

3. Update all TypeScript/TSX files
   ```typescript
   // Before
   import { colors } from '../../theme';
   backgroundColor: colors.primary
   
   // After
   import { appColors } from 'e-punch-common-ui';
   backgroundColor: appColors.epunchMint
   ```

## Verification Steps

1. Run build to find broken references
   ```bash
   cd application/merchant-app
   yarn build
   ```

2. Visual Testing
   - Test each component that uses colors
   - Verify color scheme consistency
   - Check all states (hover, active, disabled)

3. Browser Testing
   - Test in different browsers
   - Check color consistency across devices

## Success Criteria

1. No --color-* variables remain in the codebase (except --color-epunch-*)
2. Only epunchMint, epunchWhite, and epunchBlack are used from appColors
3. All colors come directly from appColors
4. Build passes without errors
5. Visual appearance is consistent with the new minimal color scheme

## Future Improvements (Optional)

Later, we can gradually:
1. Update components to use epunch color variables directly
2. Remove the color re-exports from constants.ts
3. Update CSS to use epunch color variables

But these can be done as separate tasks since the colors will already be sourced from common-ui. 