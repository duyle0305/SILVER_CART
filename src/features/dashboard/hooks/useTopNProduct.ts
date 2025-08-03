import { fetchTopNProducts } from '@/features/dashboard/services/statisticService'
import { useQuery } from '@tanstack/react-query'

export const useTopNProducts = (topN: number) => {
  return useQuery({
    queryKey: ['top-n-products', topN],
    queryFn: () => fetchTopNProducts(topN),
    refetchOnWindowFocus: false,
  })
}
