import { useQuery } from '@tanstack/react-query'
import { getLeafNodesWithPaths } from '../services/categoryService'

export const useLeafCategories = () => {
  return useQuery({
    queryKey: ['leafCategories'],
    queryFn: ({ signal }) => getLeafNodesWithPaths(signal),
  })
}
