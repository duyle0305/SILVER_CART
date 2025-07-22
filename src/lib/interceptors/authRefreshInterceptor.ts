import { refreshToken as refreshTokenService } from '@/features/authentication/services/authService'
import {
  clearTokens,
  getRefreshToken,
  saveTokens,
} from '@/features/authentication/utils/tokenStorage'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { apiClient } from '@/lib/axios'

type FailedQueueItem = {
  resolve: (value: unknown) => void
  reject: (error: AxiosError) => void
}

export function createAuthRefreshInterceptor() {
  let isRefreshing = false
  let failedQueue: FailedQueueItem[] = []

  const processQueue = (
    error: AxiosError | null,
    token: string | null = null
  ) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error)
      else prom.resolve(token)
    })
    failedQueue = []
  }

  const interceptor = async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig

    if (error.response?.status !== 401 || originalRequest._isRetry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
    }

    originalRequest._isRetry = true
    isRefreshing = true

    try {
      const refreshToken = getRefreshToken()
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await refreshTokenService({
          refreshToken: refreshToken ?? '',
        })
      saveTokens(newAccessToken, newRefreshToken)

      apiClient.defaults.headers.common['Authorization'] =
        `Bearer ${newAccessToken}`
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

      processQueue(null, newAccessToken)
      return apiClient(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError as AxiosError, null)
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return interceptor
}
