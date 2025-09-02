import { apiClient } from '@/lib/axios'
import type { WithdrawRequest } from '../types'

export const getAllWithDrawRequests = async (signal: AbortSignal) => {
  return await apiClient.get<WithdrawRequest[]>(
    '/WithdrawRequest/GetAllRequests',
    { signal }
  )
}

export const approveWithDrawRequest = async (id: string) => {
  return await apiClient.post<void>(`/WithdrawRequest/ApproveWithdraw?id=${id}`)
}

export const rejectWithDrawRequest = async (id: string, reason: string) => {
  return await apiClient.post<void>(
    `/WithdrawRequest/RejectWithdraw?id=${id}&reason=${reason}`
  )
}
