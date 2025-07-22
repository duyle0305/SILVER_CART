import loginBanner from '@/assets/images/login-banner.png'
import LoginForm from '@/features/authentication/components/LoginForm.tsx'
import {
  IllustrationWrapper,
  Root,
} from '@/features/authentication/styles/LoginForm.styles'

const LoginPage = () => {
  return (
    <Root>
      <IllustrationWrapper>
        <img
          src={loginBanner}
          alt="Login Banner"
          style={{ maxWidth: '80%', height: 'auto' }}
        />
      </IllustrationWrapper>
      <LoginForm />
    </Root>
  )
}

export default LoginPage
