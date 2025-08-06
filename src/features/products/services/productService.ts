import { apiClient } from '@/lib/axios'
import type {
  ProductData,
  ProductDataParam,
  ProductQueryParams,
} from '@/features/products/types'
import type { BaseResponse } from '@/types/baseResponse.type'

export const fetchProducts = async (
  params: ProductQueryParams,
  signal: AbortSignal
): Promise<BaseResponse<ProductData>> => {
  const response = await apiClient.get<BaseResponse<ProductData>>(
    'Product/GetAll',
    {
      params,
      signal,
    }
  )
  return response
}

export const createProduct = async (data: ProductDataParam) => {
  const response = await apiClient.post('Product/Create', data)
  return response
}
