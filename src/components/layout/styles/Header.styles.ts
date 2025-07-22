import { AppBar, Avatar, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.primary.light,
  boxShadow: 'none',
  color: theme.palette.text.primary,
  paddingBlock: theme.spacing(2),
}))

export const GrowBox = styled(Box)({
  flexGrow: 1,
})

export const StyledAvatar = styled(Avatar)({
  width: 32,
  height: 32,
})

export const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary[600],
}))

export const StyledSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary[600],
  fontSize: '0.875rem',
  fontWeight: 400,
  marginTop: theme.spacing(0.5),
}))
