# PunchCard Component

A modern, minimalistic punch card component that simulates a physical loyalty punch card with configurable slots.

## Features

- ✅ **1.25 Aspect Ratio** - Maintains proper proportions like physical punch cards
- ✅ **Responsive Design** - Uses modern CSS techniques without media queries
- ✅ **Minimalistic Styling** - Black and white design matching app aesthetic
- ✅ **Flexible Layout** - Supports 1-10 punch slots with intelligent grid arrangement
- ✅ **Multiple Variants** - Default, completed, and minimal styles
- ✅ **Container-Responsive** - Uses CSS Container Queries for modern responsive design
- ✅ **Accessibility** - High contrast mode support and focus states
- ✅ **Scalable** - All internal elements scale with container size using `clamp()`

## Basic Usage

```tsx
import { PunchCard } from '@/components';

<PunchCard
  totalSlots={10}
  punchedSlots={6}
  title="Daily Grind Coffee"
  subtitle="Buy 10, Get 1 Free"
/>
```

## Advanced Usage with Variants

```tsx
// Completed card
<PunchCard
  totalSlots={8}
  punchedSlots={8}
  title="Bella Vista Pizza"
  subtitle="Reward Ready!"
  variant="completed"
/>

// Minimal card without footer
<PunchCard
  totalSlots={6}
  punchedSlots={3}
  title="Green Smoothie Co"
  variant="minimal"
/>
```

## Variants

### Default
- Standard styling with header and footer
- Progress indicator showing "punched/total"
- Clean borders and spacing

### Completed
- Enhanced border styling (thicker, bold)
- Different background color
- Emphasizes completion state

### Minimal
- Reduced padding and spacing
- No footer/progress indicator
- Compact design for space-constrained areas

## Responsive Grid Layout

The component automatically adjusts its punch slot layout based on container size:

- **Small containers (≤200px)**: 2 rows × 5 columns
- **Medium containers (201-400px)**: 2 rows × 5 columns  
- **Large containers (≥401px)**: 1 row × 10 columns

## Integration Examples

### In a Card Grid
```tsx
<div className="cards-grid">
  <PunchCard
    totalSlots={10}
    punchedSlots={7}
    title="Coffee Shop"
    subtitle="3 more for free coffee"
  />
  <PunchCard
    totalSlots={8}
    punchedSlots={8}
    title="Pizza Place"
    subtitle="Free pizza ready!"
    variant="completed"
  />
</div>
```

### With Dynamic Data
```tsx
const cardData = {
  id: '1',
  shopName: 'Daily Grind Coffee',
  currentPunches: 6,
  totalPunches: 10,
  rewardText: 'Free Coffee'
};

<PunchCard
  totalSlots={cardData.totalPunches}
  punchedSlots={cardData.currentPunches}
  title={cardData.shopName}
  subtitle={cardData.rewardText}
  variant={cardData.currentPunches === cardData.totalPunches ? 'completed' : 'default'}
/>
```

## Container Sizing

The component is designed to be height-controlled by its parent:

```css
.punch-card-container {
  height: 200px; /* Sets card height */
  width: 100%;   /* Card maintains 1.25 aspect ratio */
}
```

## Styling

The component uses modern CSS features:

- **CSS Custom Properties** via `clamp()` for responsive scaling
- **CSS Grid** for flexible punch slot layouts
- **Container Queries** for modern responsive design
- **Aspect Ratio** for consistent proportions

```css
.punch-card {
  aspect-ratio: 1.25;
  height: 100%;
  width: 100%;
}

.punch-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(20px, 4vw, 30px), 1fr));
}
```

## Accessibility

- **High Contrast Mode** support with enhanced borders
- **Focus States** for keyboard navigation
- **Scalable Typography** using `clamp()` for readability
- **Semantic HTML** structure

## Props Reference

### PunchCardProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `totalSlots` | `number` | `10` | Total number of punch slots |
| `punchedSlots` | `number` | `0` | Number of completed punches |
| `title` | `string` | - | Optional card title (shop name) |
| `subtitle` | `string` | - | Optional subtitle (reward description) |
| `variant` | `'default' \| 'completed' \| 'minimal'` | `'default'` | Visual variant |
| `className` | `string` | `''` | Additional CSS classes |

## Design Principles

1. **Physical Metaphor** - Mimics real punch cards with circular slots
2. **Minimalistic** - Clean black and white design
3. **Responsive** - Works across all container sizes without media queries
4. **Scalable** - All elements scale proportionally with container
5. **Accessible** - Supports various accessibility needs

## Browser Support

- **Container Queries** - Modern browsers (Chrome 105+, Firefox 110+, Safari 16+)
- **CSS Grid** - All modern browsers
- **CSS `clamp()`** - All modern browsers  
- **`aspect-ratio`** - All modern browsers

For older browsers, the component gracefully degrades to flexbox layout. 