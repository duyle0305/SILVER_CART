import {
  GrowBox,
  StyledAppBar,
  StyledAvatar,
  StyledSubtitle,
  StyledTitle,
} from '@/components/layout/styles/Header.styles'
import { useAuthContext } from '@/contexts/AuthContext'
import { isRouteHandle } from '@/types/router.d'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useLocation, useMatches, Link as RouterLink } from 'react-router-dom'

const Header = () => {
  const matches = useMatches()
  const location = useLocation()
  const { user } = useAuthContext()
  const isRootPath = location.pathname === '/'

  const crumbs = matches
    .filter(
      (match, index) =>
        isRouteHandle(match.handle) && match.handle.title && index > 0
    )
    .map((match) => {
      const { handle, pathname } = match
      return {
        title: (handle as { title: string }).title,
        path: pathname,
      }
    })

  const title =
    crumbs.length > 0 ? crumbs[crumbs.length - 1].title : 'Dashboard'

  console.log('crumbs', crumbs)

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Stack direction="column">
          {isRootPath ? (
            <>
              <StyledTitle variant="h5" fontWeight="bold">
                Welcome Back, {user?.userName}!
              </StyledTitle>
              <StyledSubtitle variant="subtitle1">
                Statistics of all SilverCart system data
              </StyledSubtitle>
            </>
          ) : (
            <StyledTitle variant="h5" fontWeight="bold">
              {title}
            </StyledTitle>
          )}

          <Breadcrumbs separator="›" sx={{ mt: 1 }}>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1
              return isLast ? (
                <Typography key={crumb.path} color="text.primary">
                  {crumb.title}
                </Typography>
              ) : (
                <Link
                  key={crumb.path}
                  component={RouterLink}
                  to={crumb.path}
                  underline="hover"
                  color="inherit"
                >
                  {crumb.title}
                </Link>
              )
            })}
          </Breadcrumbs>
        </Stack>

        <GrowBox />
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <Stack direction="row" alignItems="center" spacing={1}>
            <StyledAvatar />
            <Box>
              <Typography variant="body2" fontWeight="bold">
                {user?.userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Toolbar>
    </StyledAppBar>
  )
}

export default Header
