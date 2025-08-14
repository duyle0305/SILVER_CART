import { useQuery } from '@tanstack/react-query'
import { getPromotions } from '../services/promotionsService'
import type { PromotionSearchParams } from '../types'

export function usePromotions(queryParams: PromotionSearchParams) {
  return useQuery({
    queryKey: ['promotions', queryParams],
    queryFn: ({ signal }) => getPromotions(queryParams, signal),
  })
}
