export interface CreateReportBodyParam {
  title: string
  description: string
  userId: string
  consultantId: string
}

export interface UpdateReportBodyParam extends Partial<CreateReportBodyParam> {
  id: string
}

export interface ReportQueryParams {
  keyword: string
  page: number
  pageSize: number
  sortBy: string
  sortAscending: boolean
  consultantId?: string
}

export interface Report {
  id: string
  title: string
  description: string
  userId: string
  consultantId: string
}
