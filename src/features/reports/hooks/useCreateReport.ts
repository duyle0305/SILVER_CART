import { useMutation } from '@tanstack/react-query'
import { createReport } from '../services/reportService'
import type { CreateReportBodyParam } from '../types'

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (data: CreateReportBodyParam) => createReport(data),
  })
}
