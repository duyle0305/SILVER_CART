import { useQuery } from '@tanstack/react-query'
import { fetchStatisticsProducts } from '@/features/dashboard/services/statisticService'
import type { TimeFrame } from '@/features/dashboard/constants'

export const useStatisticsProducts = (timeFrame: TimeFrame) => {
  return useQuery({
    queryKey: ['statistics-products', timeFrame],
    queryFn: () => fetchStatisticsProducts(timeFrame),
    refetchOnWindowFocus: false,
  })
}
