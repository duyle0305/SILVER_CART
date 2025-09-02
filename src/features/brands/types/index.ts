export interface Brand {
  id: string
  code: string
  label: string
  description: string
  type: number
  isActive: boolean
}

export interface CreateBrandPayload {
  code: string
  label: string
  description: string
}
