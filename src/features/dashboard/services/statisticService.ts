import { TimeFrame } from '@/features/dashboard/constants'
import { apiClient } from '@/lib/axios'
import type {
  CurrentStatisticResponse,
  StatisticCustomers,
  StatisticOrders,
  StatisticProduct,
  StatisticRevenues,
  TopNCustomersResponse,
  TopNProductsResponse,
} from '../types'

export const fetchStatisticsProducts = async (
  timeFrame: TimeFrame
): Promise<StatisticProduct[]> => {
  const response = await apiClient.get<StatisticProduct[]>(
    'Statistic/total-products',
    {
      params: { TimeFrame: timeFrame },
    }
  )
  return response
}

export const fetchStatisticCustomers = async (
  timeFrame: TimeFrame
): Promise<StatisticCustomers[]> => {
  const response = await apiClient.get<StatisticCustomers[]>(
    'Statistic/total-customers',
    {
      params: { TimeFrame: timeFrame },
    }
  )
  return response
}

export const fetchStatisticOrders = async (
  timeFrame: TimeFrame
): Promise<StatisticOrders[]> => {
  const response = await apiClient.get<StatisticOrders[]>(
    'Statistic/total-orders',
    {
      params: { TimeFrame: timeFrame },
    }
  )
  return response
}

export const fetchStatisticRevenues = async (
  timeFrame: TimeFrame
): Promise<StatisticRevenues[]> => {
  const response = await apiClient.get<StatisticRevenues[]>(
    'Statistic/total-revenues',
    {
      params: { TimeFrame: timeFrame },
    }
  )
  return response
}

export const fetchTopNProducts = async (
  topN: number
): Promise<TopNProductsResponse> => {
  const response = await apiClient.get<TopNProductsResponse>(
    'Statistic/top-n-products',
    {
      params: { TopN: topN },
    }
  )
  return response
}

export const fetchTopNCustomers = async (
  topN: number
): Promise<TopNCustomersResponse> => {
  const response = await apiClient.get<TopNCustomersResponse>(
    'Statistic/top-n-customers',
    {
      params: { TopN: topN },
    }
  )
  return response
}

export const fetchCurrentStatistic =
  async (): Promise<CurrentStatisticResponse> => {
    const response = await apiClient.get<CurrentStatisticResponse>(
      'Statistic/current-statistics'
    )
    return response
  }
