import { apiClient } from '@/lib/axios'
import type { Brand, CreateBrandPayload } from '../types'

export const getListValueBrand = async (
  signal: AbortSignal
): Promise<Brand[]> => {
  const response = await apiClient.get<Brand[]>('/Brand/GetListValueBrand', {
    signal,
  })
  return response
}

export const createValueOfBrandRoot = async (
  data: CreateBrandPayload[]
): Promise<void> => {
  await apiClient.post('/Brand/CreateValueOfBrandRoot', data)
}
