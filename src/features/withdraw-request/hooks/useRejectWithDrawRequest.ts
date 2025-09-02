import { useMutation, useQueryClient } from '@tanstack/react-query'
import { rejectWithDrawRequest } from '../services/withdrawRequestService'

export const useRejectWithDrawRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectWithDrawRequest(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdraw-request'] })
    },
  })
}
