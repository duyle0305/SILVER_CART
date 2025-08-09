import { apiClient } from '@/lib/axios'
import type {
  ProductListItem,
  ProductSearchBody,
  ProductDetail,
  CreateProductPayload,
  ProductProperty,
} from '@/features/products/types'
import type { BaseResponse } from '@/types/baseResponse.type'

export const searchProducts = async (
  body: ProductSearchBody,
  signal: AbortSignal
): Promise<BaseResponse<ProductListItem>> => {
  const response = await apiClient.post<BaseResponse<ProductListItem>>(
    'Product/Search',
    body,
    {
      signal,
    }
  )
  return response
}

export const fetchProductById = async (
  productId: string,
  signal: AbortSignal
): Promise<ProductDetail> => {
  const response = await apiClient.get<ProductDetail>(
    `Product/GetById/${productId}`,
    { signal }
  )
  return response
}

export const createProduct = async (data: CreateProductPayload) => {
  await apiClient.post('Product/Create', data)
}

export const getAllValueProductProperty = async (
  signal: AbortSignal
): Promise<ProductProperty[]> => {
  const response = await apiClient.get<ProductProperty[]>(
    'ProductProperty/GetAllValueProductProperty',
    { signal }
  )
  return response
}

export const updateProduct = async (id: string, data: CreateProductPayload) => {
  await apiClient.put(`Product/Update/${id}`, data)
}
