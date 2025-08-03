import { useAuth } from '@/features/authentication/hooks/useAuth'
import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import type { Role } from '../constants'

interface AuthGuardProps {
  children: ReactNode
  roles?: Role[]
}

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const hasRequiredRole = !roles || roles.includes(role as Role)

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
