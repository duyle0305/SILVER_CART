import type { SortType } from '@/constants'
import { apiClient } from '@/lib/axios'

export interface ProductData {
  id: number
  name: string
  productType: string
  category: string
  stock: number
  originalPrice: number
  discountPrice: number
}

interface ProductsResponse {
  results: ProductData[]
  totalNumberOfPages: number
  totalNumberOfRecords: number
  pageNumber: number
  pageSize: number
}

export interface ProductQueryParams {
  'PagingRequest.Page'?: number
  'PagingRequest.PageSize'?: number
  'PagingRequest.SortType'?: SortType
  'PagingRequest.ColName'?: string
  ProductName?: string
  ProductType?: string
}

export const fetchProducts = async (
  params: ProductQueryParams
): Promise<ProductsResponse> => {
  const response = await apiClient.get<ProductsResponse>('Product', { params })
  return response
}
