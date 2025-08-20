import { Box, Toolbar } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 !important',
})
