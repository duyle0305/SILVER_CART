import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    _isRetry?: boolean;
  }
}

import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiClientInstance extends AxiosInstance {
  get<T = unknown, R = T, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  post<T = unknown, R = T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  put<T = unknown, R = T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  delete<T = unknown, R = T, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;
}