import { BaseTable } from '@/components/common/BaseTable'
import { type HeadCell } from '@/components/common/BaseTableHead'
import { usePaymentHistory } from '@/features/dashboard/hooks/usePaymentHistory'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import {
  Avatar,
  Box,
  Chip,
  Stack,
  TableCell,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PaymentHistoryItem, PaymentHistoryBodyParam } from '../types'
import type { PaymentFilters } from './PaymentHistoryToolbar'
import PaymentHistoryToolbar from './PaymentHistoryToolbar'
import { StyledTableRow } from './styles/PaymentHistoryTable.styles'

const statusMeta: Record<
  number,
  { label: string; color: 'default' | 'success' | 'error' | 'warning' | 'info' }
> = {
  0: { label: 'TopUp', color: 'warning' },
  1: { label: 'Paid', color: 'default' },
  2: { label: 'Failed', color: 'error' },
  3: { label: 'Refunded', color: 'info' },
  4: { label: 'Withdraw', color: 'success' },
}

const headCells: readonly HeadCell<PaymentHistoryItem>[] = [
  { id: 'userName', label: 'User' },
  { id: 'amount', label: 'Amount' },
  { id: 'paymentMenthod', label: 'Method' },
  { id: 'paymentStatus', label: 'Status' },
  { id: 'creationDate', label: 'Time' },
  { id: 'orderId', label: 'Order' },
]

export default function PaymentHistoryTable() {
  const navigate = useNavigate()
  const table = useTable<PaymentHistoryItem>({ initialOrderBy: 'creationDate' })

  const [filters, setFilters] = useState<PaymentFilters>({
    start: dayjs().subtract(30, 'day').startOf('day'),
    end: dayjs().endOf('day'),
  })

  const { data, isLoading, error } = usePaymentHistory({
    startDate: (filters.start ?? dayjs().subtract(30, 'day').startOf('day'))
      .toDate()
      .toISOString(),
    endDate: (filters.end ?? dayjs().endOf('day')).toDate().toISOString(),
    userId: null,
    page: table.page + 1,
    pageSize: table.rowsPerPage,
  } satisfies PaymentHistoryBodyParam)

  const { showNotification } = useNotification()

  const items = useMemo<PaymentHistoryItem[]>(
    () => data?.items ?? [],
    [data?.items]
  )
  const pageCount = useMemo(
    () =>
      data?.totalItems && data?.pageSize
        ? Math.ceil(data.totalItems / data.pageSize)
        : 0,
    [data?.totalItems, data?.pageSize]
  )

  const onRowClick = useCallback(
    (row: PaymentHistoryItem) => navigate(`/orders/${row.orderId}`),
    [navigate]
  )

  useEffect(() => {
    if (error) {
      showNotification(
        error.message || 'Failed to load payment history.',
        'error'
      )
    }
  }, [error, showNotification])

  const handleFiltersChange = useCallback(
    (name: keyof PaymentFilters, value: unknown) => {
      setFilters((prev) => ({ ...prev, [name]: value as any }))
      table.setFilterPage(0)
    },
    [table]
  )

  const renderRow = (
    row: PaymentHistoryItem,
    _checked: boolean,
    index: number
  ) => {
    const meta = statusMeta[row.paymentStatus] ?? {
      label: String(row.paymentStatus),
      color: 'default',
    }
    const created = dayjs(row.creationDate)
    return (
      <StyledTableRow key={row.id} hover onClick={() => onRowClick(row)}>
        <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src={row.avatar ?? undefined} />
            <Box sx={{ minWidth: 180 }}>
              <Typography variant="subtitle2" noWrap>
                {row.userName}
              </Typography>
            </Box>
          </Stack>
        </TableCell>
        <TableCell>
          <Typography variant="body2">
            {row.amount.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            })}
          </Typography>
        </TableCell>
        <TableCell>{row.paymentMenthod}</TableCell>
        <TableCell>
          <Chip size="small" label={meta.label} color={meta.color} />
        </TableCell>
        <TableCell>
          <Tooltip title={created.toISOString()}>
            <span>{created.format('DD/MM/YYYY HH:mm')}</span>
          </Tooltip>
        </TableCell>
        <TableCell>
          <Typography variant="body2" color="primary">
            {row.orderId ? `#${row.orderId.slice(0, 8).toUpperCase()}` : '-'}
          </Typography>
        </TableCell>
      </StyledTableRow>
    )
  }

  return (
    <Box>
      <BaseTable
        data={items}
        headCells={headCells}
        isLoading={isLoading}
        pageCount={pageCount}
        table={table}
        toolbar={
          <PaymentHistoryToolbar
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        }
        renderRow={renderRow}
        showCheckbox={false}
        allowModify={false}
      />
    </Box>
  )
}
