import { useMutation } from '@tanstack/react-query'
import { editBrand } from '../services/brandService'

export const useUpdateBrand = () => {
  return useMutation({
    mutationFn: editBrand,
  })
}
