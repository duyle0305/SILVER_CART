import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Stack,
  Avatar,
  Typography,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

interface LogoutConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

const LogoutConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
}: LogoutConfirmationDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ p: 4 }}>
        <Stack alignItems="center" spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: 'error.lighter', width: 48, height: 48 }}>
              <LogoutIcon color="error" sx={{ fontSize: 28 }} />
            </Avatar>
            <Typography variant="h5" component="h2">
              Log Out
            </Typography>
          </Stack>
          <DialogContentText textAlign="center">
            Are you sure you want to log out of your account?
          </DialogContentText>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ width: '100px' }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
          sx={{ width: '100px' }}
        >
          Log Out
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LogoutConfirmationDialog
