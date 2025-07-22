import { loginWithEmailAndPassword } from '@/features/authentication/services/authService'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  return useMutation({
    mutationFn: loginWithEmailAndPassword,
  })
}
