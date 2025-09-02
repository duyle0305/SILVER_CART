import { useQuery } from '@tanstack/react-query'
import { getBrandDetails } from '../services/brandService'

export const useBrandDetails = (id: string) => {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: ({ signal }) => getBrandDetails(id, signal),
  })
}
