import { useQuery } from '@tanstack/react-query'
import { fetchStatisticRevenues } from '@/features/dashboard/services/statisticService'
import type { TimeScope } from '@/features/dashboard/constants'

export const useStatisticsRevenues = (timeFrame: TimeScope) => {
  return useQuery({
    queryKey: ['statistics-revenues', timeFrame],
    queryFn: ({ signal }) => fetchStatisticRevenues(timeFrame, signal),
    refetchOnWindowFocus: false,
  })
}
