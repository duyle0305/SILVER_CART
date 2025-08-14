import type { FeedbackStatus } from '../constants'

export interface FeedbackBodyParam {
  keyword?: string
  status?: FeedbackStatus
  userId: string | null
  sortBy?: string
  sortAscending?: boolean
  page?: number
  pageSize?: number
}

export interface Feedback {
  id: string
  title: string
  description: string
  imagePath: string
  userId: string
  adminId: string
  status: number
  responseMessage: string | null
  responseAttachment: string | null
  respondedAt: string | null
}

export interface RespondBodyParam {
  feedbackId: string
  responseMessage: string
  responseAttachment: string | null
}
