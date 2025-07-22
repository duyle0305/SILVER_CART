import { apiClient } from '@/lib/axios'
import type { SortType } from '@/constants'

interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: string
  createdDate: string
}

interface UserResponse {
  pageNumber: number
  pageSize: number
  totalNumberOfPages: number
  totalNumberOfRecords: number
  results: User[]
}

export interface UserQueryParams {
  'PagingRequest.Page'?: number
  'PagingRequest.PageSize'?: number
  'PagingRequest.SortType'?: SortType
  'PagingRequest.ColName'?: string
  keyword?: string
}

export const fetchUsers = async (
  params: UserQueryParams
): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>('User', { params })
  return response
}
