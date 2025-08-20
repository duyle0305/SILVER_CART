import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changeStatusOrder } from '../services/ordersService'
import { useNotification } from '@/hooks/useNotification'

export const useChangeStatusOrder = () => {
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId }: { orderId: string }) =>
      changeStatusOrder(orderId),
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
