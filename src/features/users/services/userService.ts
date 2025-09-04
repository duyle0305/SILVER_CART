import type {
  CreateUserPayload,
  User,
  UserBodyParam,
  UserDetail,
} from '@/features/users/types'
import { apiClient } from '@/lib/axios'
import type { BaseResponse } from '@/types/baseResponse.type'
import { PresenceStatus } from '../constants'

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

export const changePresenceStatus = async (
  userId: string,
  newStatus: PresenceStatus
) => {
  await apiClient.put(`User/ChangePresenceStatus/${userId}/${newStatus}`)
}

export const getConsultantStatus = async (
  id: string,
  signal: AbortSignal
): Promise<PresenceStatus> => {
  const response = await apiClient.get<{ data: number } | number>(
    `User/GetConsutantStatus`,
    {
      params: { id },
      signal,
    }
  )

  return typeof response === 'object' && response !== null && 'data' in response
    ? response.data
    : response
}
