import { useMutation } from '@tanstack/react-query'
import { createListOfValueWithValues } from '../services/productPropertyService'

export const useCreateListOfValueWithValues = () => {
  return useMutation({
    mutationFn: createListOfValueWithValues,
  })
}
