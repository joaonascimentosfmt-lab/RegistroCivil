import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('atlas-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('atlas-token');
      localStorage.removeItem('atlas-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export async function apiGet<T>(url: string, params?: any): Promise<T> {
  const response = await apiClient.get(url, { params });
  return response.data.data;
}

export async function apiPost<T>(url: string, data?: any): Promise<T> {
  const response = await apiClient.post(url, data);
  return response.data.data;
}

export async function apiPut<T>(url: string, data?: any): Promise<T> {
  const response = await apiClient.put(url, data);
  return response.data.data;
}

export async function apiPatch<T>(url: string, data?: any): Promise<T> {
  const response = await apiClient.patch(url, data);
  return response.data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete(url);
  return response.data.data;
}
