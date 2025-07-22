import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { StyledTableRow } from '@/features/users/components/styles/UserTable.styles'
import TableToolbar from '@/features/users/components/TableToolbar'
import { useUsers } from '@/features/users/hooks/useUsers'
import { type UserData } from '@/features/users/types'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { Checkbox, Chip, IconButton, TableCell } from '@mui/material'
import { useDebounce } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const userHeadCells: readonly HeadCell<UserData>[] = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'role', label: 'Role' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'emergencyContact', label: 'SOS Contact' },
  { id: 'email', label: 'Email' },
]

const UserTable = () => {
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, { wait: 500 })
  const navigate = useNavigate()

  const table = useTable<UserData>({ initialOrderBy: 'fullName' })

  const { showNotification } = useNotification()

  const { data, isLoading, error } = useUsers({
    page: table.page,
    pageSize: table.rowsPerPage,
    order: table.order,
    orderBy: table.orderBy,
    keyword: debouncedFilter,
  })

  const users = useMemo(() => data?.results || [], [data?.results])
  const pageCount = useMemo(
    () => data?.totalNumberOfPages || 0,
    [data?.totalNumberOfPages]
  )

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilter(value)
      table.setFilterPage(0)
    },
    [table]
  )

  const onRowClick = useCallback(
    (userId: string) => {
      navigate(userId)
    },
    [navigate]
  )

  const renderTableRow = (
    user: UserData,
    isItemSelected: boolean,
    index: number
  ) => {
    return (
      <StyledTableRow
        key={user.id}
        hover
        selected={isItemSelected}
        onClick={() => {
          onRowClick(user.id)
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onChange={() => {
              table.handleSelectRowClick(user.id)
            }}
          />
        </TableCell>
        <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
        <TableCell>{user.fullName}</TableCell>
        <TableCell>
          <Chip label={user.role} size="small" />
        </TableCell>
        <TableCell>{user.phone || '-'}</TableCell>
        <TableCell>{user.emergencyContact || '-'}</TableCell>
        <TableCell>{user.email}</TableCell>
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
  }

  useEffect(() => {
    if (error) {
      const errorMessage = error.message || 'Failed to load user data.'
      showNotification(errorMessage, 'error')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return (
    <>
      <BaseTable
        data={users}
        headCells={userHeadCells}
        isLoading={isLoading}
        pageCount={pageCount}
        table={table}
        toolbar={
          <TableToolbar filter={filter} onFilterChange={handleFilterChange} />
        }
        renderRow={renderTableRow}
      />
    </>
  )
}

export default UserTable
