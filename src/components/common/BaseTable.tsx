import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Stack,
  Pagination,
  Typography,
  Skeleton,
} from '@mui/material'
import { type ReactNode } from 'react'
import { BaseTableHead, type HeadCell } from '@/components/common/BaseTableHead'
import type { UseTableReturn } from '@/hooks/useTable'

interface BaseTableProps<T extends { id: string | number }> {
  data: T[]
  headCells: readonly HeadCell<T>[]
  isLoading: boolean
  table: UseTableReturn<T>
  pageCount: number
  toolbar: ReactNode
  renderRow: (item: T, isSelected: boolean, index: number) => ReactNode
  showCheckbox?: boolean
  allowModify?: boolean
}

export function BaseTable<T extends { id: string | number }>({
  data,
  headCells,
  isLoading,
  table,
  pageCount,
  toolbar,
  renderRow,
  showCheckbox,
  allowModify = true,
}: BaseTableProps<T>) {
  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      {toolbar}
      <TableContainer>
        <Table sx={{ minWidth: 750 }}>
          <BaseTableHead<T>
            numSelected={table.selected.length}
            order={table.order}
            orderBy={table.orderBy}
            onSelectAllClick={(e) =>
              table.handleSelectAllClick(
                e,
                data.map((d) => d.id)
              )
            }
            onRequestSort={table.handleRequestSort}
            rowCount={data.length}
            headCells={headCells}
            showCheckbox={showCheckbox}
            allowModify={allowModify}
          />
          <TableBody>
            {isLoading ? (
              Array.from(new Array(table.rowsPerPage)).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={headCells.length + 3}>
                    <Skeleton variant="text" sx={{ width: '100%' }} />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headCells.length + 3}
                  align="center"
                  sx={{ py: 10 }}
                >
                  <Typography variant="h6">No Data Found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) =>
                renderRow(item, table.isSelected(item.id), index)
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack alignItems="center" sx={{ py: 2 }}>
        {data.length > 0 && (
          <Pagination
            count={pageCount}
            page={table.page + 1}
            onChange={table.handleChangePage}
            color="primary"
            shape="rounded"
          />
        )}
      </Stack>
    </Paper>
  )
}
