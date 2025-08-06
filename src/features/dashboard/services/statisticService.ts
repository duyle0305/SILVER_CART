import { TimeScope } from '@/features/dashboard/constants'
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
  timeScope: TimeScope,
  signal: AbortSignal
): Promise<StatisticProduct[]> => {
  const response = await apiClient.get<StatisticProduct[]>(
    'Statistic/TotalProducts',
    {
      params: { timeScope },
      signal,
    }
  )
  return response
}

export const fetchStatisticCustomers = async (
  timeScope: TimeScope,
  signal: AbortSignal
): Promise<StatisticCustomers[]> => {
  const response = await apiClient.get<StatisticCustomers[]>(
    'Statistic/TotalCustomers',
    {
      params: { timeScope },
      signal,
    }
  )
  return response
}

export const fetchStatisticOrders = async (
  timeScope: TimeScope,
  signal: AbortSignal
): Promise<StatisticOrders[]> => {
  const response = await apiClient.get<StatisticOrders[]>(
    'Statistic/TotalOrders',
    {
      params: { timeScope },
      signal,
    }
  )
  return response
}

export const fetchStatisticRevenues = async (
  timeFrame: TimeScope,
  signal: AbortSignal
): Promise<StatisticRevenues[]> => {
  const response = await apiClient.get<StatisticRevenues[]>(
    'Statistic/TotalRevenues',
    {
      params: { timeScope: timeFrame },
      signal,
    }
  )

  return response
}

export const fetchTopNProducts = async (
  topN: number,
  signal: AbortSignal
): Promise<TopNProductsResponse> => {
  const response = await apiClient.get<TopNProductsResponse>(
    'Statistic/TopNProducts',
    {
      params: { topN: topN },
      signal,
    }
  )
  return response
}

export const fetchTopNCustomers = async (
  topN: number,
  signal: AbortSignal
): Promise<TopNCustomersResponse> => {
  const response = await apiClient.get<TopNCustomersResponse>(
    'Statistic/TopNCustomers',
    {
      params: { topN: topN },
      signal,
    }
  )
  return response
}

export const fetchCurrentStatistic = async (
  signal: AbortSignal
): Promise<CurrentStatisticResponse> => {
  const response = await apiClient.get<CurrentStatisticResponse>(
    'Statistic/CurrentStatistics',
    { signal }
  )
  return response
}
