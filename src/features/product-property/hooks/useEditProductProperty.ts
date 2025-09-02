import { useMutation } from '@tanstack/react-query'
import { editProductProperty } from '../services/productPropertyService'

export const useEditProductProperty = () => {
  return useMutation({
    mutationFn: editProductProperty,
  })
}
