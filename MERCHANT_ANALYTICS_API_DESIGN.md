# Merchant Analytics API Design

## Executive Summary

This document outlines the API design for merchant analytics based on the requirements from the AnalyticsPage.tsx component and the underlying database schema.

## Frontend Analytics Requirements Analysis

### 1. Quick Overview Section
- **Total Users**: Count of unique users across all loyalty programs
- **Total Punches**: Sum of all punches given
- **Total Cards**: Count of all punch cards (active + completed + redeemed)
- **Rewards Redeemed**: Count of redeemed punch cards
- **Growth Percentages**: Period-over-period growth for each metric

### 2. User Distribution (Pie Chart)
- **Registered Users**: Users with email/external_id
- **Anonymous Users**: Users without email/external_id

### 3. Card Status Distribution (Pie Chart)
- **Active Cards**: Cards with ACTIVE status
- **Reward Ready Cards**: Cards with REWARD_READY status
- **Redeemed Cards**: Cards with REWARD_REDEEMED status

### 4. Growth Trends (Line Chart)
- **Time Series Data**: Daily/weekly/monthly cumulative totals
- **Metrics**: Total users, total punches, total cards over time
- **Filtering**: By loyalty program (optional)

### 5. Activity Trends (Line Chart)
- **Time Series Data**: Daily/weekly/monthly activity counts
- **Metrics**: Punches, new customers, rewards redeemed, total customers
- **Filtering**: By loyalty program (optional)

### 6. Days of Week Activity (Bar Chart)
- **Weekly Patterns**: Activity breakdown by day of week
- **Metrics**: Same as activity trends
- **Filtering**: By loyalty program (optional)

### 7. Loyalty Program Performance
- **Program Stats**: Individual program metrics
- **Completion Rates**: Percentage of completed cards
- **Average Time to Complete**: Days to complete a card
- **Filtering**: By specific loyalty program

## Database Schema Analysis

### Core Tables
```sql
-- User table: Contains both registered and anonymous users
"user" (id, email, external_id, external_provider, super_admin, created_at)

-- Merchant and loyalty programs
merchant (id, name, address, slug, login, password_hash, logo_url, created_at)
loyalty_program (id, merchant_id, name, description, required_punches, reward_description, is_active, created_at)

-- Punch cards and punches - the core analytics data
punch_card (id, user_id, loyalty_program_id, current_punches, status, created_at)
punch (id, punch_card_id, created_at)
```

### Key Relationships
- **User → Punch Card**: One-to-many (user can have multiple cards)
- **Loyalty Program → Punch Card**: One-to-many (program can have multiple cards)
- **Punch Card → Punch**: One-to-many (card can have multiple punches)
- **Merchant → Loyalty Program**: One-to-many (merchant can have multiple programs)

## API Design

### Base URL Pattern
**Single Analytics Endpoint**: `/api/v2/analytics`

### Security Model Integration
The analytics endpoint uses dynamic authorization based on query parameters:
- **Merchant Analytics**: When `merchantId` is provided, requires merchant user authentication with ownership validation
- **Global Analytics**: When no `merchantId` is provided, requires super admin authentication
- **Flexible Authorization**: Uses `@RequireAnyAuth()` with runtime validation

## Analytics Endpoints

### 1. Core Analytics Endpoint
```
GET /api/v2/analytics
```

**Security**: `@RequireAnyAuth()` with dynamic authorization validation

**Query Parameters:**
- `merchantId` (optional): Filter by specific merchant. If provided, returns merchant analytics. If omitted, returns global analytics (super admin only)
- `period` (optional): `week` | `month` | `quarter` | `year` | `all` (default: `all`)
- `loyaltyProgramId` (optional): Filter by specific loyalty program
- `includeTimeSeries` (optional): boolean (default: `false`)
- `timeUnit` (optional): `days` | `weeks` | `months` (default: `days`)
- `timeRange` (optional): Number of periods to include (default: `12`)

