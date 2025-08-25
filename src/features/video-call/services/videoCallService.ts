import { apiClient } from '@/lib/axios'
import type { ConnectBodyParam, Connection } from '../types'

export const getConnection = async (
  consultantId: string
): Promise<Connection> => {
  return apiClient.get<Connection>(`UserConnection/consultant/${consultantId}`)
}

export const connectToChannel = async (
  body: ConnectBodyParam
): Promise<void> => {
  await apiClient.post(`UserConnection/connect`, body)
}

export const disconnectFromChannel = async (
  connectionId: string
): Promise<void> => {
  await apiClient.post(`UserConnection/disconnect`, { connectionId })
}

export const declineCall = async (consultantId: string) => {
  await apiClient.post(`UserConnection/${consultantId}/decline`)
}
