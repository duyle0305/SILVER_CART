import { useMutation } from '@tanstack/react-query'
import { respondToFeedback } from '../services/feedbackService'
import type { RespondBodyParam } from '../types'

export const useRespondFeedback = () => {
  return useMutation({
    mutationFn: (payload: RespondBodyParam) => respondToFeedback(payload),
  })
}
