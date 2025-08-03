export interface StatisticProduct {
  timePeriod: string
  totalProducts: number
}

export interface StatisticCustomers {
  timePeriod: string
  totalCustomers: number
}

export interface StatisticOrders {
  timePeriod: string
  totalOrders: number
}

export interface StatisticRevenues {
  timePeriod: string
  totalRevenues: number
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
