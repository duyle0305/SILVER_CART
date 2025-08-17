import { useMutation } from '@tanstack/react-query'
import { banUnbanUser } from '../services/userService'

export const useBanOrUnbanUser = () => {
  return useMutation({
    mutationFn: (userId: string) => banUnbanUser(userId),
  })
}
