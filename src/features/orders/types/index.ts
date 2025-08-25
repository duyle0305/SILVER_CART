import type { OrderStatus } from '../constants'

export interface OrderDetail {
  id: string
  productName: string
  price: number
  quantity: number
  discount: number
  style: string | null
  images: string[]
}

export interface Order {
  id: string
  note: string
  totalPrice: number
  discount: number
  orderStatus: string
  phoneNumber: string
  streetAddress: string
  wardName: string
  districtName: string
  provinceName: string
  customerName: string | null
  elderName: string
  orderDetails: OrderDetail[]
  creationDate: string
}

export interface OrderQueryParams {
  orderStatus: OrderStatus | null
  sortBy: string
  isDescending: boolean
  page: number
  pageSize: number
}
