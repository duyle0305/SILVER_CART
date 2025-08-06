import type { Category, CategoryQueryParams } from '@/features/categories/types'
import { apiClient } from '@/lib/axios'
import type { BaseResponse } from '@/types/baseResponse.type'

export const fetchCategories = async (
  params: CategoryQueryParams,
  signal: AbortSignal
): Promise<BaseResponse<Category>> => {
  const response = await apiClient.get<BaseResponse<Category>>('Category', {
    params,
    signal,
  })
  return response
}
