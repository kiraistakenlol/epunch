# TASK: Implement Merchant Analytics MVP

## Problem
Merchants need basic analytics to understand their loyalty program performance and customer engagement. Currently, the merchant app has placeholder "Coming soon" cards with no actual analytics data.

## GOAL
Create a functional merchant analytics page with MVP metrics (customer engagement, program performance, business activity) using mock data first, then implement backend support.

## Target
- `application/common-core/src/dto/` - New analytics DTOs
- `application/merchant-app/src/features/analytics/` - New analytics page
- `application/merchant-app/src/app/routes.ts` - Analytics route
- `application/merchant-app/src/components/shared/layout/AppSidebar.tsx` - Analytics navigation

## Plan
1. **Explore** existing analytics patterns in admin app and merchant app structure
2. **Create** analytics DTOs in common-core for MVP metrics
3. **Design** analytics page layout with MVP metric cards and components
4. **Implement** analytics page with mock data for visual validation
5. **Review** page design and UX with stakeholder
6. **Backend Implementation** (separate task after frontend approval)
   - Create analytics controller, service, and repository
   - Implement actual data queries
   - Replace mock data with real analytics

---

### MVP Analytics Blocks
1. **Customer Engagement**
   - Total unique customers
   - Active customers (last 30 days)
   - New customers this month
   - Customer retention rate

2. **Program Performance**
   - Total punch cards created
   - Cards completed vs active
   - Completion rate percentage
   - Average punches per customer

3. **Business Activity**
   - Total punches given out
   - Daily/weekly punch trends
   - Rewards redeemed
   - Recent activity feed

4. **Loyalty Program Insights**
   - Most popular programs
   - Program-specific completion rates
