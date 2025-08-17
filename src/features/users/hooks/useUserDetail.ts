import { fetchUserDetail } from '@/features/users/services/userService'
import { useQuery } from '@tanstack/react-query'

export function useUserDetail(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: ['userDetail', id],
    queryFn: ({ signal }) => fetchUserDetail(id, signal),
    refetchOnWindowFocus: false,
    enabled: enabled ?? !!id,
  })
}
