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

export const deactiveOrActiveBrand = async (id: string) => {
  await apiClient.put(`/Brand/DeActivateOrActiveBrand`, null, {
    params: {
      valueId: id,
    },
  })
}

export const editBrand = async (data: CreateBrandPayload & { id: string }) => {
  await apiClient.put(`/Brand/EditBrand`, data)
}

export const getBrandDetails = async (id: string, signal: AbortSignal) => {
  const response = await getListValueBrand(signal)
  return response.find((brand) => brand.id === id)
}
