import { useMutation } from '@tanstack/react-query'
import { connectToChannel } from '../services/videoCallService'
import type { ConnectBodyParam } from '../types'

export const useConnectToChannel = () => {
  return useMutation({
    mutationFn: (body: ConnectBodyParam) => connectToChannel(body),
  })
}
