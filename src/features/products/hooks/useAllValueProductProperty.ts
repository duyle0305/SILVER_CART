import { useQuery } from '@tanstack/react-query'
import { getAllValueProductProperty } from '../services/productService'

export const useAllValueProductProperty = () => {
  return useQuery({
    queryKey: ['allValueProductProperty'],
    queryFn: ({ signal }) => getAllValueProductProperty(signal),
  })
}
