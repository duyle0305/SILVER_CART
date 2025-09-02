import { getRootCategoryDetails } from '@/features/categories/services/categoryService'
import { useQuery } from '@tanstack/react-query'

export function useRootCategoryDetails(id: string) {
  return useQuery({
    queryKey: ['rootCategoryDetails', id],
    queryFn: ({ signal }) => getRootCategoryDetails(id, signal),
  })
}