**Response Structure:**
```typescript
interface AnalyticsResponse {
  scope: 'global' | 'merchant';
  merchantId?: string;
  merchantName?: string;
  period: TimePeriod;
  loyaltyProgramId?: string;
  metrics: AnalyticsMetrics | GlobalAnalyticsMetrics;
  timeSeries?: TimeSeriesData;
  loyaltyPrograms?: LoyaltyProgramSummary[];
  merchantSummary?: MerchantSummary[];
  generatedAt: string;
}
```

### 2. Time Series Data for Charts
```
GET /api/v2/analytics/time-series
```

**Purpose**: Provides time-based data points for analytics charts (Growth Trends, Activity Trends, Days of Week)

**Security**: `@RequireAnyAuth()` with dynamic authorization validation

**Query Parameters:**
- `merchantId` (optional): Filter by specific merchant (if omitted, requires super admin for global data)
- `type`: `activity` | `growth` | `days-of-week`
- `timeUnit`: `days` | `weeks` | `months` (for activity/growth types)
- `timeRange`: Number of periods (default: `12`)
- `loyaltyProgramId` (optional): Filter by specific loyalty program

**Response Structure:**
```typescript
interface TimeSeriesResponse {
  scope: 'global' | 'merchant';
  type: TimeSeriesType;
  timeUnit?: TimeUnit;
  merchantId?: string;
  loyaltyProgramId?: string;
  data: TimeSeriesDataPoint[];
  generatedAt: string;
}

interface TimeSeriesDataPoint {
  date: string;
  punches: number;
  newCustomers: number;
  rewardsRedeemed: number;
  totalCustomers: number;
  totalUsers?: number;
  totalPunches?: number;
  totalCards?: number;
}
```

### 3. Loyalty Program Analytics  
```
GET /api/v2/analytics/loyalty-programs
```

**Security**: `@RequireAnyAuth()` with automatic merchant filtering for merchant users

**Query Parameters:**
- `loyaltyProgramId` (optional): Specific program ID
- `includeInactive` (optional): boolean (default: `false`)

**Authorization Logic:**
- **Merchant users**: Automatically filtered to their own merchant's programs
- **Super admins**: Can see all programs across all merchants

**Response Structure:**
```typescript
interface LoyaltyProgramAnalyticsResponse {
  scope: 'global' | 'merchant';
  programs: LoyaltyProgramStats[];
  summary: LoyaltyProgramSummary;
  generatedAt: string;
}
```

## DTOs

