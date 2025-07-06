# Design Mockups System

A comprehensive prototyping system for E-Punch user app redesign with a focus on **visual punch cards** and **mobile-first web experience**.

## Architecture Overview

This system is structured to support rapid design iteration and comparison of different UX approaches:

```
design-mockups/
├── DesignMockupsPage.tsx        # Main canvas with scrollable layout
├── DesignMockupsPage.css        # Canvas styling with responsive grid
├── types.ts                     # Shared TypeScript definitions
├── components/                  # Design-agnostic base components
│   ├── index.ts                # Component exports
│   ├── PhoneFrame.tsx          # Mobile device frame
│   ├── StatusBar.tsx           # iOS-style status bar
│   ├── AppHeader.tsx           # App header with nav elements
│   ├── BottomNav.tsx           # Bottom navigation container
│   ├── NavItem.tsx             # Navigation item component
│   ├── Button.tsx              # Base button component
│   ├── Card.tsx                # Base card container
│   ├── ProgressBar.tsx         # Progress visualization
│   ├── ShopCard.tsx            # Punch card component
│   ├── SearchBar.tsx           # Search input component
│   └── FilterChips.tsx         # Filter chip component
└── variants/                   # Design-specific implementations
    └── card-first/             # Card-first design variant
        ├── index.ts            # Variant definition
        └── screens/            # Variant-specific screens
            ├── BaseScreen.tsx  # Shared screen layout
            ├── DashboardScreen.tsx
            ├── CardsScreen.tsx
            └── RewardsScreen.tsx
```

## Key Principles

### 1. **Mobile-First Web App**
- All components are designed for mobile browsers, not native apps
- Responsive design with touch-friendly interactions
- Modern web technologies (CSS Grid, Flexbox, etc.)

### 2. **Design-Agnostic Base Components**
- Located in `/components/` directory
- Contain only essential functionality and structure
- Minimal styling to allow variant customization
- Reusable across different design approaches

### 3. **Variant-Specific Implementations**
- Each design variant has its own directory in `/variants/`
- Contains only the specificities of that particular design
- Imports base components from the shared `/components/` directory
- Allows easy comparison of different UX approaches

### 4. **Scrollable Canvas Layout**
- Main page provides unlimited scrolling in all directions
- Multiple variants can be displayed simultaneously
- Responsive grid system for optimal viewing
- Sticky headers for easy navigation

## Usage

### Adding a New Design Variant

1. Create a new directory in `/variants/` (e.g., `/variants/qr-first/`)
2. Create an `index.ts` file with the variant definition:
   ```typescript
   import { DesignVariant } from '../../types';
   import DashboardScreen from './screens/DashboardScreen';
   
   export const qrFirstVariant: DesignVariant = {
     id: 'qr-first',
     name: 'QR-First Dashboard',
     description: 'QR code as the primary interface element',
     screens: [
       {
         id: 'dashboard',
         name: 'Dashboard',
         component: DashboardScreen
       }
     ]
   };
   ```
3. Create screens in `/variants/qr-first/screens/`
4. Import and add to the main variants array in `DesignMockupsPage.tsx`

### Creating Base Components

Base components should be:
- **Functionally complete** but **visually minimal**
- **Prop-driven** for maximum flexibility
- **Accessible** with proper ARIA attributes
- **Typed** with comprehensive TypeScript interfaces

Example base component:
```typescript
// components/PunchCard.tsx
import React from 'react';
import { PunchCardProps } from '../types';
import './PunchCard.css';

const PunchCard: React.FC<PunchCardProps> = ({ 
  shopName, 
  currentPunches, 
  totalPunches,
  onPunch,
  className = ''
}) => {
  return (
    <div className={`punch-card ${className}`}>
      <h3 className="punch-card-shop">{shopName}</h3>
      <div className="punch-card-progress">
        {currentPunches}/{totalPunches}
      </div>
      <button onClick={onPunch} className="punch-card-button">
        Add Punch
      </button>
    </div>
  );
};

export default PunchCard;
```

## Design Variants

### Card-First Dashboard
**Philosophy**: Visual punch cards as the hero feature with QR code on-demand
- **Dashboard**: Prominent display of reward-ready cards, then active cards
- **Cards**: Full card management with search and filtering
- **Rewards**: Clear separation between available and claimed rewards

## Best Practices

### Component Design
- Keep base components **presentation-focused**
- Use **CSS custom properties** for themeable values
- Implement **responsive design** with mobile-first approach
- Follow **accessibility guidelines** (WCAG 2.1)

### Screen Layout
- Use the provided `BaseScreen` component for consistent structure
- Implement **scroll-aware layouts** for long content
- Design for **thumb navigation** on mobile devices
- Consider **one-handed usage** patterns

### Styling
- Use **CSS Modules** or **scoped styles** to prevent conflicts
- Follow **mobile-first responsive design**
- Implement **consistent spacing** using CSS custom properties
- Use **semantic color names** rather than hex values

### Performance
- **Lazy load** screens not currently visible
- **Optimize images** for mobile displays
- **Minimize bundle size** through tree-shaking
- Use **efficient CSS** with minimal specificity

## Development Workflow

1. **Start with base components** - identify common UI patterns
2. **Create variant-specific screens** - implement the unique user experience
3. **Test on mobile devices** - ensure touch interactions work properly
4. **Compare variants** - use the scrollable canvas to evaluate different approaches
5. **Iterate rapidly** - leverage the modular structure for quick changes

## Mobile-First Considerations

Since this is a **mobile-first web app**, consider:
- **Touch target sizes** (minimum 44px)
- **Gesture interactions** (swipe, pinch, etc.)
- **Viewport handling** for various screen sizes
- **Performance on mobile networks**
- **Battery usage** optimization
- **Accessibility** on mobile screen readers

## Future Enhancements

- **Animation system** for smooth transitions
- **Gesture support** for card interactions
- **Offline functionality** for core features
- **Performance monitoring** for mobile optimization
- **A/B testing framework** for variant comparison
