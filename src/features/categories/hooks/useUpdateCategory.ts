import { useMutation } from '@tanstack/react-query'
import { updateCategoryValue } from '../services/categoryService'

export const useUpdateCategory = () => {
  return useMutation({
    mutationFn: updateCategoryValue,
  })
}
