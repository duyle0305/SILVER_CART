import { useAuthContext } from '@/contexts/AuthContext'

export const useAuth = () => {
  const { isAuthenticated, user } = useAuthContext()
  return {
    isAuthenticated,
    role: user?.role,
  }
}
