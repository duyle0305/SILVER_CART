import type {
  CreateUserPayload,
  User,
  UserBodyParam,
  UserDetail,
} from '@/features/users/types'
import { apiClient } from '@/lib/axios'
import type { BaseResponse } from '@/types/baseResponse.type'

export const fetchUsers = async (
  body: UserBodyParam,
  signal: AbortSignal
): Promise<BaseResponse<User>> => {
  const response = await apiClient.post<BaseResponse<User>>(
    'User/SearchUsers',
    body,
    {
      signal,
    }
  )
  return response
}

export const fetchUserDetail = async (
  id: string,
  signal: AbortSignal
): Promise<UserDetail> => {
  const response = await apiClient.get<UserDetail>('User/GetDetail', {
    params: { id },
    signal,
  })
  return response
}

export const createUser = async (data: CreateUserPayload): Promise<unknown> => {
  const response = await apiClient.post('User/CreateUser', data)
  return response
}

export const banUnbanUser = async (userId: string) => {
  await apiClient.put(`User/${userId}/BanOrUnbanUser`)
}
