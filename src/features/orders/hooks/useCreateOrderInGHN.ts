import { useNotification } from '@/hooks/useNotification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOrderInGHN } from '../services/ordersService'

export const useCreateOrderInGHN = () => {
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string }) => createOrderInGHN(orderId),
    onSuccess: () => {
      showNotification('Order status changed successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['orderDetail'] })
    },
    onError: (error: Error) => {
      showNotification(
        error.message || 'Failed to change order status',
        'error'
      )
    },
  })
}
