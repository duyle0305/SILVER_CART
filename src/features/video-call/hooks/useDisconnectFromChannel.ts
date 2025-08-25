import { useMutation } from '@tanstack/react-query'
import { disconnectFromChannel } from '../services/videoCallService'

export const useDisconnectFromChannel = () => {
  return useMutation({
    mutationFn: (connectionId: string) => disconnectFromChannel(connectionId),
  })
}
