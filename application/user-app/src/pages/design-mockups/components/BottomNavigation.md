# BottomNavigation Component

A modern, flexible bottom navigation component extracted for reusability across the application.

## Features

- ✅ **Lucide React Icons** - Uses react-icons instead of emoji
- ✅ **Black & White Design** - Minimalistic monochromatic styling  
- ✅ **Multiple Variants** - Default, minimal, and compact styles
- ✅ **Badge Support** - Show notification counts or indicators
- ✅ **Click Handlers** - Proper event handling with callbacks
- ✅ **Accessibility** - ARIA labels and keyboard navigation
- ✅ **Responsive** - Mobile-optimized with different breakpoints
- ✅ **Disabled States** - Support for disabled navigation items

## Basic Usage

```tsx
import { BottomNavigation } from '@/components';

const navigationItems = [
  { id: 'wallet', icon: 'wallet', label: 'Wallet' },
  { id: 'history', icon: 'history', label: 'History' },
  { id: 'account', icon: 'user', label: 'Account' }
];

<BottomNavigation
  items={navigationItems}
  activeItemId="wallet"
  onItemClick={(itemId) => console.log('Clicked:', itemId)}
/>
```

## Advanced Usage with Badges

```tsx
const navigationWithBadges = [
  { 
    id: 'wallet', 
    icon: 'wallet', 
    label: 'Wallet',
    badge: 3 // Shows notification count
  },
  { 
    id: 'history', 
    icon: 'history', 
    label: 'History' 
  },
  { 
    id: 'account', 
    icon: 'user', 
    label: 'Account',
    badge: '!', // Shows alert indicator
    disabled: false
  }
];

<BottomNavigation
  items={navigationWithBadges}
  activeItemId="wallet"
  onItemClick={handleNavigation}
  variant="compact"
  className="custom-navigation"
/>
```

## Variants

### Default
- Standard padding and sizing
- Full height navigation items
- Best for most use cases

### Minimal  
- Reduced padding and border styling
- Smaller height for space-constrained layouts
- Lighter visual weight

### Compact
- Medium sizing between default and minimal
- Good balance of space efficiency and usability

## Custom Icons

```tsx
import { CustomIcon } from 'lucide-react';

const customItems = [
  { 
    id: 'custom', 
    icon: <CustomIcon size={20} strokeWidth={2} />, 
    label: 'Custom' 
  }
];
```

## Integration with BaseScreen

The component is automatically integrated with `BaseScreen` via `BottomNavigationAdapter`:

```tsx
<BaseScreen
  bottomNavProps={{
    items: navigationItems,
    activeItemId: 'wallet',
    onItemClick: handleNavClick,
    variant: 'default'
  }}
>
  {/* Screen content */}
</BaseScreen>
```

## Styling

The component uses CSS custom properties and BEM methodology:

```css
.bottom-navigation {
  /* Base styles */
}

.bottom-navigation--minimal {
  /* Minimal variant */
}

.bottom-navigation__item--active {
  /* Active state */
}
```

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus indicators for keyboard users

## Migration from Old BottomNav

The new component is backward compatible through the `BottomNavigationAdapter`. Existing code will continue to work without changes, but gains the new features automatically.

## Props Reference

### BottomNavigationProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BottomNavigationItem[]` | - | Array of navigation items |
| `activeItemId` | `string` | - | ID of currently active item |
| `onItemClick` | `(itemId: string) => void` | - | Click handler callback |
| `variant` | `'default' \| 'minimal' \| 'compact'` | `'default'` | Visual variant |
| `className` | `string` | `''` | Additional CSS classes |

### BottomNavigationItem

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier |
| `icon` | `string \| React.ReactNode` | Icon (string maps to Lucide icons) |
| `label` | `string` | Display text |
| `badge` | `number \| string` | Optional badge content |
| `disabled` | `boolean` | Whether item is disabled | 