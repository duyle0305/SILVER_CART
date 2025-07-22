import type { LoginFormInputs } from '@/features/authentication/schemas'
import { apiClient } from '@/lib/axios'

interface AuthResponse {
  userId: string
  role: string
  accessToken: string
  refreshToken: string
  expiration: string
}

interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  expiration: string
}

export const loginWithEmailAndPassword = async (
  data: LoginFormInputs
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('Auth/login', data)
  return response
}

export const refreshToken = async (data: {
  refreshToken: string
}): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post<RefreshTokenResponse>(
    'Auth/refresh-token',
    data
  )
  return response
}
