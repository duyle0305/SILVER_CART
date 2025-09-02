import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactiveOrActiveProduct } from '../services/productService'

export function useDeactiveOrActiveProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => deactiveOrActiveProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product'] })
    },
  })
}
