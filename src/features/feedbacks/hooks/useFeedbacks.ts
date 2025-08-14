import { useQuery } from '@tanstack/react-query'
import { getFeedbacks } from '../services/feedbackService'
import type { FeedbackBodyParam } from '../types'
import type { FeedbackStatus } from '../constants'

interface UseFeedbacksProps {
  keyword?: string
  status?: FeedbackStatus
  sortBy?: string
  sortAscending?: boolean
  page?: number
  pageSize?: number
  userId: string | null
}

export const useFeedbacks = ({
  keyword,
  status,
  sortBy,
  sortAscending,
  page,
  pageSize,
  userId,
}: UseFeedbacksProps) => {
  const query: FeedbackBodyParam = {
    keyword,
    status,
    sortBy,
    sortAscending,
    page,
    pageSize,
    userId,
  }

  return useQuery({
    queryKey: ['feedbacks', query],
    queryFn: ({ signal }) => getFeedbacks(query, signal),
  })
}
