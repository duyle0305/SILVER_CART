import { useQuery } from '@tanstack/react-query'
import { getProductPropertyDetail } from '../services/productPropertyService'

export const useProductPropertyDetail = (id: string) => {
  return useQuery({
    queryKey: ['productPropertyDetail', id],
    queryFn: ({ signal }) => getProductPropertyDetail(id, signal),
  })
}
