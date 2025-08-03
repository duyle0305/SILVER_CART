import type { SortType } from '@/constants'
import { CategoryStatus } from '@/features/categories/constants'
import { fetchCategories } from '@/features/categories/services/categoryService'
import type { CategoryQueryParams } from '@/features/categories/types'
import { useQuery } from '@tanstack/react-query'

interface UseCategoriesParams {
  page?: number
  pageSize?: number
  order?: SortType
  orderBy?: string
  keyword?: string
  status?: CategoryStatus
}

export function useCategories({
  page = 0,
  pageSize,
  order,
  orderBy,
  keyword,
}: UseCategoriesParams) {
  const queryParams: CategoryQueryParams = {
    'PagingRequest.Page': page + 1,
    'PagingRequest.PageSize': pageSize,
    'PagingRequest.SortType': order,
    'PagingRequest.ColName': orderBy,
    keyword: keyword,
  }

  return useQuery({
    queryKey: ['categories', queryParams],
    queryFn: () => fetchCategories(queryParams),
    refetchOnWindowFocus: false,
  })
}
