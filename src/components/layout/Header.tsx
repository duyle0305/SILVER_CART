import {
  GrowBox,
  StyledAppBar,
  StyledAvatar,
  StyledSubtitle,
  StyledTitle,
} from '@/components/layout/styles/Header.styles'
import { useAuthContext } from '@/contexts/AuthContext'
import { Role } from '@/features/authentication/constants'
import { PresenceStatus } from '@/features/users/constants'
import { useChangePresenceStatus } from '@/features/users/hooks/useChangePresenceStatus'
import { useGetConsultantStatus } from '@/features/users/hooks/useGetConsultantStatus'
import { isRouteHandle } from '@/types/router.d'
import {
  Box,
  Breadcrumbs,
  FormControl,
  Link,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Link as RouterLink, useLocation, useMatches } from 'react-router-dom'

const Header = () => {
  const matches = useMatches()
  const location = useLocation()
  const { user } = useAuthContext()
  const { mutate: changePresenceStatus, isSuccess } = useChangePresenceStatus()
  const {
    data: consultantStatusQuery,
    isLoading,
    refetch: refetchConsultantStatus,
  } = useGetConsultantStatus(
    user?.userId ?? '',
    !!user?.userId && user.role === Role.CONSULTANT
  )
  const consultantStatus = consultantStatusQuery ?? PresenceStatus.OFFLINE
  const isConsultant = user?.role === Role.CONSULTANT
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

  const handleChangeStatus = (newStatus: PresenceStatus) => {
    if (!user?.userId) return
    changePresenceStatus({ userId: user.userId, newStatus })
  }

  useEffect(() => {
    if (isSuccess) {
      refetchConsultantStatus()
    }
  }, [isSuccess])

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
          {isConsultant && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                key={`consultant-status-${consultantStatus}`}
                value={consultantStatus}
                onChange={(e) =>
                  handleChangeStatus(Number(e.target.value) as PresenceStatus)
                }
                disabled={isLoading}
              >
                <MenuItem value={PresenceStatus.ONLINE}>Online</MenuItem>
                <MenuItem value={PresenceStatus.OFFLINE}>Offline</MenuItem>
                <MenuItem value={PresenceStatus.BUSY}>Busy</MenuItem>
              </Select>
            </FormControl>
          )}
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
