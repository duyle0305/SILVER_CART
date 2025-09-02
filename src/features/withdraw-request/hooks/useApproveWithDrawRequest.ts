import { useMutation, useQueryClient } from '@tanstack/react-query'
import { approveWithDrawRequest } from '../services/withdrawRequestService'

export const useApproveWithDrawRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => approveWithDrawRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdraw-request'] })
    },
  })
}
