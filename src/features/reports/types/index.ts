export interface CreateReportBodyParam {
  title: string
  description: string
  userId: string
  consultantId: string
}

export interface UpdateReportBodyParam extends Partial<CreateReportBodyParam> {
  id: string
}
