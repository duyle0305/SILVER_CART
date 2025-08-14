import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  StyledToolbar,
  StyledToolbarContainer,
} from './styles/PromotionTableToolbar.style'

export interface PromotionFilters {
  keyword: string
  isActive: boolean
}

interface PromotionTableToolbarProps {
  filters: PromotionFilters
  onFiltersChange: (name: keyof PromotionFilters, value: unknown) => void
}

export default function PromotionTableToolbar({
  filters,
  onFiltersChange,
}: PromotionTableToolbarProps) {
  const navigate = useNavigate()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const mappedValue =
      name === 'isActive' ? (value === 'active' ? true : false) : value

    onFiltersChange(name as keyof PromotionFilters, mappedValue)
  }
  const createPromotion = useCallback(() => {
    navigate('/promotions/add')
  }, [navigate])

  return (
    <StyledToolbarContainer>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          All promotions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createPromotion}
        >
          Add Promotion
        </Button>
      </Stack>
      <StyledToolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              size="small"
              name="keyword"
              placeholder="Search product..."
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
              name="isActive"
              select
              value={filters.isActive ? 'active' : 'inactive'}
              onChange={handleInputChange}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}
