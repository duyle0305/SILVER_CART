import { getAccessToken } from '@/features/authentication/utils/tokenStorage'
import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  const user = getAccessToken()
  return !!user
}

export function AuthGuard() {
  const isAuth = useAuth()

  return isAuth ? <Outlet /> : <Navigate to="/login" />
}
