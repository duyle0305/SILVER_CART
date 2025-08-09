import { useQuery } from '@tanstack/react-query'
import { fetchProductById } from '../services/productService'

export const useProductDetail = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: ({ signal }) => fetchProductById(productId, signal),
    enabled: !!productId,
  })
}
