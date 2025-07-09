# Design Guidelines for Mockups System

## Purpose
These guidelines establish the foundation for creating **minimalistic prototypes** within the Design Mockups system. The goal is to showcase primary user experience concepts, not full-scale production designs.

## Core Principles

### Minimalistic Prototypes
- **Focus**: Primary user experience and core functionality only
- **Scope**: Essential UI blocks and navigation patterns
- **Detail Level**: Simplified mockups that demonstrate concepts, not pixel-perfect designs
- **Content**: Use placeholder content and representative data

### Visual Design Standards

#### Color Scheme
- **Primary**: Pure black (#000000) and white (#ffffff)
- **Accent**: Single gray tone (#666666) for secondary text only
- **No Colors**: Absolutely no blue, green, red, or any colors
- **Backgrounds**: Pure white backgrounds with black borders/dividers
- **Contrast**: High contrast for bold, minimalistic appearance

#### Icons & Graphics
- **Icons**: Use `react-icons` library exclusively (Feather or Lucide icons preferred)
- **No Emojis**: Completely eliminate emoji characters
- **Icon Style**: Consistent stroke-based icons, 2px stroke weight
- **Merchant Representations**: Simple geometric shapes or text initials
- **Icon Sizing**: Consistent 20px or 24px sizing

#### Typography
- **Hierarchy**: Clear size/weight distinctions
- **Simplicity**: Minimal font variations
- **Readability**: High contrast text on backgrounds

## Punch Card Mockups

### Physical Card Aesthetic
- **Style**: Clean, card-like appearance with subtle shadows
- **Progress**: Simple punch hole representations
- **Layout**: Grid-based punch hole arrangement
- **Branding**: Minimal merchant identity (logo/name only)

### Progress Indicators
- **Visual**: Clear distinction between filled/empty punches
- **Format**: "X/Y filled" or similar simple notation
- **Icons**: Use react-icons for punch representations
- **Animation**: Subtle, if any

### Card Variations
- **Colors**: Subtle background tints (within black/white scheme)
- **Shapes**: Simple geometric punch shapes
- **Merchant Identity**: Logo + name, minimal additional branding

## Component Usage

### Base Components
- Reuse existing base components when possible
- Create new components only when necessary
- Keep components simple and focused

### Layout Patterns
- **Grid**: Simple, clean grid arrangements
- **Lists**: Minimal list items with clear hierarchy
- **Cards**: Clean card containers with subtle shadows
- **Navigation**: Simple tab bars or minimal navigation

### Critical Layout Constraints
- **NO VERTICAL SCROLLING**: All content must fit within the mobile viewport
- **Fixed Navigation**: Bottom navigation must always be visible and accessible
- **Viewport Awareness**: Design for iPhone-sized screens (375px width, ~667px height)
- **Content Prioritization**: If content doesn't fit, redesign or create new screens
- **Fixed Heights**: Use fixed, calculated heights that work within viewport constraints

### Interactive Elements
- **Buttons**: Clear, simple button styles
- **Forms**: Minimal form elements
- **Feedback**: Subtle hover/active states

## Implementation Standards

### Code Quality
- **Clean Code**: Simple, readable component structure
- **Props**: Minimal prop interfaces
- **State**: Local state only where necessary
- **Styling**: CSS classes, avoid inline styles

### Data Requirements
- **Mock Data**: Use realistic but simplified data
- **Consistency**: Consistent data shapes across screens
- **Placeholder**: Clear placeholder content

### Screen Structure
- **Header**: Simple app header if needed
- **Content**: Focus on primary content area
- **Navigation**: Minimal navigation elements
- **Footer**: Avoid complex footers

## What to Avoid

### Over-Engineering
- Complex animations or transitions
- Detailed styling and theming
- Production-ready error handling
- Advanced state management

### Visual Complexity
- Multiple color schemes
- Complex gradients or effects
- Detailed illustrations
- Heavy use of imagery

### Feature Complexity
- Advanced user flows
- Complex form validations
- Detailed error states
- Production-level interactions

## Success Criteria

A good design mockup should:
- **Communicate Clearly**: Primary user experience is immediately understood
- **Stay Focused**: Shows essential functionality without distractions
- **Be Implementable**: Can be built quickly with existing components
- **Demonstrate Concept**: Proves the design approach works
- **Maintain Consistency**: Follows these guidelines throughout

---

*These guidelines ensure all design variants maintain consistency while focusing on their core purpose: demonstrating user experience concepts through minimalistic prototypes.* 