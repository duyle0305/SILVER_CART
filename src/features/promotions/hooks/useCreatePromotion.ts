import { useMutation } from '@tanstack/react-query'
import { createPromotion } from '../services/promotionsService'
import type { CreatePromotionPayload } from '../types'

export const useCreatePromotion = () => {
  return useMutation({
    mutationFn: (payload: CreatePromotionPayload) => createPromotion(payload),
  })
}
