import { fetchCurrentStatistic } from '@/features/dashboard/services/statisticService'
import { useQuery } from '@tanstack/react-query'

export const useCurrentStatistic = () => {
  return useQuery({
    queryKey: ['current-statistic'],
    queryFn: () => fetchCurrentStatistic(),
    refetchOnWindowFocus: false,
  })
}
