import {
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material'

type Order = 'Ascending' | 'Descending'

export interface HeadCell<T> {
  id: keyof T | string
  label: string
}

interface BaseTableHeadProps<T> {
  numSelected: number
  onRequestSort: (property: keyof T | string) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: keyof T | string
  rowCount: number
  headCells: readonly HeadCell<T>[]
  showCheckbox?: boolean
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
  } = props
  const sortDirection = order === 'Ascending' ? 'asc' : 'desc'

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
            sortDirection={orderBy === headCell.id ? sortDirection : false}
            sx={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? sortDirection : 'asc'}
              onClick={() => onRequestSort(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
  )
}
