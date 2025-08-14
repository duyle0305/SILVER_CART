import { BaseTable } from '@/components/common/BaseTable'
import type { HeadCell } from '@/components/common/BaseTableHead'
import { SortType } from '@/constants'
import { StyledTableRow } from '@/features/users/components/styles/UserTable.styles'
import { useNotification } from '@/hooks/useNotification'
import { useTable } from '@/hooks/useTable'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteIcon from '@mui/icons-material/Delete'
import { Chip, IconButton, Stack, TableCell } from '@mui/material'
import { useDebounce } from 'ahooks'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PromotionTableToolbar, {
  type PromotionFilters,
} from './components/PromotionTableToolbar'
import { usePromotions } from './hooks/usePromotions'
import type { Promotion } from './types'
import { useRemovePromotionDialog } from './hooks/useRemovePromotionDialog'
import { authorizationAction } from '../authentication/constants'
import { useAuthContext } from '@/contexts/AuthContext'

const promotionHeadCells: readonly HeadCell<Promotion>[] = [
  { id: 'title', label: 'Title' },
  { id: 'discountPercent', label: 'Discount (%)' },
  { id: 'startAt', label: 'Start At' },
  { id: 'endAt', label: 'End At' },
  { id: 'isActive', label: 'Status' },
]

export default function ListPromotionPage() {
  const { user } = useAuthContext()
  const allowWritePromotion =
    user?.role && authorizationAction.allowWritePromotion.includes(user.role)
  const [filters, setFilters] = useState({
    keyword: '',
    isActive: true,
  })
  const navigate = useNavigate()
  const { hideNotification, showNotification } = useNotification()
  const table = useTable<Promotion>({
    initialOrderBy: 'title',
  })
  const { openRemovePromotionDialog } = useRemovePromotionDialog()
  const debounceKeyword = useDebounce(filters.keyword, { wait: 500 })
  const { data, isLoading, isError } = usePromotions({
    keyword: debounceKeyword,
    isActive: filters.isActive,
    page: table.page + 1,
    pageSize: table.rowsPerPage,
    sortAscending: table.order === SortType.Ascending,
    sortBy: table.orderBy,
  })

  const promotions = useMemo(() => data?.items || [], [data?.items])
  const pageCount = useMemo(
    () => (data ? Math.ceil(data.totalItems / data.pageSize) : 0),
    [data]
  )

  const onRowClick = (promotionId: string) => {
    navigate(`/promotions/${promotionId}`)
  }

  const handleFiltersChange = useCallback(
    (name: keyof PromotionFilters, value: unknown) => {
      setFilters((prev) => ({ ...prev, [name]: value }))
      table.setFilterPage(0)
    },
    [table]
  )

  const renderTableRow = (promotion: Promotion, _: boolean, index: number) => {
    return (
      <StyledTableRow
        key={promotion.id}
        hover
        onClick={() => onRowClick(promotion.id)}
      >
        <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
        <TableCell>{promotion.title}</TableCell>
        <TableCell>{promotion.discountPercent}%</TableCell>
        <TableCell>{dayjs(promotion.startAt).format('LLL')}</TableCell>
        <TableCell>{dayjs(promotion.endAt).format('LLL')}</TableCell>
        <TableCell>
          {promotion.isActive ? (
            <Chip label="Active" color="success" />
          ) : (
            <Chip label="Inactive" color="error" />
          )}
        </TableCell>
        {allowWritePromotion && (
          <TableCell>
            <Stack direction="row" spacing={2}>
              <IconButton
                size="small"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/promotions/edit/${promotion.id}`)
                }}
              >
                <BorderColorIcon fontSize="small" />
              </IconButton>
              {promotion.isActive && (
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation()
                    openRemovePromotionDialog(promotion.id)
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </TableCell>
        )}
      </StyledTableRow>
    )
  }

  useEffect(() => {
    if (isError) {
      showNotification('Failed to load promotions.', 'error')
    } else {
      hideNotification()
    }
  }, [])

  return (
    <BaseTable
      data={promotions}
      headCells={promotionHeadCells}
      isLoading={isLoading}
      pageCount={pageCount}
      table={table}
      toolbar={
        <PromotionTableToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      }
      renderRow={renderTableRow}
      showCheckbox={false}
      allowModify={allowWritePromotion}
    />
  )
}
