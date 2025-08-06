import { ACCESS_TOKEN_KEY, Role } from '@/features/authentication/constants'

export const getStorage = (stayLoggedIn?: boolean) => {
  return stayLoggedIn ? localStorage : sessionStorage
}

export const getAccessToken = () => {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  )
}

export const saveTokens = (accessToken: string, stayLoggedIn?: boolean) => {
  const storage = getStorage(stayLoggedIn)
  storage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem('userRole')
  sessionStorage.removeItem('userRole')
  localStorage.removeItem('userId')
  sessionStorage.removeItem('userId')
}

export const saveUserRole = (userRole: Role, stayLoggedIn?: boolean) => {
  const storage = getStorage(stayLoggedIn)
  storage.setItem('userRole', userRole)
}

export const getUserRole = () => {
  return localStorage.getItem('userRole') || sessionStorage.getItem('userRole')
}

export const saveUserId = (userId: string, stayLoggedIn?: boolean) => {
  const storage = getStorage(stayLoggedIn)
  storage.setItem('userId', userId)
}

export const getUserId = () => {
  return localStorage.getItem('userId') || sessionStorage.getItem('userId')
}
