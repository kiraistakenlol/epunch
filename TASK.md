# TASK: Refactor Punch Card Hierarchy with Named Container Queries

## Problem
Current punch card scaling system uses a single containment context with CSS custom properties. Components must guess font sizes relative to the entire card height instead of scaling relative to their own logical container (e.g., shop name should scale to header size, not entire card).

## GOAL
Implement nested named container system where each component becomes its own container with a specific name, enabling component-specific scaling (e.g., `font-size: 15cqh(header)` for shop name, `padding: 2cqh(body)` for punch sections).

## Target
```
application/user-app/src/features/dashboard/punch-cards/punch-card/
├── PunchCardItem.module.css
├── PunchCardOverlay.module.css
├── front/
│   ├── PunchCardFront.module.css
│   ├── header/
│   │   └── PunchCardFrontHeader.module.css
│   ├── body/
│   │   ├── PunchCardFrontBody.module.css
│   │   ├── PunchCardFrontBodyPunchesSection.module.css
│   │   └── PunchIconCircle.module.css
│   └── footer/
│       └── PunchCardFrontFooter.module.css
└── back/
    └── PunchCardBack.module.css
```

## Plan
1. Explore [Target] - analyze current CSS variable usage across all 9 CSS files
2. Create step-by-step executable plan for named container implementation
3. Ask for review
4. Execute implementation

### Implementation Strategy
- Create nested named containers:
  - `container-name: punch-card` (PunchCardItem - root)
  - `container-name: header` (PunchCardFrontHeader)
  - `container-name: body` (PunchCardFrontBody)  
  - `container-name: punches-section` (PunchCardFrontBodyPunchesSection)
  - `container-name: footer` (PunchCardFrontFooter)
  - `container-name: back` (PunchCardBack)
- Replace CSS variables with component-specific container queries:
  - Shop name: `font-size: 15cqh(header)` instead of `var(--font-xl)`
  - Body padding: `padding: 2cqh(body)` instead of `var(--space-md)`
  - Punch icons: `width: 8cqh(punches-section)` instead of guessing card proportions
- Maintain identical visual appearance
- Test cross-browser compatibility (Chrome 105+, Safari 16.0+, Firefox 110+) 