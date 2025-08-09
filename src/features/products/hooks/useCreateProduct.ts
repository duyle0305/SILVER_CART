import { useMutation } from '@tanstack/react-query'
import { createProduct } from '../services/productService'

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: createProduct,
  })
}
