import { useQuery } from '@tanstack/react-query'
import { getAllValueProductProperty } from '../services/productPropertyService'

export const useAllValueProductProperty = () => {
  return useQuery({
    queryKey: ['allValueProductProperty'],
    queryFn: ({ signal }) => getAllValueProductProperty(signal),
  })
}
