import { useQuery } from '@tanstack/react-query'
import { getListCategoryNoValue } from '../services/categoryService'

export const useCategoriesNoValue = () => {
  return useQuery({
    queryKey: ['categories-no-value'],
    queryFn: ({ signal }) => getListCategoryNoValue(signal),
    refetchOnWindowFocus: false,
  })
}
