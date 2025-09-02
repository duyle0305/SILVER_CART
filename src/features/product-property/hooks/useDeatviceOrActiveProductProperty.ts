import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactiveOrActiveProductProperty } from '../services/productPropertyService'

export const useDeactiveOrActiveProductProperty = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactiveOrActiveProductProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listProductProperty'] })
    },
  })
}
