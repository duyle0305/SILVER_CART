import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useState } from 'react'

interface RejectReasonDialogProps {
  open: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
}

export default function RejectReasonDialog({
  open,
  isSubmitting,
  onClose,
  onSubmit,
}: RejectReasonDialogProps) {
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason)
    }
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reason for Rejection</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="reason"
          label="Reason"
          type="text"
          fullWidth
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          multiline
          rows={4}
          placeholder="Please provide a reason for rejecting this request..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!reason.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Confirm Reject'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
