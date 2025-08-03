import { useQuery } from '@tanstack/react-query'
import { fetchStatisticCustomers } from '@/features/dashboard/services/statisticService'
import type { TimeFrame } from '@/features/dashboard/constants'

export const useStatisticsCustomers = (timeFrame: TimeFrame) => {
  return useQuery({
    queryKey: ['statistics-customers', timeFrame],
    queryFn: () => fetchStatisticCustomers(timeFrame),
    refetchOnWindowFocus: false,
  })
}
