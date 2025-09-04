import { useAuthContext } from '@/contexts/AuthContext'
import { useLogin } from '@/features/authentication/hooks/useLogin'
import {
  loginSchema,
  type LoginFormInputs,
} from '@/features/authentication/schemas'
import {
  FooterContainer,
  FormContainer,
  LoginButton,
  StyledForm,
  Subtitle,
  Title,
} from '@/features/authentication/styles/LoginForm.styles'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Checkbox,
  Divider,
  FormControlLabel,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material'
import { useToggle } from 'ahooks'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const navigate = useNavigate()
  const { mutate: loginMutation, isPending } = useLogin()
  const [isShowAlert, { setRight: showAlert }] = useToggle()
  const { login } = useAuthContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: '',
      password: '',
      stayLoggedIn: false,
    },
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    const payload = {
      userName: data.userName,
      password: data.password,
    }

    loginMutation(payload, {
      onSuccess: async (responseData) => {
        await login(responseData, data.stayLoggedIn)
        navigate('/')
      },
      onError: () => {
        showAlert()
      },
    })
  }

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Title variant="h4">Welcome to SILVER CART SYSTEM</Title>
        <Subtitle variant="body1">Log in with the provided account.</Subtitle>

        {isShowAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid email or password. Please try again.
          </Alert>
        )}

        <Typography variant="subtitle1" fontWeight="medium">
          Username
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          placeholder="Enter username"
          {...register('userName')}
          error={!!errors.userName}
          helperText={errors.userName?.message}
        />

        <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2 }}>
          Password
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          type="password"
          placeholder="Enter password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <FormControlLabel
          control={<Checkbox color="primary" {...register('stayLoggedIn')} />}
          label="Stay logged in"
        />

        <LoginButton
          type="submit"
          fullWidth
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Log In'}
        </LoginButton>

        <Divider sx={{ m: 4 }} />
        <FooterContainer>
          <MuiLink href="#" underline="hover">
            Terms of Use
          </MuiLink>
          <MuiLink href="#" underline="hover">
            Security and Privacy
          </MuiLink>
        </FooterContainer>
      </StyledForm>
    </FormContainer>
  )
}

export default LoginForm
