import { config } from '@/config'
import { getAccessToken } from '@/features/authentication/utils/tokenStorage'
import { createAuthRefreshInterceptor } from '@/lib/interceptors/authRefreshInterceptor'
import type { ApiClientInstance } from '@/types/axios'
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
}) as ApiClientInstance

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response.data.data,
  createAuthRefreshInterceptor()
)
