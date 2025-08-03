import { useQuery } from '@tanstack/react-query'
import { fetchStatisticRevenues } from '@/features/dashboard/services/statisticService'
import type { TimeFrame } from '@/features/dashboard/constants'

export const useStatisticsRevenues = (timeFrame: TimeFrame) => {
  return useQuery({
    queryKey: ['statistics-revenues', timeFrame],
    queryFn: () => fetchStatisticRevenues(timeFrame),
    refetchOnWindowFocus: false,
  })
}
