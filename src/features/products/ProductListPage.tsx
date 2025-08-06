import { BaseTable } from '@/components/common/BaseTable'
import { type HeadCell } from '@/components/common/BaseTableHead'
import ProductTableToolbar, {
  type ProductFilters,
} from '@/features/products/components/ProductTableToolbar'
import { useProducts } from '@/features/products/hooks/useProducts'
import { ProductType } from '@/features/products/constants'
import type { ProductData } from '@/features/products/types'
import { StyledTableRow } from '@/features/users/components/styles/UserTable.styles'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import { Box, IconButton, TableCell } from '@mui/material'
import { useDebounce } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Role } from '../authentication/constants'
import { useAuthContext } from '@/contexts/AuthContext'

const productHeadCells: readonly HeadCell<ProductData>[] = [
  { id: 'productName', label: 'Name' },
  { id: 'productType', label: 'Product Type' },
  { id: 'category', label: 'Category' },
]

function ProductListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<ProductFilters>({
    keyword: '',
    productType: ProductType.ALL,
  })
  const { user } = useAuthContext()
  const userRole = user?.role

  const allowModifyProduct = useMemo(() => {
    return userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN
  }, [userRole])

  const debounceKeyword = useDebounce(filters.keyword, { wait: 500 })
  const table = useTable<ProductData>({ initialOrderBy: 'productName' })
  const { data, isLoading, error } = useProducts({
    keyword: debounceKeyword,
    order: table.order,
    orderBy: table.orderBy,
    page: table.page,
    pageSize: table.rowsPerPage,
    productType: filters.productType,
  })

  const { showNotification } = useNotification()

  const handleFiltersChange = useCallback(
    (name: keyof ProductFilters, value: string) => {
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

  const updateProduct = useCallback(
    (id: string) => {
      navigate(`edit/${id}`)
    },
    [navigate]
  )

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'Failed to load products data.'
      showNotification(errorMessage, 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  const renderProductRow = (
    product: ProductData,
    _: boolean,
    index: number
  ) => (
    <StyledTableRow key={product.id} hover>
      <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
      <TableCell>{product.productName}</TableCell>
      <TableCell>{product.productType}</TableCell>
      <TableCell>
        {product.productCategories
          .map((productCategory) => productCategory.categoryName)
          .join(',')}
      </TableCell>
      {allowModifyProduct && (
        <TableCell>
          <IconButton
            size="small"
            color="primary"
            onClick={() => updateProduct(product.id)}
          >
            <BorderColorIcon fontSize="small" />
          </IconButton>
        </TableCell>
      )}
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
        allowModify={allowModifyProduct}
      />
    </Box>
  )
}

export default ProductListPage
