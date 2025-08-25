import type { HeadCell } from '@/components/common/BaseTableHead'
import { useTable } from '@/hooks/useTable'
import { useNavigate } from 'react-router-dom'
import type { Report } from '@/features/reports/types'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'ahooks'
import { useReports } from './hooks/useReports'
import { SortType } from '@/constants'
import { useNotification } from '@/hooks/useNotification'
import { Box, IconButton, Skeleton, TableCell } from '@mui/material'
import { BaseTable } from '@/components/common/BaseTable'
import ReportToolbar from './components/ReportToolbar'
import { StyledTableRow } from '../users/components/styles/UserTable.styles'
import { useUserDetail } from '../users/hooks/useUserDetail'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import { useAuthContext } from '@/contexts/AuthContext'
import { authorizationAction, Role } from '../authentication/constants'

const reportHeadCells: readonly HeadCell<Report>[] = [
  { id: 'title', label: 'Title' },
  { id: 'userId', label: 'User' },
  { id: 'consultantId', label: 'Consultant' },
]

export default function ListReportPage() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { user } = useAuthContext()
  const allowWriteReport =
    user?.role && authorizationAction.allowWriteReport.includes(user.role)
  const table = useTable<Report>({ initialOrderBy: 'title' })
  const [keyword, setKeyword] = useState('')
  const debouncedKeyword = useDebounce(keyword, { wait: 500 })
  const { data, isLoading, isError } = useReports({
    keyword: debouncedKeyword,
    page: table.page + 1,
    pageSize: table.rowsPerPage,
    sortAscending: table.order === SortType.Ascending,
    sortBy: table.orderBy as string,
    consultantId: user?.role === Role.CONSULTANT ? user.userId : undefined,
  })

  const reports = useMemo(() => data?.items || [], [data?.items])
  const pageCount = useMemo(
    () => (data ? Math.ceil(data.totalItems / data.pageSize) : 0),
    [data]
  )

  const handleRowClick = (reportId: string) => {
    navigate(`/reports/${reportId}`)
  }

  const renderReportRow = (report: Report, _: boolean, index: number) => {
    const { data: userData, isLoading: isUserLoading } = useUserDetail(
      report.userId
    )

    const { data: consultantData, isLoading: isConsultantLoading } =
      useUserDetail(report.consultantId)

    return (
      <StyledTableRow
        key={report.id}
        hover
        onClick={() => handleRowClick(report.id)}
      >
        <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
        <TableCell>{report.title}</TableCell>
        <TableCell>
          {isUserLoading ? <Skeleton width={100} /> : userData?.fullName}
        </TableCell>
        <TableCell>
          {isConsultantLoading ? (
            <Skeleton width={100} />
          ) : (
            consultantData?.fullName
          )}
        </TableCell>
        {allowWriteReport && (
          <TableCell>
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/reports/edit/${report.id}`)
              }}
            >
              <BorderColorIcon fontSize="small" />
            </IconButton>
          </TableCell>
        )}
      </StyledTableRow>
    )
  }

  useEffect(() => {
    if (isError) {
      showNotification('Error fetching reports', 'error')
    }
  }, [isError])

  return (
    <Box>
      <BaseTable
        data={reports}
        headCells={reportHeadCells}
        isLoading={isLoading}
        pageCount={pageCount}
        table={table}
        toolbar={
          <ReportToolbar keyword={keyword} onKeywordChange={setKeyword} />
        }
        showCheckbox={false}
        renderRow={renderReportRow}
        allowModify={allowWriteReport}
      />
    </Box>
  )
}
