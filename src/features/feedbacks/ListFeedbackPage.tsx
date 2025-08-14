import type { HeadCell } from '@/components/common/BaseTableHead'
import { SortType } from '@/constants'
import { useTable } from '@/hooks/useTable'
import MessageIcon from '@mui/icons-material/Message'
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead'
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff'
import { Chip, IconButton, Stack, TableCell } from '@mui/material'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StyledTableRow } from '../users/components/styles/UserTable.styles'
import { FeedbackStatus } from './constants'
import { useFeedbacks } from './hooks/useFeedbacks'
import type { Feedback } from './types'
import { useNotification } from '@/hooks/useNotification'
import { useDebounce } from 'ahooks'
import { BaseTable } from '@/components/common/BaseTable'
import FeedbackTableToolbar, {
  type FeedbackFilters,
} from './components/FeedbackTableToolbar'

const feedbackHeadCells: readonly HeadCell<Feedback>[] = [
  { id: 'title', label: 'Title' },
  { id: 'status', label: 'Status' },
  { id: 'respondedAt', label: 'Respond At' },
]

export default function ListFeedbackPage() {
  const [filters, setFilters] = useState({
    keyword: '',
    status: undefined,
  })
  const table = useTable<Feedback>({ initialOrderBy: 'title' })
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const debounceKeyword = useDebounce(filters.keyword, { wait: 500 })
  const { data, isLoading, isError } = useFeedbacks({
    userId: null,
    page: table.page + 1,
    pageSize: table.rowsPerPage,
    sortBy: table.orderBy,
    sortAscending: table.order === SortType.Ascending,
    keyword: debounceKeyword,
    status: filters.status ? Number(filters.status) : undefined,
  })
  const feedbacks = useMemo(() => data?.items || [], [data?.items])
  const pageCount = useMemo(
    () => (data ? Math.ceil(data.totalItems / data.pageSize) : 0),
    [data]
  )

  const onRowClick = (feedbackId: string) => {
    navigate(`/feedbacks/${feedbackId}`)
  }

  const handleFiltersChange = useCallback(
    (name: keyof FeedbackFilters, value: unknown) => {
      setFilters((prev) => ({ ...prev, [name]: value }))
      table.setFilterPage(0)
    },
    [table]
  )

  const renderStatus = (status: FeedbackStatus) => {
    switch (status) {
      case FeedbackStatus.RESOLVED:
        return <Chip label="Resolved" color="success" />
      case FeedbackStatus.PENDING:
        return <Chip label="Pending" color="warning" />
      case FeedbackStatus.REJECTED:
        return <Chip label="Rejected" color="error" />
      case FeedbackStatus.IN_PROGRESS:
        return <Chip label="In Progress" color="info" />
      default:
        return null
    }
  }

  const renderAction = (status: FeedbackStatus, feedbackId: string) => {
    switch (status) {
      case FeedbackStatus.RESOLVED:
        return <MarkChatReadIcon fontSize="small" color="success" />
      case FeedbackStatus.IN_PROGRESS:
      case FeedbackStatus.PENDING:
        return (
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`respond/${feedbackId}`)
            }}
          >
            <MessageIcon fontSize="small" />
          </IconButton>
        )
      case FeedbackStatus.REJECTED:
        return (
          <IconButton size="small" color="error">
            <SpeakerNotesOffIcon fontSize="small" />
          </IconButton>
        )
      default:
        return null
    }
  }

  const renderTableRow = (feedback: Feedback, _: boolean, index: number) => {
    return (
      <StyledTableRow
        key={feedback.id}
        hover
        onClick={() => onRowClick(feedback.id)}
      >
        <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
        <TableCell>{feedback.title}</TableCell>
        <TableCell>{dayjs(feedback.respondedAt).format('LLL')}</TableCell>
        <TableCell>{renderStatus(feedback.status)}</TableCell>
        <TableCell>
          <Stack direction="row" spacing={2}>
            {renderAction(feedback.status, feedback.id)}
          </Stack>
        </TableCell>
      </StyledTableRow>
    )
  }

  useEffect(() => {
    if (isError) {
      showNotification('Failed to load promotions.', 'error')
    }
  }, [])

  return (
    <BaseTable
      data={feedbacks}
      headCells={feedbackHeadCells}
      isLoading={isLoading}
      pageCount={pageCount}
      table={table}
      toolbar={
        <FeedbackTableToolbar
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      }
      renderRow={renderTableRow}
      showCheckbox={false}
    />
  )
}
