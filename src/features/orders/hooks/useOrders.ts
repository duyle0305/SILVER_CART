import { useQuery } from '@tanstack/react-query'
import { getOrders } from '../services/ordersService'
import type { OrderQueryParams } from '../types'

export const useOrders = (queryParams: OrderQueryParams) => {
  return useQuery({
    queryKey: ['orders', queryParams],
    queryFn: async ({ signal }) => getOrders(queryParams, signal),
  })
}
