import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import * as BambooService from '@/services/Bamboo.service';
import { APIResponse, ILoginResponse } from '@/interfaces';

let isRefreshing = false;
let failedQueue: any[] = [];

const errorCallback = (status: number, error: string) => {
  return { status, error };
};

const processQueue = (error: AxiosError | null, token = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token);
    }
  });

  failedQueue = [];
};

class ApiClient {
  baseURL: string;
  tokenType: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL;
    this.tokenType = 'Authorization';
  }

  getInstance() {
    const api: AxiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    api.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem('accessToken') ?? '';
        if (config.headers) {
          config.headers[this.tokenType] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data;

        if (data.success === false || response.status >= 400) {
          const message = typeof data?.message === 'string' ? data?.message : '';
          return { ...response.data, status: 400, error: message || 'Có lỗi trong quá trình thực thi' };
        }

        return { data: response.data };
      },
      async (error: AxiosError) => {
        const config = error.config;
        const resError = error.response;
        const dataError: any = resError?.data;

        switch (resError?.status) {
          case 500:
            return errorCallback(500, dataError?.message || 'Có lỗi trong quá trình thực thi');
          case 401:
            // Handle if token is refreshing'
            if (['/login', '/signup'].includes(config.url ?? '')) {
              return errorCallback(500, dataError?.message || 'Có lỗi trong quá trình thực thi');
            }

            if (config.url?.includes('/refresh')) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }

            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then(() => {
                  if (config) return api(config);
                })
                .catch((err) => {
                  return Promise.reject(err);
                });
            }
            isRefreshing = true;

            const res: APIResponse<ILoginResponse> = await BambooService.refreshToken({
              accessToken: localStorage.getItem('accessToken') ?? '',
              refreshToken: localStorage.getItem('refreshToken') ?? '',
            }).finally(() => {
              isRefreshing = false;
            });

            if (res?.data?.accessToken) {
              localStorage.setItem('accessToken', res.data.accessToken);
              localStorage.setItem('refreshToken', res.data.refreshToken);
              processQueue(null, res.data.accessToken);
              if (config) return api(config);
            }

            return Promise.reject(error);
          default:
            return errorCallback(500, (resError && dataError?.message) || 'Có lỗi trong quá trình thực thi');
        }
      }
    );
    return api;
  }
}

export default ApiClient;
