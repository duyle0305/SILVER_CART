import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { useRoles } from '@/features/roles/hooks/useRoles'
import { StyledTableRow } from '@/features/users/components/styles/UserTable.styles'
import TableToolbar from '@/features/users/components/TableToolbar'
import { useUsers } from '@/features/users/hooks/useUsers'
import { type User } from '@/features/users/types'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import { Chip, TableCell } from '@mui/material'
import { useDebounce } from 'ahooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NotInterestedIcon from '@mui/icons-material/NotInterested'

const userHeadCells: readonly HeadCell<User>[] = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'roleName', label: 'Role' },
  { id: 'phoneNumber', label: 'Phone Number' },
  { id: 'email', label: 'Email' },
  { id: 'isVerified', label: 'Status' },
  { id: 'isDeleted', label: 'Banned' },
]

const UserTable = () => {
  const [filter, setFilter] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const debouncedFilter = useDebounce(filter, { wait: 500 })
  const navigate = useNavigate()
  const table = useTable<User>({ initialOrderBy: 'fullName' })

  const { showNotification } = useNotification()

  const { data: roles = [], isLoading: isLoadingRoles } = useRoles()

  const { data, isLoading, error } = useUsers({
    page: table.page,
    pageSize: table.rowsPerPage,
    keyword: debouncedFilter,
    roleId: selectedRoleId,
  })

  const users = useMemo(() => data?.items || [], [data?.items])
  const pageCount = useMemo(
    () => (data ? Math.ceil(data.totalItems / data.pageSize) : 0),
    [data]
  )

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilter(value)
      table.setFilterPage(0)
    },
    [table]
  )

  const handleRoleChange = useCallback(
    (roleId: string) => {
      setSelectedRoleId(roleId)
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
    userRow: User,
    isItemSelected: boolean,
    index: number
  ) => {
    return (
      <StyledTableRow
        key={userRow.id}
        hover
        selected={isItemSelected}
        onClick={() => {
          onRowClick(userRow.id)
        }}
      >
        <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
        <TableCell>{userRow.fullName}</TableCell>
        <TableCell>
          <Chip label={userRow.roleName} size="small" />
        </TableCell>
        <TableCell>{userRow.phoneNumber || '-'}</TableCell>
        <TableCell>{userRow.email}</TableCell>
        <TableCell>
          {userRow.isVerified ? (
            <Chip label="Verified" variant="outlined" color="success" />
          ) : (
            <Chip label="Unverified" variant="outlined" color="error" />
          )}
        </TableCell>
        <TableCell>
          {userRow.isDeleted ? (
            <Chip
              label="Banned"
              variant="outlined"
              color="error"
              icon={<NotInterestedIcon />}
            />
          ) : (
            <Chip label="Active" variant="outlined" color="success" />
          )}
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
          <TableToolbar
            filter={filter}
            onFilterChange={handleFilterChange}
            selectedRole={selectedRoleId}
            onRoleChange={handleRoleChange}
            roles={roles}
            isLoadingRoles={isLoadingRoles}
          />
        }
        renderRow={renderTableRow}
        allowModify={false}
        showCheckbox={false}
        isSortable={false}
      />
    </>
  )
}

export default UserTable
