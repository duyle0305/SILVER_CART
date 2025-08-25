import type { BaseResponse } from '@/types/baseResponse.type'
import type { Order, OrderQueryParams } from '../types'
import { apiClient } from '@/lib/axios'

export const getOrders = async (
  payload: OrderQueryParams,
  signal: AbortSignal
): Promise<BaseResponse<Order>> => {
  return apiClient.post<BaseResponse<Order>>('Order/SearchOrders', payload, {
    signal,
  })
}

export const getOrderDetail = async (
  orderId: string,
  signal: AbortSignal
): Promise<Order> => {
  return apiClient.get<Order>(`Order/GetById/${orderId}`, {
    signal,
  })
}

export const fakeGHNChangeStatus = async (orderId: string) => {
  await apiClient.post(`Shipping/${orderId}/FakeGHNChangeStatus`)
}

export const createOrderInGHN = async (orderId: string) => {
  await apiClient.post(`Shipping/${orderId}/CreateOrderInGHN`)
}
