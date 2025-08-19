import { apiClient } from '@/lib/axios'
import type {
  CreateReportBodyParam,
  Report,
  ReportQueryParams,
  UpdateReportBodyParam,
} from '../types'
import type { BaseResponse } from '@/types/baseResponse.type'

export const createReport = async (data: CreateReportBodyParam) => {
  await apiClient.post('/Report/Create', data)
}

export const updateReport = async (data: UpdateReportBodyParam) => {
  await apiClient.put('/Report/Update', data)
}

export const getReports = async (
  data: ReportQueryParams,
  signal: AbortSignal
): Promise<BaseResponse<Report>> => {
  const response = await apiClient.post<BaseResponse<Report>>(
    '/Report/Search',
    data,
    {
      signal,
    }
  )
  return response
}

export const getReportDetails = async (
  id: string,
  signal: AbortSignal
): Promise<Report> => {
  const response = await apiClient.get<Report>(`/Report/GetById/`, {
    params: {
      id,
    },
    signal,
  })
  return response
}
