# Design Template: Card-First Design

## Design Concept
**Core Philosophy**: Minimalistic design focused on primary user experience
**Primary Goal**: Optimize card discovery and management for users with multiple active cards
**Key Principle**: Punch cards take center stage with wallet-like interface, QR code accessed contextually when needed

## Navigation Structure
**Type**: Bottom tabs with contextual QR access
**Primary Sections**: Cards, Rewards, Activity, Profile
**Focus**: Cards section gets primary emphasis with full-screen card management

## QR Code Strategy
**Placement**: Contextual - appears when relevant (at merchant, reward ready)
**Access Method**: Header button that slides down QR modal + smart contextual triggers
**Context Behavior**: QR automatically suggests itself based on location/card status, switches between user ID and reward redemption

## Punch Card Design
**Display**: Full-size, minimalistic physical card aesthetic with wallet-style stacking
**Progress**: Visual punch holes with prominent "6/8 filled" progress bars
**Branding**: Subtle merchant colors, custom punch icons, and clean typography
**Layout**: Stacked wallet interface with searchable card browser

## Primary Screens

### Cards (Primary)
**Purpose**: Complete card management and browsing experience
**Key Elements**:
- Wallet-style stacked cards interface
- Quick search and filter bar
- Card sorting (recent activity, alphabetical, completion status)
- Full-size card previews with swipe gestures
- Smart QR suggestions based on context
**Layout**: Wallet-style stacked interface with search controls and category filters

### Rewards
**Purpose**: Reward discovery and redemption management
**Key Elements**:
- Available rewards grid with progress indicators
- "Almost there" section (1-2 punches remaining)
- Reward redemption flow with QR integration
- Completed rewards archive
- Reward timeline and statistics
**Layout**: Grid-based with progress indicators and clear redemption calls-to-action

### Activity
**Purpose**: Comprehensive history and insights
**Key Elements**:
- Activity timeline with merchant filtering
- Personal statistics and achievement tracking
- Progress insights and recommendations
- Monthly summary cards
- Merchant relationship tracking
**Layout**: Timeline-based with filtering and stats dashboard

### Profile
**Purpose**: User management and app settings
**Key Elements**:
- User statistics overview
- App preferences and settings
- QR code access (backup method)
- Account management
- Help and support
**Layout**: Settings-style list with user stats header

## Design Decisions
**Key Trade-off**: Sacrificed persistent QR visibility for enhanced card management and discovery
**User Flow Priority**: Card browsing and management gets optimal treatment with contextual QR access
**Content Hierarchy**: Card discovery > Reward status > Activity insights > QR access

## Implementation Notes
**Screens to Build**:
- CardsWalletInterface.tsx
- RewardsGrid.tsx
- ActivityTimeline.tsx
- ProfileSettings.tsx
- ContextualQRModal.tsx (shared component)
**Key Components**:
- StackedCardWallet for card browsing
- SearchableCardGrid for filtering
- ContextualQRTrigger for smart QR suggestions
- ProgressIndicator for reward status
- ActivityFeed for history
**Data Requirements**:
- Complete card collection with metadata
- Search and filter indexing
- User location data for contextual QR
- Reward completion status
- Activity history with rich merchant data
- User preferences and settings

## Success Metrics
**Primary KPI**: Card discovery efficiency (time to find specific card)
**User Behavior Goal**: Increased card engagement and reward redemption through better card management 