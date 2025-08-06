import { useQuery } from '@tanstack/react-query'
import { fetchStatisticOrders } from '@/features/dashboard/services/statisticService'
import type { TimeScope } from '@/features/dashboard/constants'

export const useStatisticsOrders = (timeFrame: TimeScope) => {
  return useQuery({
    queryKey: ['statistics-orders', timeFrame],
    queryFn: ({ signal }) => fetchStatisticOrders(timeFrame, signal),
    refetchOnWindowFocus: false,
  })
}
