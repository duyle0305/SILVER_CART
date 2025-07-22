import { styled } from '@mui/material'

export const Main = styled('main')({
  flexGrow: 1,
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
})

export const Content = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  flexGrow: 1,
  overflowY: 'auto',
  backgroundColor: theme.palette.primary.light,
}))
