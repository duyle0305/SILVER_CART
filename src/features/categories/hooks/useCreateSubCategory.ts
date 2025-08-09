import { useMutation } from '@tanstack/react-query'
import { createNewSubCategory } from '../services/categoryService'

export const useCreateSubCategory = () => {
  return useMutation({
    mutationFn: createNewSubCategory,
  })
}
