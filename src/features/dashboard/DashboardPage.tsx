import MetricCard from '@/features/dashboard/components/MetricCard'
import StatisticChart from '@/features/dashboard/components/StatisticChart'
import TopCustomersTable from '@/features/dashboard/components/TopCustomersTable'
import TopProductsTable from '@/features/dashboard/components/TopProductsTable'
import { TimeScope } from '@/features/dashboard/constants'
import { useCurrentStatistic } from '@/features/dashboard/hooks/useCurrentStatistic'
import { useStatisticsOrders } from '@/features/dashboard/hooks/useStatisticOrders'
import { useStatisticsRevenues } from '@/features/dashboard/hooks/useStatisticRevenues'
import { useStatisticsCustomers } from '@/features/dashboard/hooks/useStatisticsCustomers'
import { useStatisticsProducts } from '@/features/dashboard/hooks/useStatisticsProducts'
import { useTopNCustomers } from '@/features/dashboard/hooks/useTopNCustomers'
import { useTopNProducts } from '@/features/dashboard/hooks/useTopNProduct'
import {
  BestSellingWrapper,
  DashboardWrapper,
} from '@/features/dashboard/styles/Dashboard.styles'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import LocalMallIcon from '@mui/icons-material/LocalMall'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { Divider, Grid, Skeleton, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

const metrics = [
  {
    title: 'Total Revenue',
    icon: <CurrencyExchangeIcon color="primary" />,
    key: 'revenueStatisticResponse',
    value: 'totalRevenueLastMonth',
  },
  {
    title: 'Total Orders',
    icon: <LocalMallIcon color="primary" />,
    key: 'orderStatisticResponse',
    value: 'totalOrdersLastMonth',
  },
  {
    title: 'Total Users',
    icon: <PeopleAltIcon color="primary" />,
    key: 'userStatisticResponse',
    value: 'totalUsersLastMonth',
  },
]

const formatTimePeriod = (timePeriod: string, timeScope: TimeScope) => {
  if (timeScope === TimeScope.YEAR) {
    return dayjs(timePeriod).format('MMM')
  }
  return dayjs(timePeriod).format('DD-MM')
}

const DashboardPage = () => {
  const [timeFrames, setTimeFrames] = useState<{
    customers: TimeScope
    products: TimeScope
    orders: TimeScope
    revenues: TimeScope
  }>({
    customers: TimeScope.WEEK,
    products: TimeScope.WEEK,
    orders: TimeScope.WEEK,
    revenues: TimeScope.WEEK,
  })
  const TOP_N_PRODUCTS = 10
  const TOP_N_CUSTOMERS = 10

  const { data: productsData = [], isLoading: isLoadingProducts } =
    useStatisticsProducts(timeFrames.products)
  const { data: customerData = [], isLoading: isLoadingCustomers } =
    useStatisticsCustomers(timeFrames.customers)
  const { data: ordersData = [], isLoading: isLoadingOrders } =
    useStatisticsOrders(timeFrames.orders)
  const { data: revenuesData = [], isLoading: isLoadingRevenues } =
    useStatisticsRevenues(timeFrames.revenues)
  const { data: topNProducts, isLoading: isLoadingTopNProducts } =
    useTopNProducts(TOP_N_PRODUCTS)
  const { data: topNCustomers, isLoading: isLoadingTopNCustomers } =
    useTopNCustomers(TOP_N_CUSTOMERS)
  const { data: currentStatistic, isLoading: isLoadingCurrentStatistic } =
    useCurrentStatistic()

  const productsChartData = productsData.map((product) => ({
    name: formatTimePeriod(product.timePeriod, timeFrames.products),
    value: product.count,
  }))

  const customersChartData = customerData.map((customer) => ({
    name: formatTimePeriod(customer.timePeriod, timeFrames.customers),
    value: customer.count,
  }))

  const revenuesChartData = revenuesData.map((revenue) => ({
    name: formatTimePeriod(revenue.timePeriod, timeFrames.revenues),
    value: revenue.count,
  }))

  const ordersChartData = ordersData.map((order) => ({
    name: formatTimePeriod(order.timePeriod, timeFrames.orders),
    value: order.count,
  }))

  const onChangeTimeFrame = (type: string, value: TimeScope) => {
    setTimeFrames({
      ...timeFrames,
      [type]: value,
    })
  }

  const metricData = useMemo(() => {
    return metrics.map((metric) => {
      const response =
        currentStatistic?.[metric.key as keyof typeof currentStatistic]
      return {
        title: metric.title,
        value: response?.[metric.value as keyof typeof response] ?? 0,
        growth: response?.percentageCompareLastMonth ?? 0,
        icon: metric.icon,
      }
    })
  }, [currentStatistic])

  return (
    <DashboardWrapper>
      <Grid container spacing={2} mb={4}>
        {isLoadingCurrentStatistic
          ? Array.from({ length: 3 }).map((_, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))
          : metricData.map((metric, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  growth={metric.growth}
                  icon={metric.icon}
                />
              </Grid>
            ))}
      </Grid>

      <Grid container spacing={2} mb={4}>
        <Grid size={{ xs: 12 }}>
          <StatisticChart
            title="Revenues Statistics"
            data={revenuesChartData}
            filter={timeFrames.revenues}
            isLoading={isLoadingRevenues}
            onFilterChange={(value) => {
              onChangeTimeFrame('revenues', value)
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <StatisticChart
            title="Products Statistics"
            data={productsChartData}
            filter={timeFrames.products}
            isLoading={isLoadingProducts}
            onFilterChange={(value) => {
              onChangeTimeFrame('products', value)
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <StatisticChart
            title="Customers Statistics"
            data={customersChartData}
            filter={timeFrames.customers}
            isLoading={isLoadingCustomers}
            onFilterChange={(value) => {
              onChangeTimeFrame('customers', value)
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <StatisticChart
            title="Orders Statistics"
            data={ordersChartData}
            filter={timeFrames.orders}
            isLoading={isLoadingOrders}
            onFilterChange={(value) => {
              onChangeTimeFrame('orders', value)
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BestSellingWrapper variant="outlined">
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              Top products
            </Typography>
            <Divider />
            {isLoadingTopNProducts ? (
              <Skeleton variant="rectangular" height={118} />
            ) : (
              <TopProductsTable products={topNProducts?.productItems ?? []} />
            )}
          </BestSellingWrapper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <BestSellingWrapper variant="outlined">
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              color="primary"
            >
              Top customers
            </Typography>
            <Divider />
            {isLoadingTopNCustomers ? (
              <Skeleton variant="rectangular" height={118} />
            ) : (
              <TopCustomersTable
                customers={topNCustomers?.customerItems ?? []}
              />
            )}
          </BestSellingWrapper>
        </Grid>
      </Grid>
    </DashboardWrapper>
  )
}

export default DashboardPage
