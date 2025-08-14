import SearchIcon from '@mui/icons-material/Search'
import {
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { FeedbackStatus } from '../constants'
import {
  StyledToolbar,
  StyledToolbarContainer,
} from './styles/FeedbackTableToolbar.style'

export interface FeedbackFilters {
  keyword: string
  status: FeedbackStatus | undefined
}

interface FeedbackTableToolbarProps {
  filters: FeedbackFilters
  onFiltersChange: (name: keyof FeedbackFilters, value: unknown) => void
}

export default function FeedbackTableToolbar({
  filters,
  onFiltersChange,
}: FeedbackTableToolbarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onFiltersChange(name as keyof FeedbackFilters, value)
  }

  const ALL_VALUE = ''

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const next =
      raw === ALL_VALUE ? undefined : (raw as unknown as FeedbackStatus)
    onFiltersChange('status', next)
  }

  return (
    <StyledToolbarContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          All feedbacks
        </Typography>
      </Stack>
      <StyledToolbar>
        <Grid container spacing={2} alignItems="center" width="30%">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              size="small"
              name="keyword"
              placeholder="Search feedback..."
              value={filters.keyword}
              onChange={handleInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              name="status"
              select
              value={filters.status ?? ALL_VALUE}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value={ALL_VALUE}>
                <em>All</em>
              </MenuItem>
              <MenuItem value={FeedbackStatus.PENDING}>Pending</MenuItem>
              <MenuItem value={FeedbackStatus.IN_PROGRESS}>
                In-Progress
              </MenuItem>
              <MenuItem value={FeedbackStatus.RESOLVED}>Resolved</MenuItem>
              <MenuItem value={FeedbackStatus.REJECTED}>Rejected</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}
