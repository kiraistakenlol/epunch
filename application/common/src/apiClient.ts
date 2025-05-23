import axios, { AxiosInstance } from 'axios';
import { CreatePunchDto, PunchCardDto, PunchOperationResultDto } from 'e-punch-common-core';

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

// Initialize with an empty baseURL that will be set later
let instance = createInstance('');

export const configureApiClient = (baseURL: string) => {
  API_BASE_URL = baseURL;
  console.log('API_BASE_URL configured:', API_BASE_URL);
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

  async generateTestData(): Promise<DevResponse> {
    const response = await instance.post<DevResponse>('/dev/generate-data');
    return response.data;
  },

  async resetTestData(): Promise<DevResponse> {
    const response = await instance.post<DevResponse>('/dev/reset-data');
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
  }
}; 