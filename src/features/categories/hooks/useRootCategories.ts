import { useQuery } from '@tanstack/react-query'
import { getRootListValueCategory } from '../services/categoryService'

export const useRootCategories = () => {
  return useQuery({
    queryKey: ['rootCategories'],
    queryFn: ({ signal }) => getRootListValueCategory(signal),
  })
}
