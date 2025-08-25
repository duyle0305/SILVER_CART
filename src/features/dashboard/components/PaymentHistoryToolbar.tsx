import { Box, Stack, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'

export interface PaymentFilters {
  start: Dayjs | null
  end: Dayjs | null
}

const PaymentHistoryToolbar = ({
  filters,
  onFiltersChange,
}: {
  filters: PaymentFilters
  onFiltersChange: (name: keyof PaymentFilters, value: unknown) => void
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight="bold" color="primary">
        Payment History
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        alignItems="center"
      >
        <DatePicker
          label="Start date"
          value={filters.start}
          onChange={(d) => onFiltersChange('start', d)}
          sx={{ minWidth: 220 }}
        />
        <DatePicker
          label="End date"
          value={filters.end}
          onChange={(d) => onFiltersChange('end', d)}
          sx={{ minWidth: 220 }}
        />
      </Stack>
    </Box>
  )
}

export default PaymentHistoryToolbar
