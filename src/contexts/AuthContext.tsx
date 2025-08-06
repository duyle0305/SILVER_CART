import { FullPageLoader } from '@/components/common/FullPageLoader'
import { Role } from '@/features/authentication/constants'
import {
  clearTokens,
  getAccessToken,
  saveTokens,
} from '@/features/authentication/utils/tokenStorage'
import { jwtDecode } from 'jwt-decode'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface User {
  userId: string
  userName: string
  role: Role
}

interface DecodedToken {
  UserId: string
  UserName: string
  Role: Role
  exp: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (accessToken: string, stayLoggedIn?: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const accessToken = getAccessToken()
    if (accessToken) {
      try {
        const decodedToken: DecodedToken = jwtDecode(accessToken)

        if (decodedToken.exp * 1000 < Date.now()) {
          clearTokens()
          setUser(null)
        } else {
          setUser({
            userId: decodedToken.UserId,
            userName: decodedToken.UserName,
            role: decodedToken.Role,
          })
        }
      } catch (error) {
        console.error('Invalid token:', error)
        clearTokens()
        setUser(null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback((accessToken: string, stayLoggedIn?: boolean) => {
    saveTokens(accessToken, stayLoggedIn)
    try {
      const decodedToken: DecodedToken = jwtDecode(accessToken)
      setUser({
        userId: decodedToken.UserId,
        userName: decodedToken.UserName,
        role: decodedToken.Role,
      })
    } catch {
      clearTokens()
      setUser(null)
    }
  }, [])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  )

  if (isLoading) {
    return <FullPageLoader />
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
