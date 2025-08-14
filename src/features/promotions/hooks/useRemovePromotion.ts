import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removePromotion } from '../services/promotionsService'

export const useRemovePromotion = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => removePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] })
    },
  })
}
