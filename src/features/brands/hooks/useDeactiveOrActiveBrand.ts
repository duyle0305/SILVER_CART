import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactiveOrActiveBrand } from '../services/brandService'

export const useDeactiveOrActiveBrand = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactiveOrActiveBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
  })
}
