import {
  Box,
  FormControl,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Typography,
} from '@mui/material'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TimeFrame } from '../constants'
import { RevenueChartWrapper } from '../styles/Dashboard.styles'

interface StatisticChartProps {
  title?: string
  filter: string
  onFilterChange: (value: TimeFrame) => void
  isLoading: boolean
  data: { name: string; value: number }[]
}

const StatisticChart = ({
  filter,
  onFilterChange,
  isLoading,
  data,
  title,
}: StatisticChartProps) => {
  return (
    <RevenueChartWrapper variant="outlined">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={'center'}
        mb={2}
      >
        <Typography
          variant="h5"
          color="primary"
          fontWeight={500}
          gutterBottom
          textTransform="uppercase"
        >
          {title}
        </Typography>

        <FormControl size="small">
          <Select
            value={filter}
            input={<OutlinedInput />}
            onChange={(e) => onFilterChange(e.target.value as TimeFrame)}
          >
            <MenuItem value={TimeFrame.WEEK}>This Week</MenuItem>
            <MenuItem value={TimeFrame.MONTH}>This Month</MenuItem>
            <MenuItem value={TimeFrame.YEAR}>This Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={300} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} style={{ padding: '10px' }}>
            <XAxis dataKey="name" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6880F6" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </RevenueChartWrapper>
  )
}

export default StatisticChart
