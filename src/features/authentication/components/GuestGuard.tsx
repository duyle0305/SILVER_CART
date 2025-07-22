import { getAccessToken } from '@/features/authentication/utils/tokenStorage'
import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  const token = getAccessToken()
  return !!token
}

export function GuestGuard() {
  const isAuth = useAuth()

  return isAuth ? <Navigate to="/" /> : <Outlet />
}
