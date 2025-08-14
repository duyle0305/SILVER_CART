import { Card, styled, Typography } from '@mui/material'

export const Root = styled('div')(({ theme }) => ({
  minHeight: '100%',
  background: theme.palette.background.default,
  paddingInline: theme.spacing(2),
}))

export const PageHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2, 0),
}))

export const TitleWrap = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}))

export const Toolbar = styled('div')(({ theme }) => ({
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}))

export const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: 12,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}))

export const Label = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.4,
  color: theme.palette.text.secondary,
  textTransform: 'uppercase',
}))

export const Value = styled(Typography)({
  fontSize: 20,
  fontWeight: 700,
})

export const SectionCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
}))
