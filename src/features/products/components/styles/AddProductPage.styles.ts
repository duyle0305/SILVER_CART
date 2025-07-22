import { Box, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'

export const FormWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
}))

export const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '150px',
  width: '150px',
  textAlign: 'center',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}))
