import { useQuery } from '@tanstack/react-query'
import { getAllWithDrawRequests } from '../services/withdrawRequestService'

export const useGetWithdrawRequest = () => {
  return useQuery({
    queryKey: ['withdraw-request'],
    queryFn: ({ signal }) => getAllWithDrawRequests(signal),
  })
}
