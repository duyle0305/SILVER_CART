import { clearTokens } from '@/features/authentication/utils/tokenStorage'
import type { AxiosError } from 'axios'

export function createAuthRefreshInterceptor() {
  const interceptor = (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearTokens()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
  return interceptor
}