### Core Analytics DTOs
```typescript
// Updated analytics.dto.ts
export interface MerchantAnalyticsResponse {
  merchantId: string;
  merchantName: string;
  period: TimePeriod;
  loyaltyProgramId?: string;
  metrics: AnalyticsMetrics;
  timeSeries?: TimeSeriesData;
  loyaltyPrograms: LoyaltyProgramSummary[];
  generatedAt: string;
}

// Global Analytics DTOs
export interface GlobalAnalyticsResponse {
  scope: 'global' | 'merchant';
  merchantId?: string;
  merchantName?: string;
  period: TimePeriod;
  metrics: GlobalAnalyticsMetrics;
  timeSeries?: TimeSeriesData;
  merchantSummary: MerchantSummary[];
  generatedAt: string;
}

export interface GlobalAnalyticsMetrics {
  platform: PlatformMetrics;
  merchants: MerchantMetrics;
  users: UserMetrics;
  punchCards: PunchCardMetrics;
  punches: PunchMetrics;
  rewards: RewardMetrics;
  growth?: GrowthMetrics;
}

export interface PlatformMetrics {
  totalMerchants: number;
  activeMerchants: number; // Merchants with activity in period
  newMerchants: number; // New merchants in period
  totalLoyaltyPrograms: number;
  activeLoyaltyPrograms: number;
}

export interface MerchantMetrics {
  totalMerchants: number;
  activeMerchants: number;
  topPerformingMerchants: MerchantPerformanceData[];
  merchantGrowth: number; // Percentage growth
}

export interface MerchantPerformanceData {
  merchantId: string;
  merchantName: string;
  totalUsers: number;
  totalPunches: number;
  totalCards: number;
  rewardsRedeemed: number;
  loyaltyProgramCount: number;
  avgCompletionRate: number;
  ranking: number;
}

export interface MerchantSummary {
  merchantId: string;
  merchantName: string;
  slug: string;
  totalUsers: number;
  totalPunches: number;
  totalCards: number;
  rewardsRedeemed: number;
  createdAt: string;
}

export interface GlobalMerchantPerformanceResponse {
  merchants: MerchantPerformanceData[];
  pagination: PaginationInfo;
  summary: GlobalMerchantSummary;
  generatedAt: string;
}

export interface GlobalMerchantSummary {
  totalMerchants: number;
  activeMerchants: number;
  topPerformers: number;
  averageUsersPerMerchant: number;
  averagePunchesPerMerchant: number;
  averageCardsPerMerchant: number;
}

export interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface AnalyticsMetrics {
  users: UserMetrics;
  punchCards: PunchCardMetrics;
  punches: PunchMetrics;
  rewards: RewardMetrics;
  growth?: GrowthMetrics;
}

export interface UserMetrics {
  total: number;
  registered: number;
  anonymous: number;
  active: number; // Active in selected period
  new: number; // New in selected period
}

export interface PunchCardMetrics {
  total: number;
  active: number;
  rewardReady: number;
  redeemed: number;
  completionRate: number;
  averageTimeToComplete: number; // in days
}

export interface PunchMetrics {
  total: number;
  periodTotal: number; // Total in selected period
  averagePerCard: number;
  averagePerCustomer: number;
}

export interface RewardMetrics {
  total: number;
  periodTotal: number; // Total in selected period
  redemptionRate: number;
}

export interface GrowthMetrics {
  users: GrowthData;
  punchCards: GrowthData;
  punches: GrowthData;
  rewards: GrowthData;
}

export interface GrowthData {
  current: number;
  previous: number;
  growth: number; // Percentage
  trend: 'up' | 'down' | 'stable';
}
```

### Time Series DTOs
```typescript
export interface TimeSeriesData {
  activity?: ActivityTimeSeriesData;
  growth?: GrowthTimeSeriesData;
  daysOfWeek?: DaysOfWeekData;
}

export interface ActivityTimeSeriesData {
  timeUnit: TimeUnit;
  data: ActivityDataPoint[];
}

export interface ActivityDataPoint {
  date: string; // ISO date
  punches: number;
  newCustomers: number;
  rewardsRedeemed: number;
  totalCustomers: number;
  loyaltyProgramId?: string;
}

export interface GrowthTimeSeriesData {
  timeUnit: TimeUnit;
  data: GrowthDataPoint[];
}

export interface GrowthDataPoint {
  date: string; // ISO date
  totalUsers: number;
  totalPunches: number;
  totalCards: number;
  loyaltyProgramId?: string;
}

export interface DaysOfWeekData {
  data: DayOfWeekDataPoint[];
}

export interface DayOfWeekDataPoint {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  dayName: string;
  punches: number;
  newCustomers: number;
  rewardsRedeemed: number;
  totalCustomers: number;
}
```

### Loyalty Program DTOs
```typescript
export interface LoyaltyProgramStats {
  loyaltyProgramId: string;
  name: string;
  description: string | null;
  requiredPunches: number;
  isActive: boolean;
  totalCards: number;
  activeCards: number;
  completedCards: number;
  completionRate: number;
  averageTimeToComplete: number;
  rewardsRedeemed: number;
  totalPunches: number;
  createdAt: string;
}

export interface LoyaltyProgramSummary {
  totalPrograms: number;
  activePrograms: number;
  inactivePrograms: number;
  mostPopularProgram: string;
  bestPerformingProgram: string;
}
```

