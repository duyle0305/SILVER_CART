export interface BaseResponse<T> {
  pageNumber: number
  pageSize: number
  totalNumberOfPages: number
  totalNumberOfRecords: number
  results: T[]
}
