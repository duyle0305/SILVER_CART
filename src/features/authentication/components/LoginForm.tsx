import { useLogin } from '@/features/authentication/hooks/useLogin'
import {
  loginSchema,
  type LoginFormInputs,
} from '@/features/authentication/schemas'
import {
  FooterContainer,
  ForgotPasswordLink,
  FormContainer,
  LoginButton,
  StyledForm,
  Subtitle,
  Title,
} from '@/features/authentication/styles/LoginForm.styles'
import { saveTokens } from '@/features/authentication/utils/tokenStorage'
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
  const { mutate: login, isPending } = useLogin()
  const [isShowAlert, { setRight: showAlert }] = useToggle()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      stayLoggedIn: false,
    },
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    const payload = {
      email: data.email,
      password: data.password,
    }

    login(payload, {
      onSuccess: (responseData) => {
        saveTokens(
          responseData.accessToken,
          responseData.refreshToken,
          data.stayLoggedIn
        )
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
        <Title variant="h4">Welcome to SILVERCART SYSTEM</Title>
        <Subtitle variant="body1">Log in with the provided account.</Subtitle>

        {isShowAlert && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Invalid email or password. Please try again.
          </Alert>
        )}

        <Typography variant="subtitle1" fontWeight="medium">
          Email
        </Typography>
        <TextField
          fullWidth
          margin="dense"
          placeholder="Enter email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
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
          loading={isPending}
        >
          Log In
        </LoginButton>

        <ForgotPasswordLink underline="hover">
          I forgot my password
        </ForgotPasswordLink>

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
