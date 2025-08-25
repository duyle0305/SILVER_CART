import { useQuery } from '@tanstack/react-query'
import { fetchPaymentHistory } from '../services/statisticService'
import type { PaymentHistoryBodyParam } from '../types'

export const usePaymentHistory = (bodyParam: PaymentHistoryBodyParam) => {
  return useQuery({
    queryKey: ['payment-history', bodyParam],
    queryFn: async ({ signal }) => fetchPaymentHistory(bodyParam, signal),
  })
}
