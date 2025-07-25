import { BaseTable } from '@/components/common/BaseTable'
import { type HeadCell } from '@/components/common/BaseTableHead'
import ProductTableToolbar, {
  type ProductFilters,
} from '@/features/products/components/ProductTableToolbar'
import { ProductTypes } from '@/features/products/constants'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { ProductData } from '@/features/products/services/productService'
import { StyledTableRow } from '@/features/users/components/styles/UserTable.styles'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Box, IconButton, TableCell } from '@mui/material'
import { useDebounce } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'

const productHeadCells: readonly HeadCell<ProductData>[] = [
  { id: 'productName', label: 'Name' },
  { id: 'productType', label: 'Product Type' },
  { id: 'category', label: 'Category' },
  { id: 'stock', label: 'Stock' },
  { id: 'originalPrice', label: 'Original Price' },
  { id: 'discountPrice', label: 'Discount Price' },
]

export function ProductListPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    keyword: '',
    productType: ProductTypes.ALL,
  })
  const debounceKeyword = useDebounce(filters.keyword, { wait: 500 })
  const table = useTable<ProductData>({ initialOrderBy: 'productName' })
  const { data, isLoading, error } = useProducts({
    keyword: debounceKeyword,
    order: table.order,
    orderBy: table.orderBy,
    page: table.page,
    pageSize: table.rowsPerPage,
  })

  const { showNotification } = useNotification()

  const handleFiltersChange = useCallback(
    (name: keyof ProductFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [name]: value }))
      table.setFilterPage(0)
    },
    [table]
  )

  const products = useMemo(() => data?.results || [], [data?.results])
  const pageCount = useMemo(
    () => data?.totalNumberOfPages || 0,
    [data?.totalNumberOfPages]
  )

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'Failed to load products data.'
      showNotification(errorMessage, 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const renderProductRow = (product: ProductData) => (
    <StyledTableRow key={product.id} hover>
      <TableCell>{product.id}</TableCell>
      <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>
        {product.name}
      </TableCell>
      <TableCell>{product.productType}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{product.stock.toLocaleString()}</TableCell>
      <TableCell>{product.originalPrice.toLocaleString()} VND</TableCell>
      <TableCell>{product.discountPrice.toLocaleString()} VND</TableCell>
      <TableCell>
        <IconButton size="small" color="primary">
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error">
          <DeleteIcon fontSize="small" />
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
        showCheckbox={false}
        table={table}
        toolbar={
          <ProductTableToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        }
        renderRow={renderProductRow}
      />
    </Box>
  )
}
