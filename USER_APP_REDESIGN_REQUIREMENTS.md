# E-PUNCH User App Redesign Requirements

## 🎯 Current State Analysis

### What Works
- QR code is prominent and easily accessible
- Real-time updates via WebSocket
- Punch card animations provide good feedback
- Authentication is optional (anonymous users supported)

### Pain Points
- QR code takes ~50% of screen space (good accessibility vs. screen real estate)
- Single dashboard screen limits feature discovery
- No easy way to find specific shop cards (search/filter)
- Completed cards stay in main view (clutter)
- No reward history or activity tracking
- Limited merchant discovery capabilities
- No shop information display

## 📋 Feature Requirements

### Core Features
- **Authentication**
  - Sign in/up (optional)
  - Anonymous user support
  - Google OAuth + Email/Password

- **QR Code Management**
  - Personal QR code display
  - Context-aware QR (user ID vs reward redemption)
  - Quick access to QR code

- **Punch Card Management**
  - View all active cards
  - Search/filter cards by shop name
  - Card progress tracking
  - Real-time punch updates

- **Reward System**
  - View available rewards
  - Reward redemption flow
  - Reward history tracking
  - Completed card management

- **Activity & History**
  - Punch history across all businesses
  - Activity filtering by merchant
  - Personal statistics
  - Progress insights

- **Discovery & Information**
  - Shop information display
  - Merchant discovery (future: map integration)
  - Recommendations ("1 punch left for free coffee")

### Technical Requirements
- Real-time WebSocket updates
- Offline capability consideration
- Mobile-first responsive design
- Progressive Web App features

## 🗂️ Proposed Information Architecture

### 1. Main Dashboard
**Primary Focus:** Active cards + Quick QR access
- Featured/priority cards
- QR code (on-demand or persistent)
- Quick stats overview
- Recent activity

### 2. My Cards
**Primary Focus:** Card management and progress
- All active cards (searchable/filterable)
- Card progress visualization
- Shop information integration
- Quick punch card access

### 3. Rewards
**Primary Focus:** Available rewards and redemption
- Available rewards (ready to claim)
- Reward redemption flow
- Reward history
- Completed cards archive

### 4. Activity
**Primary Focus:** History and insights
- Punch history (all merchants)
- Filtering by merchant/date
- Personal statistics
- Progress insights and recommendations

### 5. Discover (Future)
**Primary Focus:** Merchant discovery
- Map integration
- Nearby merchants
- New merchant onboarding
- Recommendations

## 🎨 Design Considerations

### Layout Options for QR Code
1. **Always Visible:** Keep QR prominent (current approach)
2. **On-Demand Modal:** Show QR via floating button/modal
3. **Dedicated QR Tab:** Separate screen for QR code
4. **Context-Aware:** Show QR based on user context (at merchant, reward ready)

### Card Display Patterns
1. **Horizontal Scroll:** Current approach (good for browsing)
2. **Grid Layout:** Better space utilization for many cards
3. **List View:** Searchable, detailed information
4. **Stacked/Wallet:** iOS wallet-style interface

### Navigation Patterns
1. **Bottom Tab Bar:** 4-5 main sections
2. **Drawer Navigation:** Expandable side menu
3. **Hybrid:** Bottom tabs + drawer for secondary features

## 🔄 Key User Flows

### Primary Flow: Getting a Punch
1. User visits merchant
2. Opens app → QR code visible/accessible
3. Merchant scans QR
4. Real-time update shows new punch
5. Animation feedback + progress update

### Secondary Flow: Reward Redemption
1. Card completion notification
2. User navigates to reward details
3. QR code switches to redemption mode
4. Merchant scans + redeems
5. Card archives to history

### Discovery Flow: Finding Shop Cards
1. User has many cards (50+)
2. Search/filter by shop name
3. Quick access to specific card
4. View shop information

## 📱 Screen Breakdown

### Main Dashboard
```
- Header: User stats, notifications
- Hero Section: Featured card OR QR code
- Quick Actions: Scan QR, View Rewards, etc.
- Recent Activity: Last 3-5 punches
- Navigation: Bottom tabs
```

### My Cards
```
- Header: Search/filter controls
- Card List: All active cards
- Card Details: Progress, shop info, actions
- Quick Actions: Show QR, Mark favorite
```

### Rewards
```
- Available Rewards: Ready to claim
- Reward Details: Description, redemption flow
- History: Previously claimed rewards
- Archive: Completed cards
```

### Activity
```
- Filter Controls: Date, merchant, type
- Activity Feed: Punches, rewards, milestones
- Statistics: Charts, progress insights
- Recommendations: Suggested actions
```

## 🎯 Success Metrics

### User Engagement
- Time spent in app
- Cards per user
- Reward redemption rate
- Return visit frequency

### Usability
- QR code access time
- Card discovery efficiency
- Reward redemption completion rate
- Feature adoption rate

## 🚀 Implementation Priority

### Phase 1: Core Redesign
- New navigation structure
- Card management improvements
- QR code optimization
- Reward flow enhancement

### Phase 2: Enhanced Features
- Activity tracking
- Statistics and insights
- Advanced search/filtering
- Merchant information

### Phase 3: Discovery Features
- Map integration
- Merchant discovery
- Recommendations engine
- Social features

## 💭 Open Questions for Brainstorming

1. **QR Code Strategy**: Always visible vs. on-demand access?
2. **Card Overload**: How to handle users with 50+ cards?
3. **Reward Notifications**: Push vs. in-app vs. both?
4. **Onboarding**: How to guide new users through features?
5. **Offline Support**: What works without internet?
6. **Social Features**: Share achievements, refer friends?
7. **Merchant Integration**: How much merchant info to show?
8. **Progressive Enhancement**: Which features for power users?

---

*This document serves as the foundation for UI brainstorming sessions and design iterations.* 