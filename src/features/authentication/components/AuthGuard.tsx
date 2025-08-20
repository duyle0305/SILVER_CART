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
    const redirectPath = (role: Role) => {
      switch (role) {
        case Role.ADMIN:
          return '/'
        case Role.CONSULTANT:
          return '/products'
        case Role.STAFF:
          return '/orders'
        default:
          return '/login'
      }
    }

    return <Navigate to={redirectPath(user?.role ?? Role.UNKNOWN)} replace />
  }

  return <>{children}</>
}