### Request/Response DTOs
```typescript
// Unified Analytics Query Parameters
export interface AnalyticsQueryParams {
  merchantId?: string; // If provided: merchant analytics, if omitted: global analytics
  period?: TimePeriod;
  loyaltyProgramId?: string;
  includeTimeSeries?: boolean;
  timeUnit?: TimeUnit;
  timeRange?: number;
}

export interface TimeSeriesQueryParams {
  merchantId?: string; // If provided: merchant time series, if omitted: global time series
  type: TimeSeriesType;
  timeUnit?: TimeUnit; // Optional - not used for 'days-of-week' type
  timeRange?: number; // Default: 12
  loyaltyProgramId?: string;
}

export interface LoyaltyProgramQueryParams {
  loyaltyProgramId?: string; // Optional - specific program
  includeInactive?: boolean; // Default: false
  // Note: merchantId filtering handled automatically by security layer
  // - Merchant users: see only their own programs
  // - Super admins: see all programs
}

// Type Definitions
export type TimePeriod = 'week' | 'month' | 'quarter' | 'year' | 'all';
export type TimeUnit = 'days' | 'weeks' | 'months';
export type TimeSeriesType = 'activity' | 'growth' | 'days-of-week';
```

## Service Implementation

```typescript
@Injectable()
export class AnalyticsService {
  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly analyticsRepository: AnalyticsRepository
  ) {}

  async getAnalytics(params: AnalyticsQueryParams): Promise<AnalyticsResponse> {
    const timeFilter = this.buildTimeFilter(params.period);

    if (params.merchantId) {
      return this.getMerchantAnalytics(params, timeFilter);
    } else {
      return this.getGlobalAnalytics(params, timeFilter);
    }
  }

  async getTimeSeriesData(params: TimeSeriesQueryParams): Promise<TimeSeriesResponse> {
    const timeRange = params.timeRange || 12;
    
    if (params.merchantId) {
      const data = await this.analyticsRepository.getMerchantTimeSeriesData(
        params.merchantId,
        params.type,
        params.timeUnit,
        timeRange,
        params.loyaltyProgramId
      );

      return {
        scope: 'merchant' as const,
        type: params.type,
        timeUnit: params.timeUnit,
        merchantId: params.merchantId,
        loyaltyProgramId: params.loyaltyProgramId,
        data,
        generatedAt: new Date().toISOString()
      };
    } else {
      const data = await this.analyticsRepository.getGlobalTimeSeriesData(
        params.type,
        params.timeUnit,
        timeRange
      );

      return {
        scope: 'global' as const,
        type: params.type,
        timeUnit: params.timeUnit,
        data,
        generatedAt: new Date().toISOString()
      };
    }
  }

  async getLoyaltyProgramAnalytics(
    params: LoyaltyProgramQueryParams
  ): Promise<LoyaltyProgramAnalyticsResponse> {
    if (params.merchantId) {
      const programs = await this.analyticsRepository.getMerchantLoyaltyPrograms(
        params.merchantId,
        params.loyaltyProgramId,
        params.includeInactive
      );

      const summary = await this.analyticsRepository.getMerchantLoyaltyProgramSummary(params.merchantId);

      return {
        scope: 'merchant' as const,
        merchantId: params.merchantId,
        programs,
        summary,
        generatedAt: new Date().toISOString()
      };
    } else {
      const programs = await this.analyticsRepository.getGlobalLoyaltyPrograms(
        params.sortBy || 'completionRate',
        params.limit || 100,
        params.includeInactive
      );

      const summary = await this.analyticsRepository.getGlobalLoyaltyProgramSummary();

      return {
        scope: 'global' as const,
        programs,
        summary,
        generatedAt: new Date().toISOString()
      };
    }
  }

  private async getMerchantAnalytics(
    params: AnalyticsQueryParams,
    timeFilter: Date | null
  ): Promise<AnalyticsResponse> {
    const merchant = await this.merchantRepository.findById(params.merchantId!);
    if (!merchant) {
      throw new NotFoundException(`Merchant ${params.merchantId} not found`);
    }

    const metrics = await this.analyticsRepository.getMerchantMetrics(
      params.merchantId!,
      params.loyaltyProgramId,
      timeFilter
    );

    let timeSeries: TimeSeriesData | undefined;
    if (params.includeTimeSeries) {
      const timeSeriesParams: TimeSeriesQueryParams = {
        merchantId: params.merchantId,
        type: 'activity',
        timeUnit: params.timeUnit || 'days',
        timeRange: params.timeRange,
        loyaltyProgramId: params.loyaltyProgramId
      };
      const timeSeriesResponse = await this.getTimeSeriesData(timeSeriesParams);
      timeSeries = { activity: timeSeriesResponse.data };
    }

    const loyaltyPrograms = await this.analyticsRepository.getMerchantLoyaltyProgramSummary(params.merchantId!);

    return {
      scope: 'merchant' as const,
      merchantId: params.merchantId,
      merchantName: merchant.name,
      period: params.period || 'all',
      loyaltyProgramId: params.loyaltyProgramId,
      metrics,
      timeSeries,
      loyaltyPrograms: [loyaltyPrograms],
      generatedAt: new Date().toISOString()
    };
  }

  private async getGlobalAnalytics(
    params: AnalyticsQueryParams,
    timeFilter: Date | null
  ): Promise<AnalyticsResponse> {
    const metrics = await this.analyticsRepository.getGlobalMetrics(timeFilter);
    const merchantSummary = await this.analyticsRepository.getMerchantSummary(timeFilter);

    let timeSeries: TimeSeriesData | undefined;
    if (params.includeTimeSeries) {
      const timeSeriesParams: TimeSeriesQueryParams = {
        type: 'activity',
        timeUnit: params.timeUnit || 'days',
        timeRange: params.timeRange
      };
      const timeSeriesResponse = await this.getTimeSeriesData(timeSeriesParams);
      timeSeries = { activity: timeSeriesResponse.data };
    }

    return {
      scope: 'global' as const,
      period: params.period || 'all',
      metrics,
      timeSeries,
      merchantSummary,
      generatedAt: new Date().toISOString()
    };
  }

  private buildTimeFilter(period?: TimePeriod): Date | null {
    if (!period || period === 'all') return null;
    
    const now = new Date();
    switch (period) {
      case 'week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default: return null;
    }
  }
}
```

