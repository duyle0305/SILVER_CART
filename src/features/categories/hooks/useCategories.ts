import { getCategories } from '@/features/categories/services/categoryService'
import { useQuery } from '@tanstack/react-query'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getCategories(signal),
    refetchOnWindowFocus: false,
  })
}
