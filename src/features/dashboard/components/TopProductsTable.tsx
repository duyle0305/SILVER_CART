import type { ProductItem } from '@/features/dashboard/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

interface TopProductsTableProps {
  products: ProductItem[]
}

const TopProductsTable = ({ products }: TopProductsTableProps) => {
  const renderProductRow = () => {
    return products.map((product, index) => (
      <TableRow key={index} hover>
        <TableCell>{product.productName}</TableCell>
        <TableCell align="center">{product.totalQuantity}</TableCell>
        <TableCell align="right">
          <Typography variant="body2" color="success" fontWeight={500}>
            {product.totalRevenue.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        </TableCell>
      </TableRow>
    ))
  }

  return (
    <Table size="medium">
      <TableHead>
        <TableRow>
          <TableCell>Product Name</TableCell>
          <TableCell align="center">Quantity</TableCell>
          <TableCell align="right">Revenue</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.length > 0 ? (
          renderProductRow()
        ) : (
          <TableRow>
            <TableCell colSpan={3} align="center">
              No data
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TopProductsTable
