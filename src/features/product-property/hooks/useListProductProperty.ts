import { useQuery } from '@tanstack/react-query'
import { getListProductProperty } from '../services/productPropertyService'

export const useListProductProperty = () => {
  return useQuery({
    queryKey: ['listProductProperty'],
    queryFn: ({ signal }) => getListProductProperty(signal),
  })
}
