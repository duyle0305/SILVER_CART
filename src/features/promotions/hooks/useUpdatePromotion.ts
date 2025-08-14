import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePromotion } from '../services/promotionsService'
import type { UpdatePromotionPayload } from '../types'

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdatePromotionPayload) => updatePromotion(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotion'] })
    },
  })
}
