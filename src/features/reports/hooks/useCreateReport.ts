import { useMutation } from '@tanstack/react-query'
import { CreateReport } from '../services/reportService'
import type { CreateReportBodyParam } from '../types'

export const useCreateReport = () => {
  return useMutation({
    mutationFn: (data: CreateReportBodyParam) => CreateReport(data),
  })
}
