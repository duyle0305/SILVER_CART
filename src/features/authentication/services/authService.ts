import type { LoginFormInputs } from '@/features/authentication/schemas'
import { apiClient } from '@/lib/axios'

export const loginWithEmailAndPassword = async (
  data: LoginFormInputs
): Promise<string> => {
  const response = await apiClient.post<string>('Auth/login', data)
  return response
}
