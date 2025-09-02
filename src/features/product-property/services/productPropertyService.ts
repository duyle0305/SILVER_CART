import { apiClient } from '@/lib/axios'
import type {
  ProductPropertyValue,
  ProductProperty,
  CreateListOfValueWithValuesBodyParam,
  EditProductPropertyBodyParam,
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

export const deactiveOrActiveProductProperty = async (id: string) => {
  return await apiClient.put(
    '/ProductProperty/DeActivateOrActiveProductProperty',
    null,
    {
      params: {
        valueId: id,
      },
    }
  )
}

export const editProductProperty = async (
  body: EditProductPropertyBodyParam
) => {
  return await apiClient.put('/ProductProperty/EditProductProperty', body)
}

export const getProductPropertyDetail = async (
  id: string,
  signal: AbortSignal
) => {
  const response = await getAllValueProductProperty(signal)
  return response.find((item) => item.id === id)
}
