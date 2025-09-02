import {
  StyledToolbar,
  StyledToolbarContainer,
} from '@/features/products/components/styles/ProductTableToolbar.styles'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Stack,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategoriesNoValue } from '@/features/categories/hooks/useCategoriesNoValue'
import type { SelectChangeEvent } from '@mui/material'
import { useAuthContext } from '@/contexts/AuthContext'
import { authorizationAction } from '@/features/authentication/constants'

export interface ProductFilters {
  keyword: string
  categoryIds: string[]
  minPrice: number | ''
  maxPrice: number | ''
}

interface ProductTableToolbarProps {
  filters: ProductFilters
  onFiltersChange: (name: keyof ProductFilters, value: unknown) => void
}

const ProductTableToolbar = ({
  filters,
  onFiltersChange,
}: ProductTableToolbarProps) => {
  const navigate = useNavigate()
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategoriesNoValue()
  const { user } = useAuthContext()
  const allowCreateProducts =
    user?.role && authorizationAction.allowCreateProducts.includes(user.role)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange(e.target.name as keyof ProductFilters, e.target.value)
  }

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event
    onFiltersChange(
      'categoryIds',
      typeof value === 'string' ? value.split(',') : value
    )
  }

  const createProduct = useCallback(() => {
    navigate('/products/add')
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
          All products
        </Typography>
        {allowCreateProducts && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={createProduct}
          >
            Add Product
          </Button>
        )}
      </Stack>
      <StyledToolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
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
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                name="categoryIds"
                value={filters.categoryIds}
                onChange={handleCategoryChange}
                input={<OutlinedInput label="Categories" />}
                renderValue={(selected) =>
                  categories
                    .filter((c) => selected.includes(c.id))
                    .map((c) => c.label)
                    .join(', ')
                }
                disabled={isLoadingCategories}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Checkbox
                      checked={filters.categoryIds.indexOf(cat.id) > -1}
                    />
                    <ListItemText primary={cat.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              size="small"
              name="minPrice"
              type="number"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 2 }}>
            <TextField
              fullWidth
              size="small"
              name="maxPrice"
              type="number"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}

export default ProductTableToolbar
