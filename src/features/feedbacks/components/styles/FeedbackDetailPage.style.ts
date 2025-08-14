import { Box, Card, styled, Typography } from '@mui/material'

export const Root = styled(Box)(({ theme }) => ({
  minHeight: '100%',
  background: theme.palette.background.default,
  padding: theme.spacing(3),
}))

export const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
}))

export const Label = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 700,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
}))

export const Value = styled(Typography)({
  fontSize: 15,
  fontWeight: 500,
})
