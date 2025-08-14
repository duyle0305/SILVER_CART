import { apiClient } from '@/lib/axios'
import type { CreateReportBodyParam, UpdateReportBodyParam } from '../types'

export const CreateReport = async (data: CreateReportBodyParam) => {
  await apiClient.post('/Report/Create', data)
}

export const UpdateReport = async (data: UpdateReportBodyParam) => {
  await apiClient.put('/Report/Update', data)
}
