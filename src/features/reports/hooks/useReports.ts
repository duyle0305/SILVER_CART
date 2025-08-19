import { useQuery } from '@tanstack/react-query'
import { getReports } from '../services/reportService'
import type { ReportQueryParams } from '../types'

export const useReports = (queryParams: ReportQueryParams) => {
  return useQuery({
    queryKey: ['reports', queryParams],
    queryFn: ({ signal }) => getReports(queryParams, signal),
  })
}
