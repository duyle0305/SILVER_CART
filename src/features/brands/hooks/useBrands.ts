import { useQuery } from '@tanstack/react-query'
import { getListValueBrand } from '../services/brandService'

export const useBrands = () => {
  return useQuery({
    queryKey: ['brands'],
    queryFn: ({ signal }) => getListValueBrand(signal),
    refetchOnWindowFocus: false,
  })
}
