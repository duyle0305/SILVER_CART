import { useQuery } from '@tanstack/react-query'
import { fetchRoles } from '../services/roleService'

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: ({ signal }) => fetchRoles(signal),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })
}
