import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { SortType } from '@/constants'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import { Box, Chip, Stack, TableCell, Tooltip, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StyledTableRow } from '../users/components/styles/UserTable.styles'
import type { OrderFilter } from './components/OrderTableToolbar'
import OrderTableToolbar from './components/OrderTableToolbar'
import { OrderStatus } from './constants'
import { useOrders } from './hooks/useOrders'
import type { Order } from './types'
import dayjs from 'dayjs'

const orderHeadCells: readonly HeadCell<Order>[] = [
  { id: 'order', label: 'Order' },
  { id: 'contact', label: 'Contact' },
  { id: 'address', label: 'Address' },
  { id: 'totalPrice', label: 'Total' },
  { id: 'orderStatus', label: 'Status' },
  { id: 'items', label: 'Items' },
  { id: 'creationDate', label: 'Created At' },
]

export default function ListOrderPage() {
  const navigate = useNavigate()
  const table = useTable<Order>({
    initialOrderBy: 'creationDate',
    initialOrder: SortType.Descending,
  })
  const { showNotification } = useNotification()

  const [filters, setFilters] = useState<OrderFilter>({
    orderStatus: null,
  })

  const handleFiltersChange = useCallback(
    (name: keyof OrderFilter, value: unknown) => {
      setFilters((prev) => ({ ...prev, [name]: value as any }))
      table.setFilterPage(0)
    },
    [table]
  )

  const { data, isLoading, error } = useOrders({
    orderStatus: filters.orderStatus,
    sortBy: table.orderBy as string,
    isDescending: table.order === SortType.Descending,
    page: table.page + 1,
    pageSize: table.rowsPerPage,
  })

  useEffect(() => {
    if (error) {
      showNotification(
        (error as Error)?.message || 'Failed to load order',
        'error'
      )
    }
  }, [error, showNotification])

  const orders = useMemo(() => data?.items || [], [data])
  const pageCount = useMemo(
    () => (data ? Math.ceil(data.totalItems / data.pageSize) : 0),
    [data]
  )

  const onRowClick = (id: string) => navigate(id)

  const renderAddress = (order: Order) =>
    [
      order.streetAddress,
      order.wardName,
      order.districtName,
      order.provinceName,
    ]
      .filter(Boolean)
      .join(', ')

  const renderItems = (order: Order) => {
    const count =
      order.orderDetails?.reduce((acc, d) => acc + d.quantity, 0) ?? 0
    if (!order.orderDetails?.length) return '-'
    const first = order.orderDetails[0]
    const tail =
      order.orderDetails.length > 1 ? `+${order.orderDetails.length - 1}` : ''
    return `${first.productName}${tail} (${count})`
  }

  const renderStatus = (status: OrderStatus | string) => {
    let color: 'success' | 'warning' | 'info' | 'error' | 'default' = 'default'
    let label = ''
    switch (status) {
      case 'Paid':
        color = 'success'
        label = 'Paid'
        break
      case 'PendingChecked':
        color = 'warning'
        label = 'Pending Checked'
        break
      case 'PendingConfirm':
        color = 'warning'
        label = 'Pending Confirm'
        break
      case 'PendingPickup':
        color = 'warning'
        label = 'Pending Pickup'
        break
      case 'PendingDelivery':
        color = 'warning'
        label = 'Pending Delivery'
        break
      case 'Shipping':
        color = 'info'
        label = 'Shipping'
        break
      case 'Delivered':
        color = 'success'
        label = 'Delivered'
        break
      case 'Canceled':
        color = 'error'
        label = 'Canceled'
        break
      case 'Fail':
        color = 'error'
        label = 'Failed'
        break
      default:
        color = 'default'
    }
    return <Chip size="small" label={label} color={color} />
  }

  const renderRow = (order: Order, _: boolean, index: number) => (
    <StyledTableRow key={order.id} hover onClick={() => onRowClick(order.id)}>
      <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" noWrap sx={{ maxWidth: 340 }}>
            #{order.id.slice(0, 8).toUpperCase()}
          </Typography>
          {order.note && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 340 }}
            >
              {order.note}
            </Typography>
          )}
        </Stack>
      </TableCell>
      <TableCell>
        <Stack spacing={0.5}>
          <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>
            {order.customerName || order.elderName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ maxWidth: 220 }}
          >
            {order.phoneNumber}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap sx={{ maxWidth: 360 }}>
          {renderAddress(order)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="subtitle2">
          {order.totalPrice.toLocaleString()} VND
        </Typography>
        {order.discount > 0 && (
          <Typography variant="caption" color="secondary">
            Discount: {order.discount.toLocaleString()} VND
          </Typography>
        )}
      </TableCell>
      <TableCell>{renderStatus(order.orderStatus)}</TableCell>
      <TableCell>
        <Tooltip title={renderItems(order)} placement="top">
          <Typography variant="body2" noWrap sx={{ maxWidth: 280 }}>
            {renderItems(order)}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell>
        {dayjs(order.creationDate).format('DD/MM/YYYY HH:mm')}
      </TableCell>
    </StyledTableRow>
  )

  return (
    <Box>
      <BaseTable
        data={orders}
        headCells={orderHeadCells}
        isLoading={isLoading}
        pageCount={pageCount}
        table={table}
        toolbar={
          <OrderTableToolbar filters={filters} onChange={handleFiltersChange} />
        }
        renderRow={renderRow}
        showCheckbox={false}
        allowModify={false}
      />
    </Box>
  )
}
