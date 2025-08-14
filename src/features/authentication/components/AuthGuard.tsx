import { useAuthContext } from '@/contexts/AuthContext'
import { Role } from '@/features/authentication/constants'
import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface AuthGuardProps {
  children: ReactNode
  roles?: Role[]
}

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthContext()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const hasRequiredRole = !roles || (user && roles.includes(user.role))

  if (!hasRequiredRole) {
    return <Navigate to={user?.role === Role.ADMIN ? '/' : '/users'} replace />
  }

  return <>{children}</>
}
