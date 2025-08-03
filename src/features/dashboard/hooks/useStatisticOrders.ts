import { useQuery } from '@tanstack/react-query'
import { fetchStatisticOrders } from '@/features/dashboard/services/statisticService'
import type { TimeFrame } from '@/features/dashboard/constants'

export const useStatisticsOrders = (timeFrame: TimeFrame) => {
  return useQuery({
    queryKey: ['statistics-orders', timeFrame],
    queryFn: () => fetchStatisticOrders(timeFrame),
    refetchOnWindowFocus: false,
  })
}
