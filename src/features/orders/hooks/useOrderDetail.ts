import { useQuery } from '@tanstack/react-query'
import { getOrderDetail } from '../services/ordersService'

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: async ({ signal }) => getOrderDetail(orderId, signal),
  })
}
