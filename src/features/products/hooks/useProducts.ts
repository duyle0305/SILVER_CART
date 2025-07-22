import type { SortType } from '@/constants'
import {
  fetchProducts,
  type ProductQueryParams,
} from '@/features/products/services/productService'
import { useQuery } from '@tanstack/react-query'

interface UseProductsParams {
  page: number
  pageSize: number
  order: SortType
  orderBy: string
  keyword: string
  productType?: string
}

// const mapQueryParams = (params: UseProductsParams) => {
//   const
// }

export function useProducts({
  page,
  pageSize,
  order,
  orderBy,
  keyword,
  productType,
}: UseProductsParams) {
  const queryParams: ProductQueryParams = {
    'PagingRequest.Page': page + 1,
    'PagingRequest.PageSize': pageSize,
    'PagingRequest.SortType': order,
    'PagingRequest.ColName': orderBy,
    ProductName: keyword,
    ProductType: productType,
  }

  return useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => fetchProducts(queryParams),
    refetchOnWindowFocus: false,
  })
}
