import { getSubCategoryDetails } from '@/features/categories/services/categoryService'
import { useQuery } from '@tanstack/react-query'

export function useSubCategoryDetails(id: string, subId: string) {
  return useQuery({
    queryKey: ['subCategoryDetails', id, subId],
    queryFn: ({ signal }) => getSubCategoryDetails(id, subId, signal),
  })
}
