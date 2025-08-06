import { apiClient } from '@/lib/axios'
import type { RoleResponse } from '../types'

export const fetchRoles = async (
  signal: AbortSignal
): Promise<RoleResponse[]> => {
  const response = await apiClient.get<RoleResponse[]>('Role/GetRoles', {
    signal,
  })
  return response
}
