import { useMutation } from '@tanstack/react-query'
import { createValueOfCategoryRoot } from '../services/categoryService'

export const useCreateRootCategory = () => {
  return useMutation({
    mutationFn: createValueOfCategoryRoot,
  })
}
