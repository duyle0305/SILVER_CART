export interface SubCategory extends RootCategory {}

export interface RootCategory {
  id: string
  code: string
  label: string
  description: string
  type: number
  childrenId: string
  childrentLabel: string
}

export interface Category {
  id: string
  label: string
  note: string
  type: number
  values: SubCategory[]
}

export interface LeafNodesWithPaths {
  valueId: string
  code: string
  label: string
  description: string
  type: number
  path: string[]
}

export interface SubCategoryCreateBodyParam {
  label: string
  note: string
  values: {
    code: string
    label: string
    description: string
  }[]
}

export interface CategoryRootCreateBodyParam {
  code: string
  label: string
  description: string
}

export interface LinkCategoryWithSubCategoryBodyParam {
  categoryId: string
  subCategoryId: string | null
}

export interface CategoryNoValue {
  id: string
  label: string
  note: string
  type: number
}
