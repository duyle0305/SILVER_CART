import { useMutation } from '@tanstack/react-query'
import { createUser } from '../services/userService'

export const useCreateUser = () => {
  return useMutation({
    mutationFn: createUser,
  })
}
