import axios from 'axios';
import { ApiResponse } from 'e-punch-common';

const API_BASE_URL = 'http://localhost:4000/api/v1';

export const apiClient = {
  async getHelloWorld(): Promise<ApiResponse<string>> {
    const response = await axios.get<ApiResponse<string>>(`${API_BASE_URL}/hello-world`);
    return response.data;
  }
}; 