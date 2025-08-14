import { useMutation } from '@tanstack/react-query'
import { UpdateReport } from '../services/reportService'
import type { UpdateReportBodyParam } from '../types'

export const useUpdateReport = () => {
  return useMutation({
    mutationFn: (data: UpdateReportBodyParam) => UpdateReport(data),
  })
}
