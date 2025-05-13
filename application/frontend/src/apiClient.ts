import axios, { AxiosInstance } from 'axios';
import { PunchCardDto } from 'e-punch-common';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL;

console.log('API_BASE_URL from apiClient:', API_BASE_URL);

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.response.use(
  (response) => {
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
  (error) => {
    console.error(
      'Axios response error:',
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

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
  }
}; 