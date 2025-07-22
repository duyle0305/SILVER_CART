import { Box, styled, Toolbar } from '@mui/material'

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0 !important',
})

export const StyledToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}))
