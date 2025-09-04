import { getConsultantStatus } from '@/features/users/services/userService'
import { useQuery } from '@tanstack/react-query'

export function useGetConsultantStatus(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: ['consultantStatus', id],
    queryFn: ({ signal }) => getConsultantStatus(id, signal),
    enabled: enabled,
  })
}
