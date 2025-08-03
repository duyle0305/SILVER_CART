import type { SortType } from '@/constants'
import type { Role } from '@/features/authentication/constants'

export interface UserData {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  emergencyContact?: string
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  createdDate: string
}

export interface UserQueryParams {
  'PagingRequest.Page'?: number
  'PagingRequest.PageSize'?: number
  'PagingRequest.SortType'?: SortType
  'PagingRequest.ColName'?: string
  keyword?: string
  Role?: Role[]
}
