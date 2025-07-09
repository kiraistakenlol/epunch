# Design Mockups System

A comprehensive design prototyping system for the E-Punch user app that provides a scrollable canvas for showcasing different design variants with realistic mobile Safari browser chrome.

## Design Process

Before implementing any design variants, review the design documentation:

- **[DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md)** - Core principles and standards for creating minimalistic prototypes
- **[DESIGN_TEMPLATE.md](./DESIGN_TEMPLATE.md)** - Template for documenting new design concepts

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
│   ├── [other shared components]  # Design-agnostic components
│   └── index.ts
├── designs/
│   ├── qr-first/               # QR-First design concept
│   │   ├── description.md      # Design specification
│   │   └── [implementation files when built]
│   ├── card-first/             # Card-First design concept
│   │   ├── description.md      # Design specification
│   │   └── [implementation files when built]
│   └── [other design concepts]
├── types.ts
├── DesignMockupsPage.tsx
├── DESIGN_GUIDELINES.md
├── DESIGN_TEMPLATE.md
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

2. **Shared Components** (`/components/`)
   - Reusable, design-agnostic components that can be used across multiple design variants
   - Components should not contain design-specific styling or logic
   - Follow the minimalistic design principles from DESIGN_GUIDELINES.md
   - Examples: BaseScreen, AppHeader, BottomNav, Card, etc.

3. **Design Implementations** (`/designs/[design-name]/`)
   - Each design concept starts with a `description.md` file following the DESIGN_TEMPLATE.md
   - Implementation files are added when the design is built (screens/, components/, etc.)
   - All design-specific styling and behavior contained within the design directory

4. **Legacy Variant Components** (`/variants/[variant-name]/`)
   - Existing variant implementations (maintained for backward compatibility)
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

## Creating New Designs

### Design Process
1. **Create design concept**: Start with `/designs/new-design-name/`
2. **Write design specification**: Create `description.md` using `DESIGN_TEMPLATE.md`
3. **Follow design guidelines**: Ensure alignment with `DESIGN_GUIDELINES.md` principles
4. **Plan implementation**: Define screens and components needed
5. **Build implementation**: Create screen components and design-specific logic
6. **Update main page**: Add design to `DesignMockupsPage.tsx`

### Design Directory Structure
```
designs/new-design-name/
├── description.md              # Design specification (required)
├── screens/                    # Screen components (when implemented)
│   ├── HomeScreen.tsx
│   ├── CardsScreen.tsx
│   └── ...
├── components/                 # Design-specific components (if needed)
│   └── CustomComponent.tsx
└── index.ts                   # Design export (when implemented)
```

### Implementation Structure
```typescript
// designs/new-design-name/index.ts
export const newDesign: DesignVariant = {
  id: 'new-design-name',
  name: 'New Design Name',
  description: 'Brief description from design specification',
  screens: [
    { id: 'home', name: 'Home', component: HomeScreen },
    { id: 'cards', name: 'Cards', component: CardsScreen }
  ]
};
```

## Best Practices

1. **Follow Design Guidelines**: Adhere to principles in `DESIGN_GUIDELINES.md` for minimalistic prototypes
2. **Component Reusability**: Keep shared components in `/components/` design-agnostic
3. **Design Isolation**: All design-specific code should be contained within `/designs/[design-name]/`
4. **Documentation First**: Start with `description.md` using `DESIGN_TEMPLATE.md` before implementing
5. **Consistent Typing**: Use TypeScript interfaces from `types.ts`
6. **Mobile-First**: Design for mobile web experience, not native app
7. **Safari Accuracy**: Maintain realistic Safari browser chrome appearance
8. **Performance**: Optimize for smooth scrolling and interactions
9. **Minimalistic Focus**: Prioritize core user experience over complex features

## Development

The system provides a comprehensive design gallery that can be scrolled in all directions to explore different design approaches. Currently, the system includes:

### Current Design Concepts
- **QR-First Design** (`/designs/qr-first/`) - Maintains QR code prominence with enhanced card management
- **Card-First Design** (`/designs/card-first/`) - Prioritizes card discovery with contextual QR access

### Implementation Status
- Design specifications are complete in each design's `description.md`
- Implementation files will be added as designs are built
- Each implemented design will be displayed in its own Safari phone frame
- Legacy variants in `/variants/` are maintained for backward compatibility

### Shared Components
The `/components/` directory contains reusable components that follow the minimalistic design principles and can be used across multiple design implementations. These components are designed to be flexible and design-agnostic.
