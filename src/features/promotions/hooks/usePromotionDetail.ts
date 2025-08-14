import { useQuery } from '@tanstack/react-query'
import { getPromotionDetail } from '../services/promotionsService'

export function usePromotionDetail(id: string) {
  return useQuery({
    queryKey: ['promotion', id],
    queryFn: ({ signal }) => getPromotionDetail(id, signal),
    refetchOnWindowFocus: false,
  })
}
