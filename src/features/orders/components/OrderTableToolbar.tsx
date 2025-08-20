import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { OrderStatus } from '../constants'
import {
  StyledToolbar,
  StyledToolbarContainer,
} from './styles/OrderTableToolbar.style'

export interface OrderFilter {
  orderStatus: OrderStatus | null
}

interface OrderTableToolbarProps {
  filters: OrderFilter
  onChange: (name: keyof OrderFilter, value: unknown) => void
}

export default function OrderTableToolbar({
  filters,
  onChange,
}: OrderTableToolbarProps) {
  return (
    <StyledToolbarContainer>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        All orders
      </Typography>
      <StyledToolbar>
        <Grid
          container
          width="100%"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="orderStatus"
                value={filters.orderStatus ?? 'ALL'}
                onChange={(e) => {
                  const val = e.target.value
                  onChange(
                    'orderStatus',
                    val === 'ALL' ? null : (val as OrderStatus)
                  )
                }}
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value={OrderStatus.PAID}>Paid</MenuItem>
                <MenuItem value={OrderStatus.PENDING_CHECKED}>
                  Pending Checked
                </MenuItem>
                <MenuItem value={OrderStatus.PENDING_CONFIRM}>
                  Pending Confirm
                </MenuItem>
                <MenuItem value={OrderStatus.PENDING_PICKUP}>
                  Pending Pickup
                </MenuItem>
                <MenuItem value={OrderStatus.PENDING_DELIVERY}>
                  Pending Delivery
                </MenuItem>
                <MenuItem value={OrderStatus.SHIPPING}>Shipping</MenuItem>
                <MenuItem value={OrderStatus.CANCELED}>Canceled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}
