import { Injectable, Inject } from '@nestjs/common';
import { QuickOverviewDto, UsersAnalyticsDto, CardsAnalyticsDto, GrowthTrendsDto, GrowthTrendDataPoint, ActivityTrendsDto, ActivityTrendDataPoint, DaysOfWeekAnalyticsDto, DaysOfWeekDataPoint, LoyaltyProgramAnalyticsDto, ProgramStats } from 'e-punch-common-core';
import { Pool } from 'pg';

@Injectable()
export class AnalyticsRepository {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async getQuickOverview(merchantId: string): Promise<QuickOverviewDto> {
    // Get current month metrics
    const currentQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT p.id) as total_punches,
        COUNT(DISTINCT pc.id) as total_cards,
        COUNT(DISTINCT CASE WHEN pc.status = 'REWARD_REDEEMED' THEN pc.id END) as rewards_redeemed
      FROM loyalty_program lp
      LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id 
        AND pc.created_at >= date_trunc('month', CURRENT_DATE)
      LEFT JOIN "user" u ON pc.user_id = u.id
      LEFT JOIN punch p ON pc.id = p.punch_card_id 
        AND p.created_at >= date_trunc('month', CURRENT_DATE)
      WHERE lp.merchant_id = $1
    `;

    // Get last month metrics for growth calculation
    const lastMonthQuery = `
      SELECT 
        COUNT(DISTINCT u.id) as total_users_last_month,
        COUNT(DISTINCT p.id) as total_punches_last_month,
        COUNT(DISTINCT pc.id) as total_cards_last_month,
        COUNT(DISTINCT CASE WHEN pc.status = 'REWARD_REDEEMED' THEN pc.id END) as rewards_redeemed_last_month
      FROM loyalty_program lp
      LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id 
        AND pc.created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
        AND pc.created_at < date_trunc('month', CURRENT_DATE)
      LEFT JOIN "user" u ON pc.user_id = u.id
      LEFT JOIN punch p ON pc.id = p.punch_card_id 
        AND p.created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
        AND p.created_at < date_trunc('month', CURRENT_DATE)
      WHERE lp.merchant_id = $1
    `;

    const [currentResult, lastMonthResult] = await Promise.all([
      this.pool.query(currentQuery, [merchantId]),
      this.pool.query(lastMonthQuery, [merchantId])
    ]);

    const current = currentResult.rows[0];
    const lastMonth = lastMonthResult.rows[0];

    const totalUsers = parseInt(current.total_users) || 0;
    const totalPunches = parseInt(current.total_punches) || 0;
    const totalCards = parseInt(current.total_cards) || 0;
    const rewardsRedeemed = parseInt(current.rewards_redeemed) || 0;

    const lastMonthUsers = parseInt(lastMonth.total_users_last_month) || 0;
    const lastMonthPunches = parseInt(lastMonth.total_punches_last_month) || 0;
    const lastMonthCards = parseInt(lastMonth.total_cards_last_month) || 0;
    const lastMonthRewards = parseInt(lastMonth.rewards_redeemed_last_month) || 0;

    // Calculate growth percentages
    const calculateGrowth = (current: number, previous: number): number => {
      if (previous === 0) {
        return current > 0 ? current * 100 : 0;
      }
      const growth = ((current - previous) / previous) * 100;
      return Math.round(growth * 10) / 10; // Round to 1 decimal place
    };

    return {
      totalUsers,
      totalPunches,
      totalCards,
      rewardsRedeemed,
      totalUsersGrowth: calculateGrowth(totalUsers, lastMonthUsers),
      totalCardsGrowth: calculateGrowth(totalCards, lastMonthCards),
      totalPunchesGrowth: calculateGrowth(totalPunches, lastMonthPunches),
      rewardsRedeemedGrowth: calculateGrowth(rewardsRedeemed, lastMonthRewards),
    };
  }

  async getUsersAnalytics(merchantId: string): Promise<UsersAnalyticsDto> {
    const query = `
      SELECT 
        COUNT(DISTINCT CASE WHEN u.external_id IS NOT NULL THEN u.id END) as registered_users,
        COUNT(DISTINCT CASE WHEN u.external_id IS NULL THEN u.id END) as anonymous_users,
        COUNT(DISTINCT u.id) as total_users
      FROM loyalty_program lp
      LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
      LEFT JOIN "user" u ON pc.user_id = u.id
      WHERE lp.merchant_id = $1
    `;

    const result = await this.pool.query(query, [merchantId]);
    const row = result.rows[0];

    return {
      registeredUsers: parseInt(row.registered_users) || 0,
      anonymousUsers: parseInt(row.anonymous_users) || 0,
      totalUsers: parseInt(row.total_users) || 0,
    };
  }

  async getCardsAnalytics(merchantId: string): Promise<CardsAnalyticsDto> {
    const query = `
      SELECT 
        COUNT(DISTINCT CASE WHEN pc.status = 'ACTIVE' THEN pc.id END) as active_cards,
        COUNT(DISTINCT CASE WHEN pc.status = 'REWARD_READY' THEN pc.id END) as reward_ready_cards,
        COUNT(DISTINCT CASE WHEN pc.status = 'REWARD_REDEEMED' THEN pc.id END) as reward_redeemed_cards,
        COUNT(DISTINCT pc.id) as total_cards
      FROM loyalty_program lp
      LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
      WHERE lp.merchant_id = $1
    `;

    const result = await this.pool.query(query, [merchantId]);
    const row = result.rows[0];

    return {
      activeCards: parseInt(row.active_cards) || 0,
      rewardReadyCards: parseInt(row.reward_ready_cards) || 0,
      rewardRedeemedCards: parseInt(row.reward_redeemed_cards) || 0,
      totalCards: parseInt(row.total_cards) || 0,
    };
  }

  async getGrowthTrends(merchantId: string, timeUnit: 'days' | 'weeks' | 'months', programId?: string): Promise<GrowthTrendsDto> {
    let dateFormat: string;
    let dateInterval: string;
    
    switch (timeUnit) {
      case 'days':
        dateFormat = 'YYYY-MM-DD';
        dateInterval = '1 day';
        break;
      case 'weeks':
        dateFormat = 'YYYY-MM-DD';
        dateInterval = '1 week';
        break;
      case 'months':
        dateFormat = 'YYYY-MM';
        dateInterval = '1 month';
        break;
    }

    const baseQuery = `
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '12 ${timeUnit}',
          CURRENT_DATE,
          '${dateInterval}'::interval
        )::date AS date
      ),
      cumulative_data AS (
        SELECT 
          ds.date,
          COUNT(DISTINCT CASE WHEN pc.created_at::date <= ds.date THEN u.id END) as total_users,
          COUNT(DISTINCT CASE WHEN p.created_at::date <= ds.date THEN p.id END) as total_punches,
          COUNT(DISTINCT CASE WHEN pc.created_at::date <= ds.date THEN pc.id END) as total_cards,
          COUNT(DISTINCT CASE WHEN pc.redeemed_at::date <= ds.date THEN pc.id END) as total_rewards_redeemed
        FROM date_series ds
        CROSS JOIN loyalty_program lp
        LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
        LEFT JOIN "user" u ON pc.user_id = u.id
        LEFT JOIN punch p ON pc.id = p.punch_card_id
        WHERE lp.merchant_id = $1
        ${programId ? 'AND lp.id = $2' : ''}
        GROUP BY ds.date
        ORDER BY ds.date
      )
      SELECT 
        TO_CHAR(date, '${dateFormat}') as date,
        total_users::integer,
        total_punches::integer,
        total_cards::integer,
        total_rewards_redeemed::integer
      FROM cumulative_data
      ORDER BY date;
    `;

    const params = programId ? [merchantId, programId] : [merchantId];
    const result = await this.pool.query(baseQuery, params);

    const data: GrowthTrendDataPoint[] = result.rows.map(row => ({
      date: row.date,
      totalUsers: parseInt(row.total_users) || 0,
      totalPunches: parseInt(row.total_punches) || 0,
      totalCards: parseInt(row.total_cards) || 0,
      totalRewardsRedeemed: parseInt(row.total_rewards_redeemed) || 0,
    }));

    return { data };
  }

  async getActivityTrends(merchantId: string, timeUnit: 'days' | 'weeks' | 'months', programId?: string): Promise<ActivityTrendsDto> {
    let dateFormat: string;
    let dateInterval: string;
    
    switch (timeUnit) {
      case 'days':
        dateFormat = 'YYYY-MM-DD';
        dateInterval = '1 day';
        break;
      case 'weeks':
        dateFormat = 'YYYY-MM-DD';
        dateInterval = '1 week';
        break;
      case 'months':
        dateFormat = 'YYYY-MM';
        dateInterval = '1 month';
        break;
    }

    const baseQuery = `
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '12 ${timeUnit}',
          CURRENT_DATE,
          '${dateInterval}'::interval
        )::date AS date
      ),
      activity_data AS (
        SELECT 
          ds.date,
          COUNT(DISTINCT CASE WHEN u.created_at::date = ds.date THEN u.id END) as new_customers,
          COUNT(DISTINCT CASE WHEN p.created_at::date = ds.date THEN p.id END) as punches,
          COUNT(DISTINCT CASE WHEN pc.redeemed_at::date = ds.date THEN pc.id END) as rewards_redeemed,
          COUNT(DISTINCT CASE WHEN pc.created_at::date = ds.date THEN pc.id END) as new_cards
        FROM date_series ds
        CROSS JOIN loyalty_program lp
        LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
        LEFT JOIN "user" u ON pc.user_id = u.id
        LEFT JOIN punch p ON pc.id = p.punch_card_id
        WHERE lp.merchant_id = $1
        ${programId ? 'AND lp.id = $2' : ''}
        GROUP BY ds.date
        ORDER BY ds.date
      )
      SELECT 
        TO_CHAR(date, '${dateFormat}') as date,
        new_customers::integer,
        punches::integer,
        rewards_redeemed::integer,
        new_cards::integer
      FROM activity_data
      ORDER BY date;
    `;

    const params = programId ? [merchantId, programId] : [merchantId];
    const result = await this.pool.query(baseQuery, params);

    const data: ActivityTrendDataPoint[] = result.rows.map(row => ({
      date: row.date,
      newCustomers: parseInt(row.new_customers) || 0,
      punches: parseInt(row.punches) || 0,
      rewardsRedeemed: parseInt(row.rewards_redeemed) || 0,
      newCards: parseInt(row.new_cards) || 0,
    }));

    return { data };
  }

  async getDaysOfWeekAnalytics(merchantId: string, programId?: string): Promise<DaysOfWeekAnalyticsDto> {
    const baseQuery = `
      WITH day_names AS (
        SELECT 'Monday' as day, 1 as day_order
        UNION ALL SELECT 'Tuesday', 2
        UNION ALL SELECT 'Wednesday', 3
        UNION ALL SELECT 'Thursday', 4
        UNION ALL SELECT 'Friday', 5
        UNION ALL SELECT 'Saturday', 6
        UNION ALL SELECT 'Sunday', 7
      ),
      day_data AS (
        SELECT 
          dn.day,
          dn.day_order,
          COUNT(DISTINCT CASE WHEN EXTRACT(DOW FROM u.created_at) = (dn.day_order % 7) THEN u.id END) as new_customers,
          COUNT(DISTINCT CASE WHEN EXTRACT(DOW FROM p.created_at) = (dn.day_order % 7) THEN p.id END) as punches,
          COUNT(DISTINCT CASE WHEN EXTRACT(DOW FROM pc.redeemed_at) = (dn.day_order % 7) THEN pc.id END) as rewards_redeemed,
          COUNT(DISTINCT CASE WHEN EXTRACT(DOW FROM pc.created_at) = (dn.day_order % 7) THEN pc.id END) as new_cards
        FROM day_names dn
        CROSS JOIN loyalty_program lp
        LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
        LEFT JOIN "user" u ON pc.user_id = u.id
        LEFT JOIN punch p ON pc.id = p.punch_card_id
        WHERE lp.merchant_id = $1
        ${programId ? 'AND lp.id = $2' : ''}
        GROUP BY dn.day, dn.day_order
        ORDER BY dn.day_order
      )
      SELECT 
        day,
        new_customers::integer,
        punches::integer,
        rewards_redeemed::integer,
        new_cards::integer
      FROM day_data
      ORDER BY day_order;
    `;

    const params = programId ? [merchantId, programId] : [merchantId];
    const result = await this.pool.query(baseQuery, params);

    const data: DaysOfWeekDataPoint[] = result.rows.map(row => ({
      day: row.day,
      newCustomers: parseInt(row.new_customers) || 0,
      punches: parseInt(row.punches) || 0,
      rewardsRedeemed: parseInt(row.rewards_redeemed) || 0,
      newCards: parseInt(row.new_cards) || 0,
    }));

    return { data };
  }

  async getLoyaltyProgramAnalytics(merchantId: string): Promise<LoyaltyProgramAnalyticsDto> {
    const query = `
      SELECT 
        lp.id as loyalty_program_id,
        lp.name,
        lp.description,
        COUNT(DISTINCT pc.id) as total_cards,
        COUNT(DISTINCT CASE WHEN pc.status = 'ACTIVE' THEN pc.id END) as active_cards,
        COUNT(DISTINCT CASE WHEN pc.completed_at IS NOT NULL THEN pc.id END) as completed_cards,
        COUNT(DISTINCT CASE WHEN pc.status = 'REWARD_REDEEMED' THEN pc.id END) as rewards_redeemed,
        CASE 
          WHEN COUNT(DISTINCT pc.id) > 0 THEN
            ROUND(
              (COUNT(DISTINCT CASE WHEN pc.completed_at IS NOT NULL THEN pc.id END)::numeric / COUNT(DISTINCT pc.id) * 100)::numeric, 
              2
            )
          ELSE 0 
        END as completion_rate,
        CASE 
          WHEN COUNT(DISTINCT CASE WHEN pc.completed_at IS NOT NULL THEN pc.id END) > 0 THEN
            ROUND(
              AVG(CASE 
                WHEN pc.completed_at IS NOT NULL THEN 
                  EXTRACT(EPOCH FROM (pc.completed_at - pc.created_at))/86400 
                ELSE NULL 
              END),
              1
            )
          ELSE 0 
        END as average_time_to_complete
      FROM loyalty_program lp
      LEFT JOIN punch_card pc ON lp.id = pc.loyalty_program_id
      WHERE lp.merchant_id = $1
      GROUP BY lp.id, lp.name, lp.description
      ORDER BY lp.name;
    `;

    const result = await this.pool.query(query, [merchantId]);

    const data: ProgramStats[] = result.rows.map(row => ({
      loyaltyProgramId: row.loyalty_program_id,
      name: row.name,
      description: row.description,
      totalCards: parseInt(row.total_cards) || 0,
      activeCards: parseInt(row.active_cards) || 0,
      completedCards: parseInt(row.completed_cards) || 0,
      completionRate: parseFloat(row.completion_rate) || 0,
      averageTimeToComplete: parseFloat(row.average_time_to_complete) || 0,
      rewardsRedeemed: parseInt(row.rewards_redeemed) || 0,
    }));

    return { data };
  }
} 