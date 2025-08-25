import { useQuery } from '@tanstack/react-query'
import { getConnection } from '../services/videoCallService'

export const useGetConnection = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['connection', userId],
    queryFn: () => getConnection(userId),
    enabled: !!userId && enabled,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  })
}
