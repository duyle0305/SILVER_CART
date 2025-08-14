import { useQuery } from '@tanstack/react-query'
import { getFeedbackDetail } from '../services/feedbackService'

export const useFeedbackDetail = (id: string) => {
  return useQuery({
    queryKey: ['feedbacks', id],
    queryFn: ({ signal }) => getFeedbackDetail(id, signal),
  })
}
