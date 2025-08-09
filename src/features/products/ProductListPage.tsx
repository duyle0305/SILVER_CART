import { BaseTable } from '@/components/common/BaseTable'
import { type HeadCell } from '@/components/common/BaseTableHead'
import ProductTableToolbar, {
  type ProductFilters,
} from '@/features/products/components/ProductTableToolbar'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { ProductListItem } from '@/features/products/types'
import { StyledTableRow } from '@/features/users/components/styles/UserTable.styles'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import {
  Box,
  IconButton,
  TableCell,
  Avatar,
  Typography,
  Stack,
  Tooltip,
} from '@mui/material'
import { useDebounce } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'
import { Role } from '@/features/authentication/constants'
import { SortType } from '@/constants'

const productHeadCells: readonly HeadCell<ProductListItem>[] = [
  { id: 'name', label: 'Product' },
  { id: 'brand', label: 'Brand' },
  { id: 'price', label: 'Price' },
  { id: 'categories', label: 'Categories' },
]

function ProductListPage() {
  const navigate = useNavigate()
  const table = useTable<ProductListItem>({ initialOrderBy: 'name' })
  const { user } = useAuthContext()
  const [filters, setFilters] = useState<ProductFilters>({
    keyword: '',
    categoryIds: [],
    minPrice: '',
    maxPrice: '',
  })
  const debouncedKeyword = useDebounce(filters.keyword, { wait: 500 })

  const { data, isLoading, error } = useProducts({
    page: table.page + 1,
    pageSize: table.rowsPerPage,
    keyword: debouncedKeyword || undefined,
    categoryIds:
      filters.categoryIds.length > 0 ? filters.categoryIds : undefined,
    minPrice: filters.minPrice === '' ? undefined : Number(filters.minPrice),
    maxPrice: filters.maxPrice === '' ? undefined : Number(filters.maxPrice),
    sortBy: table.orderBy as string,
    sortDirection: table.order === SortType.Ascending,
  })

  const { showNotification } = useNotification()

  const handleFiltersChange = useCallback(
    (name: keyof ProductFilters, value: unknown) => {
      setFilters((prev) => ({ ...prev, [name]: value }))
      table.setFilterPage(0)
    },
    [table]
  )

  const products = useMemo(() => data?.items || [], [data?.items])
  const pageCount = useMemo(
    () => (data ? Math.ceil(data.totalItems / data.pageSize) : 0),
    [data]
  )

  const onRowClick = useCallback((id: string) => navigate(id), [navigate])

  useEffect(() => {
    if (error) {
      showNotification(error.message || 'Failed to load products.', 'error')
    }
  }, [error, showNotification])

  const renderProductRow = (
    product: ProductListItem,
    _: boolean,
    index: number
  ) => (
    <StyledTableRow
      key={product.id}
      hover
      onClick={() => onRowClick(product.id)}
    >
      <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={product.imageUrl} variant="rounded" />
          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 300 }}>
            {product.name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>{product.brand}</TableCell>
      <TableCell>{product.price.toLocaleString()} VND</TableCell>
      <TableCell>
        <Tooltip title={product.categories.map((cat) => cat.label).join(', ')}>
          <Typography noWrap sx={{ maxWidth: 200 }}>
            {product.categories.map((cat) => cat.label).join(', ')}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        <IconButton
          size="small"
          color="primary"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/products/edit/${product.id}`)
          }}
        >
          <BorderColorIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  )

  return (
    <Box>
      <BaseTable
        data={products}
        headCells={productHeadCells}
        isLoading={isLoading}
        pageCount={pageCount}
        table={table}
        toolbar={
          <ProductTableToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        }
        renderRow={renderProductRow}
        showCheckbox={false}
        allowModify={
          user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN
        }
      />
    </Box>
  )
}

export default ProductListPage
