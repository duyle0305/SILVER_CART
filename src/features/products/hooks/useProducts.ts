import { useQuery } from '@tanstack/react-query'
import { searchProducts } from '../services/productService'
import type { ProductSearchBody } from '../types'

export function useProducts(body: ProductSearchBody) {
  return useQuery({
    queryKey: ['products', body],
    queryFn: ({ signal }) => searchProducts(body, signal),
    refetchOnWindowFocus: false,
  })
}
