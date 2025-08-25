export interface StatisticProduct {
  timePeriod: string
  count: number
}

export interface StatisticCustomers {
  timePeriod: string
  count: number
}

export interface StatisticOrders {
  timePeriod: string
  count: number
}

export interface StatisticRevenues {
  timePeriod: string
  count: number
}

export interface ProductItem {
  productName: string
  totalQuantity: number
  totalRevenue: number
}

export interface CustomerItem {
  customerName: string
  totalOrders: number
}

export interface TopNCustomersResponse {
  customerItems: CustomerItem[]
}

export interface TopNProductsResponse {
  productItems: ProductItem[]
}

export interface CurrentStatisticResponse {
  revenueStatisticResponse: {
    totalRevenue: number
    totalRevenueLastMonth: number
    percentageCompareLastMonth: number
  }
  orderStatisticResponse: {
    totalOrders: number
    totalOrdersLastMonth: number
    percentageCompareLastMonth: number
  }
  userStatisticResponse: {
    totalUsers: number
    totalUsersLastMonth: number
    percentageCompareLastMonth: number
  }
}

export interface PaymentHistoryBodyParam {
  startDate: string
  endDate: string
  userId: string | null
  page: number
  pageSize: number
}

export interface PaymentHistoryItem {
  id: string
  amount: number
  userId: string
  userName: string
  avatar: string | null
  paymentMenthod: string
  paymentStatus: number
  creationDate: string
  orderId: string
}
