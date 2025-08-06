import { useQuery } from '@tanstack/react-query'
import { fetchStatisticsProducts } from '@/features/dashboard/services/statisticService'
import type { TimeScope } from '@/features/dashboard/constants'

export const useStatisticsProducts = (timeFrame: TimeScope) => {
  return useQuery({
    queryKey: ['statistics-products', timeFrame],
    queryFn: ({ signal }) => fetchStatisticsProducts(timeFrame, signal),
    refetchOnWindowFocus: false,
  })
}
