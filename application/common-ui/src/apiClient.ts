import axios, { AxiosInstance } from 'axios';
import { CreatePunchDto, PunchCardDto, PunchOperationResultDto, AuthRequestDto, AuthResponseDto, UserDto, LoyaltyProgramDto, MerchantUserLoginDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, MerchantDto, CreatePunchCardDto, CreateMerchantDto, UpdateMerchantDto, PunchCardStyleDto, IconSearchResultDto, MerchantUserDto, CreateMerchantUserDto, UpdateMerchantUserDto, AdminLoginDto, AdminLoginResponse, QuickOverviewDto, UsersAnalyticsDto, CardsAnalyticsDto, GrowthTrendsDto, ActivityTrendsDto, DaysOfWeekAnalyticsDto, LoyaltyProgramAnalyticsDto, BundleProgramDto, BundleProgramCreateDto, BundleProgramUpdateDto } from 'e-punch-common-core';

// The API URL will be set by the app using this client
let API_BASE_URL: string;

// Authentication provider function - can be set by each app
export type AuthTokenProvider = () => string | null;
let authTokenProvider: AuthTokenProvider | undefined = undefined;

const createInstance = (baseURL: string): AxiosInstance => {
  const instance: AxiosInstance = axios.create({
    baseURL,
  });

  // Request interceptor to add Authorization header
  instance.interceptors.request.use(
    (config) => {
      try {
        const provider = authTokenProvider;
        if (provider) {
          const token = provider();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: any) => {
      const originalData = response.data;
      const isBackendWrapper = 
          response.status >= 200 && response.status < 300 &&
          originalData && typeof originalData === 'object' &&
          Object.prototype.hasOwnProperty.call(originalData, 'data') &&
          (Object.keys(originalData).length === 1 || Object.prototype.hasOwnProperty.call(originalData, 'error')); // Common for {data} or {error}

      if (isBackendWrapper) {
        if (originalData.error) {
          console.error('Backend wrapped response indicates an error:', originalData.error);
          return Promise.reject(new Error(originalData.error));
        }
        response.data = originalData.data; 
        return response;
      }
      
      return response;
    },
    (error: any) => {
      console.error(
        'Axios response error:',
        error.response?.status,
        error.response?.data || error.message
      );
      return Promise.reject(error);
    }
  );

  return instance;
};

// Interface for dev endpoint responses
export interface DevResponse {
  status: string;
  message: string;
  [key: string]: any; // For additional properties
}

export interface SystemStatistics {
  merchants: { 
    total: number; 
    list: Array<{ 
      id: string; 
      name: string; 
      punchCardCount: number; 
      userCount: number; 
      loyaltyProgramCount: number; 
    }> 
  };
  users: { total: number };
  punchCards: { total: number; active: number; rewardReady: number; redeemed: number };
  punches: { total: number };
  loyaltyPrograms: { total: number; active: number };
}

// Initialize with an empty baseURL that will be set later
let instance = createInstance('');

export const configureApiClient = (baseURL: string) => {
  API_BASE_URL = baseURL;
  instance = createInstance(baseURL);
};

export const setAuthTokenProvider = (provider: AuthTokenProvider | undefined) => {
  authTokenProvider = provider;
  // Recreate instance to apply the new auth provider
  if (API_BASE_URL) {
    instance = createInstance(API_BASE_URL);
  }
};

export const apiClient = {
  async getHelloWorld(): Promise<string> {
    const response = await instance.get<string>('/hello-world');
    return response.data;
  },

  async searchIcons(
    query?: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<IconSearchResultDto> {
    const params = new URLSearchParams();
    
    if (query) params.append('q', query);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await instance.get<IconSearchResultDto>(`/icons/search?${params}`);
    return response.data;
  },

  async getUserPunchCards(userId: string): Promise<PunchCardDto[]> {
    if (!userId) {
      console.warn('getUserPunchCards called without a userId. Returning empty list.');
      return Promise.resolve([]);
    }
    const response = await instance.get<PunchCardDto[]>(`/users/${userId}/punch-cards`);
    return response.data;
  },

  // Development endpoints
  async checkDevEndpoint(): Promise<DevResponse> {
    const response = await instance.get<DevResponse>('/dev/status');
    return response.data;
  },

  // Data removal endpoints
  async removeAllPunchCards(merchantId?: string): Promise<DevResponse> {
    const url = merchantId ? `/dev/punch-cards?merchantId=${merchantId}` : '/dev/punch-cards';
    const response = await instance.delete<DevResponse>(url);
    return response.data;
  },

  async removeAllUsers(merchantId?: string): Promise<DevResponse> {
    const url = merchantId ? `/dev/users?merchantId=${merchantId}` : '/dev/users';
    const response = await instance.delete<DevResponse>(url);
    return response.data;
  },

  async removeAllLoyaltyPrograms(merchantId?: string): Promise<DevResponse> {
    const url = merchantId ? `/dev/loyalty-programs?merchantId=${merchantId}` : '/dev/loyalty-programs';
    const response = await instance.delete<DevResponse>(url);
    return response.data;
  },

  async removeAllMerchants(merchantId?: string): Promise<DevResponse> {
    const url = merchantId ? `/dev/merchants?merchantId=${merchantId}` : '/dev/merchants';
    const response = await instance.delete<DevResponse>(url);
    return response.data;
  },

  async removeAllData(merchantId?: string): Promise<DevResponse> {
    const url = merchantId ? `/dev/all?merchantId=${merchantId}` : '/dev/all';
    const response = await instance.delete<DevResponse>(url);
    return response.data;
  },

  async punchUser(userId: string): Promise<{ message: string }> {
    if (!userId) {
      console.warn('punchUser called without a userId.');
      return Promise.reject(new Error('User ID is required to punch.'));
    }
    // Assuming an empty body for the punch action as per ScannerPage placeholder
    const response = await instance.post<{ message: string }>(`/users/${userId}/punch-cards`, {});
    return response.data; // After interceptor, this should be the { message: string } object
  },

  async recordPunch(userId: string, loyaltyProgramId: string): Promise<PunchOperationResultDto> {
    if (!userId || !loyaltyProgramId) {
      return Promise.reject(new Error('User ID and Loyalty Program ID are required.'));
    }
    const payload: CreatePunchDto = { userId, loyaltyProgramId };
    const response = await instance.post<PunchOperationResultDto>('/punch-cards/punch', payload);
    return response.data;
  },

  async redeemPunchCard(punchCardId: string): Promise<PunchCardDto> {
    if (!punchCardId) {
      return Promise.reject(new Error('Punch card ID is required.'));
    }
    const response = await instance.post<PunchCardDto>(`/punch-cards/${punchCardId}/redeem`);
    return response.data;
  },

  async getPunchCard(punchCardId: string): Promise<PunchCardDto> {
    if (!punchCardId) {
      return Promise.reject(new Error('Punch card ID is required.'));
    }
    const response = await instance.get<PunchCardDto>(`/punch-cards/${punchCardId}`);
    return response.data;
  },

  async getMerchantLoyaltyPrograms(merchantId: string): Promise<LoyaltyProgramDto[]> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<LoyaltyProgramDto[]>(`/merchants/${merchantId}/loyalty-programs`);
    return response.data;
  },

  async createLoyaltyProgram(merchantId: string, data: CreateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.post<LoyaltyProgramDto>(`/merchants/${merchantId}/loyalty-programs`, data);
    return response.data;
  },

  async updateLoyaltyProgram(merchantId: string, programId: string, data: UpdateLoyaltyProgramDto): Promise<LoyaltyProgramDto> {
    if (!merchantId || !programId) {
      return Promise.reject(new Error('Merchant ID and Program ID are required.'));
    }
    const response = await instance.put<LoyaltyProgramDto>(`/merchants/${merchantId}/loyalty-programs/${programId}`, data);
    return response.data;
  },

  async deleteLoyaltyProgram(merchantId: string, programId: string): Promise<void> {
    if (!merchantId || !programId) {
      return Promise.reject(new Error('Merchant ID and Program ID are required.'));
    }
    await instance.delete(`/merchants/${merchantId}/loyalty-programs/${programId}`);
  },

  async getLoyaltyProgram(loyaltyProgramId: string): Promise<LoyaltyProgramDto> {
    if (!loyaltyProgramId) {
      return Promise.reject(new Error('Loyalty Program ID is required.'));
    }
    const response = await instance.get<LoyaltyProgramDto>(`/loyalty-programs/${loyaltyProgramId}`);
    return response.data;
  },

  async getLoyaltyPrograms(loyaltyProgramIds: string[]): Promise<LoyaltyProgramDto[]> {
    if (!loyaltyProgramIds || loyaltyProgramIds.length === 0) {
      return Promise.resolve([]);
    }
    const idsParam = loyaltyProgramIds.join(',');
    const response = await instance.get<LoyaltyProgramDto[]>(`/loyalty-programs?ids=${idsParam}`);
    return response.data;
  },

  // Authentication method
  async authenticateUser(authToken: string, userId: string): Promise<AuthResponseDto> {
    if (!authToken || !userId) {
      return Promise.reject(new Error('Auth token and user ID are required.'));
    }
    const payload: AuthRequestDto = { authToken, userId };
    const response = await instance.post<AuthResponseDto>('/auth', payload);
    return response.data;
  },

  // Get current user
  async getCurrentUser(authToken: string): Promise<UserDto> {
    if (!authToken) {
      return Promise.reject(new Error('Auth token is required.'));
    }
    const response = await instance.get<UserDto>('/users/me', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return response.data;
  },

  // Get all users (admin endpoint)
  async getAllUsers(): Promise<UserDto[]> {
    const response = await instance.get<UserDto[]>('/users');
    return response.data;
  },

  // Get user by ID (admin endpoint)
  async getUserById(userId: string): Promise<UserDto> {
    if (!userId) {
      return Promise.reject(new Error('User ID is required.'));
    }
    const response = await instance.get<UserDto>(`/users/${userId}`);
    return response.data;
  },

  // Merchant authentication
  async authenticateMerchant(merchantSlug: string, login: string, password: string): Promise<MerchantLoginResponse> {
    if (!merchantSlug || !login || !password) {
      return Promise.reject(new Error('Merchant slug, login and password are required.'));
    }
    const payload: MerchantUserLoginDto = { merchantSlug, login, password };
    const response = await instance.post<MerchantLoginResponse>('/merchants/auth', payload);
    return response.data;
  },

  // Admin authentication
  async authenticateAdmin(login: string, password: string): Promise<AdminLoginResponse> {
    if (!login || !password) {
      return Promise.reject(new Error('Login and password are required.'));
    }
    const payload: AdminLoginDto = { login, password };
    const response = await instance.post<AdminLoginResponse>('/admin/auth', payload);
    return response.data;
  },

  // Get all merchants
  async getAllMerchants(slug?: string): Promise<MerchantDto[]> {
    const url = slug ? `/merchants?slug=${encodeURIComponent(slug)}` : '/merchants';
    const response = await instance.get<MerchantDto[]>(url);
    return response.data;
  },

  async getMerchantById(merchantId: string): Promise<MerchantDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<MerchantDto>(`/merchants/${merchantId}`);
    return response.data;
  },

  async getMerchantBySlug(slug: string): Promise<MerchantDto> {
    if (!slug) {
      return Promise.reject(new Error('Merchant slug is required.'));
    }
    const response = await instance.get<MerchantDto>(`/merchants/by-slug/${encodeURIComponent(slug)}`);
    return response.data;
  },

  async createPunchCard(userId: string, createPunchCardDto: CreatePunchCardDto): Promise<PunchCardDto> {
    if (!userId) {
      return Promise.reject(new Error('User ID is required.'));
    }
    const requestBody = {
      userId,
      loyaltyProgramId: createPunchCardDto.loyaltyProgramId
    };
    const response = await instance.post<PunchCardDto>('/punch-cards', requestBody);
    return response.data;
  },

  async createMerchant(merchantDto: CreateMerchantDto): Promise<MerchantDto> {
    const response = await instance.post<MerchantDto>('/merchants', merchantDto);
    return response.data;
  },

  async updateMerchant(merchantId: string, merchantDto: UpdateMerchantDto): Promise<MerchantDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.put<MerchantDto>(`/merchants/${merchantId}`, merchantDto);
    return response.data;
  },

  async deleteMerchant(merchantId: string): Promise<void> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    await instance.delete(`/merchants/${merchantId}`);
  },

  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await instance.get<SystemStatistics>('/dev/statistics');
    return response.data;
  },

  async generateFileUploadUrl(merchantId: string, fileName: string): Promise<{ uploadUrl: string; publicUrl: string }> {
    if (!merchantId || !fileName) {
      return Promise.reject(new Error('Merchant ID and file name are required.'));
    }
    const response = await instance.post<{ uploadUrl: string; publicUrl: string }>(`/merchants/${merchantId}/file-upload-url`, { fileName });
    return response.data;
  },

  async getMerchantDefaultPunchCardStyle(merchantId: string): Promise<PunchCardStyleDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<PunchCardStyleDto>(`/punch-card-styles/merchants/${merchantId}/default`);
    return response.data;
  },

  async createOrUpdateMerchantDefaultStyle(merchantId: string, data: PunchCardStyleDto): Promise<PunchCardStyleDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.post<PunchCardStyleDto>(`/punch-card-styles/merchants/${merchantId}/default`, data);
    return response.data;
  },

  async getMerchantUsers(merchantId: string): Promise<MerchantUserDto[]> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<MerchantUserDto[]>(`/merchants/${merchantId}/users`);
    return response.data;
  },

  async createMerchantUser(merchantId: string, data: CreateMerchantUserDto): Promise<MerchantUserDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.post<MerchantUserDto>(`/merchants/${merchantId}/users`, data);
    return response.data;
  },

  async updateMerchantUser(merchantId: string, userId: string, data: UpdateMerchantUserDto): Promise<MerchantUserDto> {
    if (!merchantId || !userId) {
      return Promise.reject(new Error('Merchant ID and User ID are required.'));
    }
    const response = await instance.put<MerchantUserDto>(`/merchants/${merchantId}/users/${userId}`, data);
    return response.data;
  },

  async deleteMerchantUser(merchantId: string, userId: string): Promise<void> {
    if (!merchantId || !userId) {
      return Promise.reject(new Error('Merchant ID and User ID are required.'));
    }
    await instance.delete(`/merchants/${merchantId}/users/${userId}`);
  },

  // Analytics endpoints
  async getQuickOverview(merchantId: string): Promise<QuickOverviewDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<QuickOverviewDto>(`/analytics/${merchantId}/quick-overview`);
    return response.data;
  },

  async getUsersAnalytics(merchantId: string): Promise<UsersAnalyticsDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<UsersAnalyticsDto>(`/analytics/${merchantId}/users`);
    return response.data;
  },

  async getCardsAnalytics(merchantId: string): Promise<CardsAnalyticsDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<CardsAnalyticsDto>(`/analytics/${merchantId}/cards`);
    return response.data;
  },

  async getGrowthTrends(merchantId: string, timeUnit: 'days' | 'weeks' | 'months', programId?: string): Promise<GrowthTrendsDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const params = new URLSearchParams();
    params.append('timeUnit', timeUnit);
    if (programId && programId !== 'all') {
      params.append('programId', programId);
    }
    const response = await instance.get<GrowthTrendsDto>(`/analytics/${merchantId}/growth-trends?${params}`);
    return response.data;
  },

  async getActivityTrends(merchantId: string, timeUnit: 'days' | 'weeks' | 'months', programId?: string): Promise<ActivityTrendsDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const params = new URLSearchParams();
    params.append('timeUnit', timeUnit);
    if (programId && programId !== 'all') {
      params.append('programId', programId);
    }
    const response = await instance.get<ActivityTrendsDto>(`/analytics/${merchantId}/activity-trends?${params}`);
    return response.data;
  },

  async getDaysOfWeekAnalytics(merchantId: string, programId?: string): Promise<DaysOfWeekAnalyticsDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const params = new URLSearchParams();
    if (programId && programId !== 'all') {
      params.append('programId', programId);
    }
    const response = await instance.get<DaysOfWeekAnalyticsDto>(`/analytics/${merchantId}/days-of-week?${params}`);
    return response.data;
  },

  async getLoyaltyProgramAnalytics(merchantId: string): Promise<LoyaltyProgramAnalyticsDto> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<LoyaltyProgramAnalyticsDto>(`/analytics/${merchantId}/loyalty-programs`);
    return response.data;
  },

  async getMerchantCustomers(
    merchantId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Promise<{ customers: UserDto[]; total: number; page: number; limit: number }> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    const response = await instance.get<{ customers: UserDto[]; total: number; page: number; limit: number }>(
      `/merchants/${merchantId}/customers?${params}`
    );
    return response.data;
  },

  async getMerchantCustomer(merchantId: string, customerId: string): Promise<UserDto> {
    if (!merchantId || !customerId) {
      return Promise.reject(new Error('Merchant ID and Customer ID are required.'));
    }
    const response = await instance.get<UserDto>(`/merchants/${merchantId}/customers/${customerId}`);
    return response.data;
  },

  async getMerchantCustomerPunchCards(merchantId: string, customerId: string): Promise<PunchCardDto[]> {
    if (!merchantId || !customerId) {
      return Promise.reject(new Error('Merchant ID and Customer ID are required.'));
    }
    const response = await instance.get<PunchCardDto[]>(`/merchants/${merchantId}/customers/${customerId}/punch-cards`);
    return response.data;
  },

  // Bundle Program endpoints
  async getMerchantBundlePrograms(merchantId: string): Promise<BundleProgramDto[]> {
    if (!merchantId) {
      return Promise.reject(new Error('Merchant ID is required.'));
    }
    const response = await instance.get<BundleProgramDto[]>(`/merchants/${merchantId}/bundle-programs`);
    return response.data;
  },

  async createBundleProgram(data: BundleProgramCreateDto): Promise<BundleProgramDto> {
    const response = await instance.post<BundleProgramDto>('/bundle-programs', data);
    return response.data;
  },

  async updateBundleProgram(programId: string, data: BundleProgramUpdateDto): Promise<BundleProgramDto> {
    if (!programId) {
      return Promise.reject(new Error('Program ID is required.'));
    }
    const response = await instance.put<BundleProgramDto>(`/bundle-programs/${programId}`, data);
    return response.data;
  },

  async deleteBundleProgram(programId: string): Promise<void> {
    if (!programId) {
      return Promise.reject(new Error('Program ID is required.'));
    }
    await instance.delete(`/bundle-programs/${programId}`);
  },
}; 