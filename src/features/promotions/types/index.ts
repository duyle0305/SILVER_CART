export interface Promotion {
  id: string
  title: string
  description: string
  discountPercent: number
  requiredPoints: number
  startAt: string
  endAt: string
  isActive: boolean
  creationDate: string
}

export interface PromotionSearchParams {
  keyword?: string
  isActive?: boolean
  sortBy?: string
  sortAscending?: boolean
  page?: number
  pageSize?: number
}

export interface PromotionDetail {
  id: string
  title: string
  description: string
  discountPercent: number
  requiredPoints: number
  startAt: string
  endAt: string
  isActive: boolean
  creationDate: string
}

export interface UpdatePromotionPayload {
  id: string
  title?: string
  description?: string
  discountPercent?: number
  requiredPoints?: number
  startAt?: string
  endAt?: string
  isActive?: boolean
}

export interface CreatePromotionPayload {
  title: string
  description: string
  discountPercent: number
  requiredPoints: number
  startAt: string
  endAt: string
}
