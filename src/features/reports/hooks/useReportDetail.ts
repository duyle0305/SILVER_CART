import { useQuery } from '@tanstack/react-query'
import { getReportDetails } from '../services/reportService'

export const useReportDetail = (id: string) => {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: ({ signal }) => getReportDetails(id, signal),
  })
}
