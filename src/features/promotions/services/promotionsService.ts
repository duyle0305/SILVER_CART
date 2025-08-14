import type { BaseResponse } from '@/types/baseResponse.type'
import type {
  CreatePromotionPayload,
  Promotion,
  PromotionDetail,
  PromotionSearchParams,
  UpdatePromotionPayload,
} from '../types'
import { apiClient } from '@/lib/axios'

export const getPromotions = async (
  body: PromotionSearchParams,
  signal: AbortSignal
): Promise<BaseResponse<Promotion>> => {
  return apiClient.post<BaseResponse<Promotion>>('/Promotion/Search', body, {
    signal,
  })
}

export const removePromotion = async (id: string): Promise<void> => {
  await apiClient.delete(`/Promotion/Delete`, {
    params: {
      id,
    },
  })
}

export const getPromotionDetail = async (
  id: string,
  signal: AbortSignal
): Promise<PromotionDetail> => {
  return apiClient.get<PromotionDetail>(`/Promotion/GetById`, {
    params: {
      id,
    },
    signal,
  })
}

export const updatePromotion = async (
  payload: UpdatePromotionPayload
): Promise<void> => {
  await apiClient.put(`/Promotion/Update`, payload)
}

export const createPromotion = async (
  payload: CreatePromotionPayload
): Promise<void> => {
  await apiClient.post(`/Promotion/Create`, payload)
}
