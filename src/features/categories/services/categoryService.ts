import type {
  Category,
  CategoryNoValue,
  CategoryRootCreateBodyParam,
  LeafNodesWithPaths,
  LinkCategoryWithSubCategoryBodyParam,
  RootCategory,
  SubCategoryCreateBodyParam,
} from '@/features/categories/types'
import { apiClient } from '@/lib/axios'

export const getCategories = async (
  signal: AbortSignal
): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>('Category/GetListCategory', {
    signal,
  })
  return response
}

export const getLeafNodesWithPaths = async (
  signal: AbortSignal
): Promise<LeafNodesWithPaths[]> => {
  const response = await apiClient.get<LeafNodesWithPaths[]>(
    'Category/GetLeafNodesWithPaths',
    {
      signal,
    }
  )

  return response
}

export const getListCategoryNoValue = async (
  signal: AbortSignal
): Promise<CategoryNoValue[]> => {
  const response = await apiClient.get<CategoryNoValue[]>(
    'Category/GetListCategoryNoValue',
    {
      signal,
    }
  )
  return response
}

export const createNewSubCategory = async (
  data: SubCategoryCreateBodyParam
): Promise<void> => {
  await apiClient.post('Category/CreateListSubCategory', data)
}

export const createValueOfCategoryRoot = async (
  data: CategoryRootCreateBodyParam[]
): Promise<void> => {
  await apiClient.post('Category/CreateValueOfCategoryRoot', data)
}

export const linkCategoryWithSubCategory = async (
  data: LinkCategoryWithSubCategoryBodyParam
): Promise<void> => {
  await apiClient.put('Category/LinkCategoryWithSubCategory', data)
}

export const getRootListValueCategory = async (
  signal: AbortSignal
): Promise<RootCategory[]> => {
  return await apiClient.get<RootCategory[]>(
    'Category/GetRootListValueCategory',
    {
      signal,
    }
  )
}

export const getListValueCategoryById = async (
  id: string,
  signal: AbortSignal
) => {
  return await apiClient.get<RootCategory[]>(
    'Category/GetListValueCategoryById',
    {
      params: { id },
      signal,
    }
  )
}
