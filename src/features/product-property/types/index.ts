export interface ProductPropertyValue {
  id: string
  code: string
  description: string
  label: string
  type: number
  childrenId: string | null
  childrentLabel: string | null
  isActive: boolean
}

export interface ProductProperty {
  id: string
  label: string
  note: string
  type: number
  values: ProductPropertyValue[]
}

export interface CreateListOfValueWithValuesBodyParam {
  label: string
  note: string
  values: {
    code: string
    label: string
    description: string
  }[]
}

export interface EditProductPropertyBodyParam {
  id: string
  label: string
  description?: string
  code: string
}
