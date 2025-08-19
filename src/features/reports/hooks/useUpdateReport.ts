import { useMutation } from '@tanstack/react-query'
import { updateReport } from '../services/reportService'
import type { UpdateReportBodyParam } from '../types'

export const useUpdateReport = () => {
  return useMutation({
    mutationFn: (data: UpdateReportBodyParam) => updateReport(data),
  })
}
