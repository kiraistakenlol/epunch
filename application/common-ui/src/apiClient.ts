import axios, { AxiosInstance } from 'axios';
import { CreatePunchDto, PunchCardDto, PunchOperationResultDto, AuthRequestDto, AuthResponseDto, UserDto, LoyaltyProgramDto, MerchantLoginDto, MerchantLoginResponse, CreateLoyaltyProgramDto, UpdateLoyaltyProgramDto, MerchantDto, CreatePunchCardDto, CreateMerchantDto, UpdateMerchantDto } from 'e-punch-common-core';

// The API URL will be set by the app using this client
let API_BASE_URL: string;

const createInstance = (baseURL: string): AxiosInstance => {
  const instance: AxiosInstance = axios.create({
    baseURL,
  });

  instance.interceptors.response.use(
    (response: any) => {
      const originalData = response.data;
      const isBackendWrapper = 
          response.status >= 200 && response.status < 300 &&
          originalData && typeof originalData === 'object' &&
          Object.prototype.hasOwnProperty.call(originalData, 'data') &&
          (Object.keys(originalData).length === 1 || Object.prototype.hasOwnProperty.call(originalData, 'error')); // Common for {data} or {data, error}

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

export const apiClient = {
  async getHelloWorld(): Promise<string> {
    const response = await instance.get<string>('/hello-world');
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

  // New method for Option 1 (POST /punches)
  async recordPunch(userId: string, loyaltyProgramId: string): Promise<PunchOperationResultDto> {
    if (!userId || !loyaltyProgramId) {
      return Promise.reject(new Error('User ID and Loyalty Program ID are required.'));
    }
    const payload: CreatePunchDto = { userId, loyaltyProgramId };
    const response = await instance.post<PunchOperationResultDto>('/punches', payload);
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
  async authenticateMerchant(login: string, password: string): Promise<MerchantLoginResponse> {
    if (!login || !password) {
      return Promise.reject(new Error('Login and password are required.'));
    }
    const payload: MerchantLoginDto = { login, password };
    const response = await instance.post<MerchantLoginResponse>('/merchants/auth', payload);
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
  }
}; 