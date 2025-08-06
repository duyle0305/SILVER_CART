import { useQuery } from '@tanstack/react-query'
import { fetchStatisticCustomers } from '@/features/dashboard/services/statisticService'
import type { TimeScope } from '@/features/dashboard/constants'

export const useStatisticsCustomers = (timeFrame: TimeScope) => {
  return useQuery({
    queryKey: ['statistics-customers', timeFrame],
    queryFn: ({ signal }) => fetchStatisticCustomers(timeFrame, signal),
    refetchOnWindowFocus: false,
  })
}
