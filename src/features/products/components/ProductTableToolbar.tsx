import { Role } from '@/features/authentication/constants'
import {
  StyledToolbar,
  StyledToolbarContainer,
} from '@/features/products/components/styles/ProductTableToolbar.styles'
import { ProductType } from '@/features/products/constants'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useMemo, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export interface ProductFilters {
  productType: ProductType
  keyword: string
}

interface ProductTableToolbarProps {
  filters: ProductFilters
  onFiltersChange: (name: keyof ProductFilters, value: string) => void
}

const ProductTableToolbar = ({
  filters,
  onFiltersChange,
}: ProductTableToolbarProps) => {
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const userRole = user?.role

  const allowCreateProduct = useMemo(() => {
    return userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN
  }, [userRole])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange(e.target.name as keyof ProductFilters, e.target.value)
  }

  const handleSelectChange =
    (name: keyof ProductFilters) =>
    (
      event:
        | ChangeEvent<
            Omit<HTMLInputElement, 'value'> & {
              value: string
            }
          >
        | (Event & {
            target: {
              value: string
              name: string
            }
          })
    ) => {
      onFiltersChange(name, event.target.value)
    }

  const createProduct = useCallback(() => {
    navigate('add')
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
        {allowCreateProduct && (
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
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <FormControl fullWidth size="small">
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Product type
              </Typography>
              <Select
                size="small"
                name="productType"
                value={filters.productType}
                onChange={handleSelectChange('productType')}
              >
                {Object.values(ProductType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 6 }} sx={{ alignSelf: 'flex-end' }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name="keyword"
              placeholder="Search for..."
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
        </Grid>
      </StyledToolbar>
    </StyledToolbarContainer>
  )
}

export default ProductTableToolbar
