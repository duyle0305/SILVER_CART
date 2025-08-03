import type { User, UserQueryParams } from '@/features/users/types'
import { apiClient } from '@/lib/axios'
import type { BaseResponse } from '@/types/baseResponse.type'

export const fetchUsers = async (
  params: UserQueryParams
): Promise<BaseResponse<User>> => {
  const response = await apiClient.get<BaseResponse<User>>('User', { params })
  return response
}

export const fetchUserDetail = async (id: string): Promise<User> => {
  const response = await apiClient.get<User>(`User/${id}`)
  return response
}
