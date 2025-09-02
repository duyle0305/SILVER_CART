import { useMutation } from '@tanstack/react-query'
import type { PresenceStatus } from '../constants'
import { changePresenceStatus } from '../services/userService'

export const useChangePresenceStatus = () => {
  return useMutation({
    mutationFn: ({
      userId,
      newStatus,
    }: {
      userId: string
      newStatus: PresenceStatus
    }) => changePresenceStatus(userId, newStatus),
  })
}
