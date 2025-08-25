import { useMutation } from '@tanstack/react-query'
import { declineCall } from '../services/videoCallService'

export const useDeclineCall = () => {
  return useMutation({
    mutationFn: (consultantId: string) => declineCall(consultantId),
  })
}
