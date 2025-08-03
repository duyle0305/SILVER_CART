import type { SortType } from '@/constants'
import type { CategoryStatus } from '@/features/categories/constants'

export interface Category {
  id: string
  name: string
  description: string
  status: CategoryStatus
  parentCategoryId?: string
  parentCategoryName?: string
  creationDate: string
  productCount: number
}

export interface CategoryQueryParams {
  'PagingRequest.Page'?: number
  'PagingRequest.PageSize'?: number
  'PagingRequest.SortType'?: SortType
  'PagingRequest.ColName'?: string
  keyword?: string
  Status?: CategoryStatus
}
