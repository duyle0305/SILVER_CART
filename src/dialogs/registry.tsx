import { Button, DialogContentText, Stack, Typography } from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'

export const confirmLogoutDialog = (
  onConfirm: () => void,
  onCancel: () => void
) => {
  return {
    title: (
      <Stack direction="row" alignItems="center" spacing={1}>
        <WarningIcon color="warning" />
        <Typography variant="h6" component="h2">
          Log Out
        </Typography>
      </Stack>
    ),
    content: (
      <DialogContentText>
        Are you sure you want to log out of your account?
      </DialogContentText>
    ),
    actions: (
      <>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Log Out
        </Button>
      </>
    ),
  }
}

export const confirmRemovePromotionDialog = (
  onConfirm: () => void,
  onCancel: () => void
) => {
  return {
    title: (
      <Stack direction="row" alignItems="center" spacing={1}>
        <WarningIcon color="warning" />
        <Typography variant="h6" component="h2">
          Remove Promotion
        </Typography>
      </Stack>
    ),
    content: (
      <DialogContentText>
        Are you sure you want to remove this promotion?
      </DialogContentText>
    ),
    actions: (
      <>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Remove
        </Button>
      </>
    ),
  }
}
