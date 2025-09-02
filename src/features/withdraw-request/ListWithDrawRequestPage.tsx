import { BaseTable } from '@/components/common/BaseTable'
import {
  Box,
  Chip,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from '@mui/material'
import type { WithdrawRequest } from './types'
import { useTable } from '@/hooks/useTable'
import { useGetWithdrawRequest } from './hooks/useGetWithdrawRequest'
import { useApproveWithDrawRequest } from './hooks/useApproveWithDrawRequest'
import { useRejectWithDrawRequest } from './hooks/useRejectWithDrawRequest'
import { useState } from 'react'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded'
import RejectReasonDialog from './components/RejectReasonDialog'
import { WithdrawRequestStatus } from './constants'
import dayjs from 'dayjs'

const headCells = [
  { id: 'bankName', label: 'Bank Name' },
  { id: 'bankAccountNumber', label: 'Account Number' },
  { id: 'accountHolder', label: 'Account Holder' },
  { id: 'note', label: 'Note' },
  { id: 'amount', label: 'Amount' },
  { id: 'withdrawStatus', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
]

export default function ListWithDrawRequestPage() {
  const table = useTable<WithdrawRequest>({ initialOrderBy: 'bankName' })
  const { data: withdrawRequests = [], isLoading } = useGetWithdrawRequest()
  const { mutate: approveWithdrawRequest } = useApproveWithDrawRequest()

  const { mutate: rejectWithdrawRequest, isPending: isRejecting } =
    useRejectWithDrawRequest()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  )

  const handleOpenRejectDialog = (id: string) => {
    setSelectedRequestId(id)
    setDialogOpen(true)
  }

  const handleCloseRejectDialog = () => {
    setSelectedRequestId(null)
    setDialogOpen(false)
  }

  const handleSubmitRejectReason = (reason: string) => {
    if (selectedRequestId) {
      rejectWithdrawRequest(
        { id: selectedRequestId, reason },
        {
          onSuccess: () => {
            handleCloseRejectDialog()
          },
        }
      )
    }
  }

  const renderRowStatus = (status: WithdrawRequestStatus) => {
    const color: Record<
      WithdrawRequestStatus,
      'error' | 'warning' | 'success'
    > = {
      [WithdrawRequestStatus.PENDING]: 'warning',
      [WithdrawRequestStatus.APPROVED]: 'success',
      [WithdrawRequestStatus.REJECTED]: 'error',
    }
    const label = {
      [WithdrawRequestStatus.PENDING]: 'Pending',
      [WithdrawRequestStatus.APPROVED]: 'Approved',
      [WithdrawRequestStatus.REJECTED]: 'Rejected',
    }
    console.log('label', status)

    return <Chip label={label[status]} color={color[status]} />
  }

  const renderRow = (row: WithdrawRequest, _: boolean, index: number) => {
    const isPending = row.status === WithdrawRequestStatus.PENDING

    return (
      <TableRow key={row.id} hover>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{row.bankName}</TableCell>
        <TableCell>{row.bankAccountNumber}</TableCell>
        <TableCell>{row.accountHolder}</TableCell>
        <TableCell>{row.note}</TableCell>
        <TableCell>{row.amount}</TableCell>
        <TableCell>{renderRowStatus(row.status)}</TableCell>
        <TableCell>{dayjs(row.createdAt).format('LLL')}</TableCell>
        <TableCell>
          {isPending ? (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Approve">
                <IconButton
                  color="success"
                  onClick={() => approveWithdrawRequest(row.id)}
                >
                  <CheckCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  color="error"
                  onClick={() => handleOpenRejectDialog(row.id)}
                >
                  <HighlightOffRoundedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            '-'
          )}
        </TableCell>
      </TableRow>
    )
  }

  return (
    <Box>
      <BaseTable<WithdrawRequest>
        data={withdrawRequests}
        headCells={headCells}
        isLoading={isLoading}
        pageCount={0}
        table={table}
        toolbar={<></>}
        showPagination={false}
        showCheckbox={false}
        isSortable={false}
        renderRow={renderRow}
      />

      <RejectReasonDialog
        open={dialogOpen}
        isSubmitting={isRejecting}
        onClose={handleCloseRejectDialog}
        onSubmit={handleSubmitRejectReason}
      />
    </Box>
  )
}
