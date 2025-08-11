import type { SortType } from '@/constants'
import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'

export interface HeadCell<T> {
  id: keyof T | string
  label: string
}

interface BaseTableHeadProps<T> {
  numSelected: number
  onRequestSort: (property: keyof T | string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: SortType
  orderBy: keyof T | string
  rowCount: number
  headCells: readonly HeadCell<T>[]
  showCheckbox?: boolean
  allowModify?: boolean
  isSortable?: boolean
}

export function BaseTableHead<T>(props: BaseTableHeadProps<T>) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    showCheckbox = true,
    allowModify = true,
    isSortable = true,
  } = props
  const sortDirection: 'asc' | 'desc' = order === 0 ? 'asc' : 'desc'

  return (
    <TableHead sx={{ backgroundColor: 'action.hover' }}>
      <TableRow>
        {showCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}
        <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            sortDirection={
              isSortable && orderBy === headCell.id ? sortDirection : false
            }
            sx={{ fontWeight: 'bold' }}
          >
            {isSortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? sortDirection : 'asc'}
                onClick={() => onRequestSort(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
        {allowModify && (
          <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
        )}
      </TableRow>
    </TableHead>
  )
}
