import type { WithdrawRequestStatus } from '../constants'

export interface WithdrawRequest {
  id: string
  bankName: string
  bankAccountNumber: string
  accountHolder: string
  note: string
  amount: number
  status: WithdrawRequestStatus
  createdAt: string
}
