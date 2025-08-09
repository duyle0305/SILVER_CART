import { useMutation } from '@tanstack/react-query'
import { createValueOfBrandRoot } from '../services/brandService'

export const useCreateBrand = () => {
  return useMutation({
    mutationFn: createValueOfBrandRoot,
  })
}
