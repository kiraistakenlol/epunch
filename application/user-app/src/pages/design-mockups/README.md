# Design Mockups System

A comprehensive design prototyping system for the E-Punch user app that provides a scrollable canvas for showcasing different design variants with realistic mobile Safari browser chrome.

## Architecture

The system is built with a clear separation of concerns:

### Directory Structure
```
design-mockups/
├── components/
│   ├── base-safari-view/       # Safari browser chrome components
│   │   ├── IOSStatusBar.tsx/.css
│   │   ├── SafariToolbar.tsx/.css
│   │   ├── SafariBottomBar.tsx/.css
│   │   ├── SafariPhoneFrame.tsx/.css
│   │   └── index.ts
│   ├── [other design-agnostic components]
│   └── index.ts
├── variants/
│   ├── card-first/             # Card-focused design variant
│   │   ├── screens/
│   │   └── index.ts
│   └── [other variants]
├── types.ts
├── DesignMockupsPage.tsx
└── README.md
```

### Component Categories

1. **Base Safari View Components** (`/components/base-safari-view/`)
   - **IOSStatusBar**: iOS status bar with time, battery, and signal indicators
   - **SafariToolbar**: Two-row Safari navigation structure:
     - *Navigation Row*: Back/forward buttons, share button, bookmark/tabs
     - *Address Bar Row*: Lock icon, URL display, reload button
   - **SafariBottomBar**: Safari bottom navigation with tabs and bookmarks
   - **SafariPhoneFrame**: Complete iPhone mockup with all Safari components

2. **Design-Agnostic Components** (`/components/`)
   - Base components that can be used across multiple design variants
   - Components should not contain design-specific styling or logic
   - Examples: BaseScreen, AppHeader, BottomNav, Card, etc.

3. **Variant-Specific Components** (`/variants/[variant-name]/`)
   - All design-specific styling and behavior
   - Screen implementations using base components
   - Variant configuration and exports

## Safari Browser Chrome

The Safari browser chrome provides a realistic mobile web experience with:

### Two-Row Layout Structure
- **Navigation Row**: Primary navigation controls
  - Left: Back/Forward buttons
  - Center: Share button
  - Right: Bookmark and Tabs buttons
- **Address Bar Row**: URL and security information
  - Lock icon (security indicator)
  - URL display (customizable)
  - Reload button

### Component Usage
```tsx
// Individual components
<IOSStatusBar time="9:41" />
<SafariToolbar url="epunch.app" canGoBack={true} />
<SafariBottomBar />

// Complete phone frame
<SafariPhoneFrame url="epunch.app" time="9:41">
  <YourContent />
</SafariPhoneFrame>
```

### Customization Options
- **URL**: Display custom URL in address bar
- **Time**: Set custom time in status bar
- **Navigation State**: Control back/forward button states
- **Responsive**: Adapts to different screen sizes

## Creating New Variants

1. **Create variant directory**: `/variants/new-variant/`
2. **Implement screens**: Create screen components in `/variants/new-variant/screens/`
3. **Export variant**: Create `/variants/new-variant/index.ts` with variant definition
4. **Update main page**: Add variant to `DesignMockupsPage.tsx`

### Variant Structure
```typescript
// variants/new-variant/index.ts
export const newVariant: DesignVariant = {
  id: 'new-variant',
  name: 'New Variant',
  description: 'Description of the new design variant',
  screens: [
    { id: 'screen1', name: 'Screen 1', component: Screen1Component },
    { id: 'screen2', name: 'Screen 2', component: Screen2Component }
  ]
};
```

## Best Practices

1. **Component Reusability**: Keep base components design-agnostic
2. **Variant Isolation**: All design-specific code should be in variant directories
3. **Consistent Typing**: Use TypeScript interfaces from `types.ts`
4. **Mobile-First**: Design for mobile web experience, not native app
5. **Safari Accuracy**: Maintain realistic Safari browser chrome appearance
6. **Performance**: Optimize for smooth scrolling and interactions

## Development

The system automatically displays all variants without selection controls, providing a comprehensive design gallery that can be scrolled in all directions to explore different design approaches.

Each variant is displayed in its own Safari phone frame, making it easy to compare different design approaches side by side while maintaining the realistic mobile web context.
