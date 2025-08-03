import {
  getAccessToken,
  getUserRole,
} from '@/features/authentication/utils/tokenStorage'

export const useAuth = () => {
  const accessToken = getAccessToken()
  const role = getUserRole()

  return {
    isAuthenticated: !!accessToken,
    role,
  }
}
