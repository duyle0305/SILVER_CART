import { apiClient } from '@/lib/axios'
import type {
  ProductPropertyValue,
  ProductProperty,
  CreateListOfValueWithValuesBodyParam,
} from '../types'

export const getListProductProperty = async (
  signal: AbortSignal
): Promise<ProductProperty[]> => {
  return await apiClient.get<ProductProperty[]>(
    '/ProductProperty/GetListProductProperty',
    {
      signal,
    }
  )
}

export const getAllValueProductProperty = async (
  signal: AbortSignal
): Promise<ProductPropertyValue[]> => {
  return await apiClient.get<ProductPropertyValue[]>(
    'ProductProperty/GetAllValueProductProperty',
    { signal }
  )
}

export const createListOfValueWithValues = async (
  body: CreateListOfValueWithValuesBodyParam
) => {
  return await apiClient.post(
    '/ProductProperty/CreateListOfValueWithValues',
    body
  )
}
