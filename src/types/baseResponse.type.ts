export interface BaseResponse<T> {
  page: number
  pageSize: number
  totalItems: number
  items: T[]
}
