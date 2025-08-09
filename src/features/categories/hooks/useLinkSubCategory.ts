import { useMutation, useQueryClient } from '@tanstack/react-query'
import { linkCategoryWithSubCategory } from '../services/categoryService'

export const useLinkSubCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: linkCategoryWithSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
