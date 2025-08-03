import { MetricCard as StyledCard } from '@/features/dashboard/styles/Dashboard.styles'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, CardContent, Paper, Typography } from '@mui/material'

interface MetricCardProps {
  title: string
  value: number
  growth: number
  icon?: React.ReactNode
}

const getGrowthColor = (growth: number): 'error' | 'success' | 'warning' => {
  if (growth > 0) return 'success'
  if (growth < 0) return 'error'
  return 'warning'
}

const getGrowthIcon = (growth: number) => {
  if (growth > 0) return <TrendingUpIcon fontSize="small" />
  if (growth < 0) return <TrendingDownIcon fontSize="small" />
  return <TrendingFlatIcon fontSize="small" />
}

const MetricCard = ({ title, value, growth, icon }: MetricCardProps) => {
  const growthColor = getGrowthColor(growth)
  const growthIcon = getGrowthIcon(growth)

  return (
    <StyledCard>
      <CardContent>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Paper
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                bgcolor: '#E2E5F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              elevation={0}
            >
              {icon}
            </Paper>
            <Box flexGrow={1} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={500}>
                {value.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            alignItems="flex-end"
            flexDirection="column"
            gap={0.5}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={0.5}
            >
              <Typography variant="h6" color={growthColor}>
                {growthIcon}
              </Typography>
              <Typography variant="h6" fontWeight={500} color={growthColor}>
                {parseFloat(growth.toString()).toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" ml={1}>
              Last month
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </StyledCard>
  )
}

export default MetricCard
