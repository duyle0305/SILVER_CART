import { Box, Card, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const DashboardWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const MetricCard = styled(Card)({
  height: '100%',
})

export const RevenueChartWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
}))

export const ProductRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}))

export const ProductInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexGrow: 1,
}))

export const ProductStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(4),
}))

export const BestSellingWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}))
