import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '@/features/authentication/constants'

export const getStorage = (stayLoggedIn?: boolean) => {
  return stayLoggedIn ? localStorage : sessionStorage
}

export const getAccessToken = () => {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  )
}

export const getRefreshToken = () => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  )
}

export const saveTokens = (
  accessToken: string,
  refreshToken: string,
  stayLoggedIn?: boolean
) => {
  const storage = getStorage(stayLoggedIn)
  storage.setItem(ACCESS_TOKEN_KEY, accessToken)
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}
