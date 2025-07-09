# Design Template: QR-First Design

## Design Concept
**Core Philosophy**: Minimalistic design focused on primary user experience
**Primary Goal**: Maintain QR code accessibility while improving card discovery and management
**Key Principle**: QR code remains prominent for quick merchant interactions, with enhanced card browsing below

## Navigation Structure
**Type**: Bottom tabs with floating QR button
**Primary Sections**: Home, My Cards, Rewards, Activity
**Focus**: Home section gets primary emphasis with persistent QR access

## QR Code Strategy
**Placement**: Always visible via floating action button
**Access Method**: Persistent FAB (floating action button) that expands to show QR code
**Context Behavior**: QR switches between user ID and reward redemption based on card completion status

## Punch Card Design
**Display**: Full-size, minimalistic physical card aesthetic
**Progress**: Visual punch holes with clear "6/8 filled" indicators
**Branding**: Subtle merchant colors and custom punch icons (coffee cups, stars, etc.)
**Layout**: Horizontal scroll carousel with snap-to-card behavior

## Primary Screens

### Home Dashboard
**Purpose**: Quick access to QR code and featured cards
**Key Elements**: 
- Floating QR button (always accessible)
- Featured/priority cards carousel
- Quick stats overview
- Recent activity feed
- Search bar for card discovery
**Layout**: Vertical stack with horizontal card carousel as hero section

### My Cards
**Purpose**: Complete card management and browsing
**Key Elements**:
- Search and filter controls
- Full-size card grid (2 columns on mobile)
- Card sorting options (recent, alphabetical, completion status)
- Shop information integration
- Quick actions per card
**Layout**: Searchable grid with full-size card previews

### Rewards
**Purpose**: Available rewards and redemption management
**Key Elements**:
- Available rewards (ready to claim)
- Reward redemption flow integration
- Completed cards archive
- Reward history timeline
- Redemption statistics
**Layout**: Categorized lists with clear call-to-action buttons

### Activity
**Purpose**: History tracking and personal insights
**Key Elements**:
- Punch history feed with merchant filtering
- Personal statistics dashboard
- Progress insights and recommendations
- Achievement milestones
- Monthly/weekly activity charts
**Layout**: Feed-based with filtering controls and stats cards

## Design Decisions
**Key Trade-off**: Maintained QR prominence over screen real estate for improved merchant interaction speed
**User Flow Priority**: Merchant scanning gets optimal treatment with persistent QR access
**Content Hierarchy**: QR accessibility > Active cards > Rewards > History

## Implementation Notes
**Screens to Build**: 
- HomeDashboard.tsx
- MyCardsGrid.tsx
- RewardsManagement.tsx
- ActivityFeed.tsx
- FloatingQRButton.tsx (shared component)
**Key Components**: 
- FloatingActionButton for QR
- PunchCardCarousel for horizontal scrolling
- CardGrid for My Cards section
- ActivityTimeline for history
**Data Requirements**: 
- Active cards with progress data
- User QR code state
- Reward availability status
- Activity history with timestamps
- Merchant information for each card

## Success Metrics
**Primary KPI**: QR code access time (should remain under 2 seconds)
**User Behavior Goal**: Increased card discovery and reward redemption while maintaining fast merchant interactions 