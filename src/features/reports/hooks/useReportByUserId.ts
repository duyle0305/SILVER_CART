import { useQuery } from '@tanstack/react-query'
import { getReportByUserId } from '../services/reportService'

export const useReportByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['reports', userId],
    queryFn: ({ signal }) => getReportByUserId(userId, signal),
  })
}
