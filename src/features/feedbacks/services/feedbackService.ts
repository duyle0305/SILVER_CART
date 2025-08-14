import { apiClient } from '@/lib/axios'
import type { FeedbackBodyParam, Feedback, RespondBodyParam } from '../types'
import type { BaseResponse } from '@/types/baseResponse.type'

export const getFeedbacks = async (
  body: FeedbackBodyParam,
  signal: AbortSignal
): Promise<BaseResponse<Feedback>> => {
  return apiClient.post<BaseResponse<Feedback>>('Feedback/Search', body, {
    signal,
  })
}

export const getFeedbackDetail = async (
  feedbackId: string,
  signal: AbortSignal
): Promise<Feedback> => {
  return apiClient.get<Feedback>(`Feedback/GetById`, {
    params: {
      id: feedbackId,
    },
    signal,
  })
}

export const respondToFeedback = async (
  body: RespondBodyParam
): Promise<void> => {
  return apiClient.put<void>(`Feedback/Respond`, body)
}
