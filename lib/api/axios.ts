import axios, { AxiosRequestConfig } from 'axios';
import { getBaseUrl } from './utils';
import type { ApiError } from './types';

/** Reusable axios instance with shared base URL and headers */
export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

/** Response interceptor: unified error handling */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errObj = error.response?.data as ApiError | undefined;
    const message =
      errObj?.error ||
      `API error ${error.response?.status || error.message}`;
    return Promise.reject(new Error(message));
  }
);

/** Generic request helper, compatible with existing call sites */
export async function apiRequest<T>(
  path: string,
  options?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient(path, options);
  if (response.status === 204) return undefined as T;
  return response.data;
}
