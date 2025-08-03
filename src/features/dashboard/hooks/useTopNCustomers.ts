import { fetchTopNCustomers } from '@/features/dashboard/services/statisticService'
import { useQuery } from '@tanstack/react-query'

export const useTopNCustomers = (topN: number) => {
  return useQuery({
    queryKey: ['top-n-customers', topN],
    queryFn: () => fetchTopNCustomers(topN),
    refetchOnWindowFocus: false,
  })
}
