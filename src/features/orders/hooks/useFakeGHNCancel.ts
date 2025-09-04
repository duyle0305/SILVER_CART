import { useNotification } from '@/hooks/useNotification'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fakeCancelOrderGHN } from '../services/ordersService'

export const useFakeGHNCanceledOrder = () => {
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      fakeCancelOrderGHN(orderId),
    onSuccess: () => {
      showNotification('Order status canceled successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['orderDetail'] })
    },
    onError: (error: Error) => {
      showNotification(
        error.message || 'Failed to cancel order status',
        'error'
      )
    },
  })
}
