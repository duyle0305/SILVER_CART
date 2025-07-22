import { Box, Button, Link, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Root = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
})

export const IllustrationWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50%',
  backgroundColor: theme.palette.primary['400'],
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

export const FormContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '50%',
  padding: '2rem',
  flex: 1,
})

export const StyledForm = styled('form')({
  width: '100%',
  maxWidth: '400px',
})

export const Title = styled(Typography)({
  marginBottom: '0.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
})

export const Subtitle = styled(Typography)(({ theme }) => ({
  marginBottom: '2rem',
  color: theme.palette.grey[600],
  textAlign: 'center',
}))

export const LoginButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(2),
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
}))

export const ForgotPasswordLink = styled(Link)({
  display: 'block',
  textAlign: 'center',
  marginTop: '1.5rem',
  cursor: 'pointer',
})

export const FooterContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}))
