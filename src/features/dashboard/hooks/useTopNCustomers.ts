import { fetchTopNCustomers } from '@/features/dashboard/services/statisticService'
import { useQuery } from '@tanstack/react-query'

export const useTopNCustomers = (topN: number) => {
  return useQuery({
    queryKey: ['top-n-customers', topN],
    queryFn: ({ signal }) => fetchTopNCustomers(topN, signal),
    refetchOnWindowFocus: false,
  })
}
