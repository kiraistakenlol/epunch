import axios from 'axios';
import { ApiResponse } from 'e-punch-common';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL;

console.log('API_BASE_URL', API_BASE_URL);

export const apiClient = {
  async getHelloWorld(): Promise<ApiResponse<string>> {
    const response = await axios.get<ApiResponse<string>>(`${API_BASE_URL}/hello-world`);
    return response.data;
  }
}; 