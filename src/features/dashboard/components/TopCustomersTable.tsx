import type { CustomerItem } from '@/features/dashboard/types'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

interface TopCustomersTableProps {
  customers: CustomerItem[]
}

const TopCustomersTable = ({ customers }: TopCustomersTableProps) => {
  const renderCustomerRow = () => {
    return customers.map((customer, index) => (
      <TableRow key={index} hover>
        <TableCell>{customer.customerName}</TableCell>
        <TableCell align="right">{customer.totalOrders}</TableCell>
      </TableRow>
    ))
  }

  return (
    <Table size="medium">
      <TableHead>
        <TableRow>
          <TableCell>Customer Name</TableCell>
          <TableCell align="right">Total Orders</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.length > 0 ? (
          renderCustomerRow()
        ) : (
          <TableRow>
            <TableCell colSpan={2} align="center">
              No data
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default TopCustomersTable