## Controller Implementation
```typescript
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @RequireAnyAuth()
  async getAnalytics(
    @Query() params: AnalyticsQueryParams,
    @Auth() auth: Authentication
  ): Promise<AnalyticsResponse> {
    if (params.merchantId) {
      if (!auth.superAdmin) {
        this.validateMerchantAccess(params.merchantId, auth);
      }
    } else {
      if (!auth.superAdmin) {
        throw new ForbiddenException('Super admin access required for global analytics');
      }
    }
    
    return this.analyticsService.getAnalytics(params);
  }

  @Get('time-series')
  @RequireAnyAuth()
  async getTimeSeriesData(
    @Query() params: TimeSeriesQueryParams,
    @Auth() auth: Authentication
  ): Promise<TimeSeriesResponse> {
    if (params.merchantId) {
      if (!auth.superAdmin) {
        this.validateMerchantAccess(params.merchantId, auth);
      }
    } else {
      if (!auth.superAdmin) {
        throw new ForbiddenException('Super admin access required for global time series');
      }
    }
    
    return this.analyticsService.getTimeSeriesData(params);
  }

  @Get('loyalty-programs')
  @RequireAnyAuth()
  async getLoyaltyProgramAnalytics(
    @Query() params: LoyaltyProgramQueryParams,
    @Auth() auth: Authentication
  ): Promise<LoyaltyProgramAnalyticsResponse> {
    if (params.merchantId) {
      if (!auth.superAdmin) {
        this.validateMerchantAccess(params.merchantId, auth);
      }
    } else {
      if (!auth.superAdmin) {
        throw new ForbiddenException('Super admin access required for global loyalty program analytics');
      }
    }
    
    return this.analyticsService.getLoyaltyProgramAnalytics(params);
  }

  private validateMerchantAccess(merchantId: string, auth: Authentication) {
    if (isMerchantUser(auth)) {
      if (auth.merchantUser.merchantId !== merchantId) {
        throw new ForbiddenException('Access denied: can only access own merchant data');
      }
    } else if (isEndUser(auth)) {
      if (!auth.superAdmin) {
        throw new ForbiddenException('Super admin access required');
      }
    } else {
      throw new ForbiddenException('Valid authentication required');
    }
  }
}
``` 