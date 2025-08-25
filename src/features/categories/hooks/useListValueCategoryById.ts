import { useQuery } from '@tanstack/react-query'
import { getListValueCategoryById } from '../services/categoryService'

export const useListValueCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['listValueCategoryById', id],
    queryFn: ({ signal }) => getListValueCategoryById(id, signal),
  })
}
