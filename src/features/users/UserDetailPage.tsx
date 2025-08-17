import CakeIcon from '@mui/icons-material/Cake'
import EmailIcon from '@mui/icons-material/Email'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import PaymentIcon from '@mui/icons-material/Payment'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import EmergencyIcon from '@mui/icons-material/Emergency'
import BlockIcon from '@mui/icons-material/Block'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserDetail } from './hooks/useUserDetail'
import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'
import dayjs from 'dayjs'
import { useBanOrUnbanUser } from './hooks/useBanOrUnbanUser'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import HomeIcon from '@mui/icons-material/Home'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'

const genderLabel = (gender?: number) =>
  gender === 1
    ? 'Male'
    : gender === 2
      ? 'Female'
      : gender === 3
        ? 'Other'
        : 'Unknown'

const Metric: React.FC<{
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}> = ({ icon, label, value }) => (
  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
    <CardContent>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="h6">{value}</Typography>
    </CardContent>
  </Card>
)

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showLoader, hideLoader } = useLoader()
  const { showNotification } = useNotification()
  const { mutateAsync: banOrUnbanUser } = useBanOrUnbanUser()

  if (!id) {
    navigate('/users')
  }

  const { data, isLoading, error, refetch } = useUserDetail(id || '')
  const {
    data: guardian,
    isLoading: isGuardianLoading,
    error: guardianError,
    refetch: refetchGuardian,
  } = useUserDetail(data?.guardianId ?? '', !data?.guardianId)

  const isBanned = !!data?.isDeleted
  const banButtonCfg = useMemo(
    () =>
      isBanned
        ? {
            color: 'success' as const,
            text: 'Unban user',
            icon: <LockOpenIcon />,
          }
        : { color: 'error' as const, text: 'Ban user', icon: <BlockIcon /> },
    [isBanned]
  )

  const [confirmOpen, setConfirmOpen] = useState(false)

  const openConfirm = () => setConfirmOpen(true)
  const closeConfirm = () => setConfirmOpen(false)
  const isElder = useMemo(() => data?.roleName === 'Elder', [data?.roleName])
  const hasGuardian =
    !!guardian?.fullName ||
    !!guardian?.phoneNumber ||
    !!guardian?.relationShip ||
    !!guardian?.addresses

  useEffect(() => {
    if (isLoading) showLoader()
    else hideLoader()
  }, [isLoading])

  useEffect(() => {
    if (error) {
      showNotification('Failed to load user details', 'error')
    }
  }, [error])

  useEffect(() => {
    if (data) {
      refetchGuardian()
    }
  }, [data, refetchGuardian])

  const handleConfirm = async () => {
    if (!id) return
    try {
      showLoader()
      await banOrUnbanUser(id)
      showNotification(
        isBanned
          ? 'User has been unbanned successfully.'
          : 'User has been banned successfully.',
        'success'
      )
      await refetch?.()
    } catch (e: any) {
      showNotification(e?.message || 'Action failed', 'error')
    } finally {
      hideLoader()
      closeConfirm()
    }
  }

  return (
    <Stack spacing={3}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar
                src={data?.avatar ?? undefined}
                alt={data?.fullName}
                sx={{ width: 72, height: 72 }}
              >
                <PersonIcon />
              </Avatar>
              <Stack spacing={0.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6">
                    {data?.fullName || 'Unnamed User'}
                  </Typography>
                  {isBanned && (
                    <Chip
                      label="Banned"
                      variant="filled"
                      color="error"
                      size="small"
                    />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  @{data?.userName}
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 1, flexWrap: 'wrap' }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <EmailIcon fontSize="small" />
                    <Tooltip title="email">
                      <Typography variant="body2">
                        {data?.email || '—'}
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PhoneIcon fontSize="small" />
                    <Tooltip title="phone number">
                      <Typography variant="body2">
                        {data?.phoneNumber || '—'}
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <EmergencyIcon fontSize="small" color="error" />
                    <Tooltip title="emergency phone number">
                      <Typography variant="body2">
                        {data?.emergencyPhoneNumber || '—'}
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CakeIcon fontSize="small" />
                    <Tooltip title="birthdate">
                      <Typography variant="body2">
                        {dayjs(data?.birthDate).format('DD/MM/YYYY')}{' '}
                        {data?.age ? `• ${data?.age} yrs` : ''}
                      </Typography>
                    </Tooltip>
                  </Stack>
                  <Chip size="small" label={data?.roleName || 'No role'} />
                  <Chip
                    size="small"
                    variant="outlined"
                    label={genderLabel(data?.gender)}
                  />
                </Stack>
              </Stack>
            </Grid>

            <Grid>
              <Button
                variant={isBanned ? 'outlined' : 'contained'}
                color={banButtonCfg.color}
                startIcon={banButtonCfg.icon}
                onClick={openConfirm}
              >
                {banButtonCfg.text}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Metric
            icon={<LoyaltyIcon fontSize="small" />}
            label="Reward Points"
            value={data?.rewardPoint}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Metric
            icon={<ShoppingCartIcon fontSize="small" />}
            label="Cart Count"
            value={data?.cartCount}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Metric
            icon={<PaymentIcon fontSize="small" />}
            label="Payment Count"
            value={data?.paymentCount}
          />
        </Grid>
      </Grid>

      {data?.description ? (
        <Card
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              About
            </Typography>
            <Typography variant="body2" whiteSpace="pre-wrap">
              {data?.description}
            </Typography>
          </CardContent>
        </Card>
      ) : null}

      {isElder && (
        <Card
          elevation={0}
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1.5 }}
            >
              <SupervisorAccountIcon fontSize="small" />
              <Typography variant="subtitle1">Guardian</Typography>
              {guardian?.relationShip && (
                <Chip
                  size="small"
                  variant="outlined"
                  color="info"
                  icon={<FamilyRestroomIcon />}
                  label={guardian.relationShip}
                  sx={{ ml: 1 }}
                />
              )}
            </Stack>

            {hasGuardian ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2">
                      {guardian.fullName || '—'}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon fontSize="small" />
                    <Tooltip title="guardian email">
                      <Typography variant="body2">
                        {guardian.email || '—'}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ContactPhoneIcon fontSize="small" />
                    <Tooltip title="guardian phone">
                      <Typography variant="body2">
                        {guardian.phoneNumber || '—'}
                      </Typography>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No guardian information
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Promotions
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {data?.userPromotions?.length ? (
                  data.userPromotions.map((promotion, index) => (
                    <Chip key={index} size="small" label={promotion} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No promotions
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Category Labels
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {data?.categoryLabels?.length ? (
                  data?.categoryLabels.map((categoryLabel, index) => (
                    <Chip
                      key={index}
                      size="small"
                      variant="outlined"
                      label={categoryLabel}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No labels
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
            Addresses
          </Typography>

          {data?.addresses?.length ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Street</TableCell>
                    <TableCell>Ward</TableCell>
                    <TableCell>District</TableCell>
                    <TableCell>Province</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.addresses.map((address) => (
                    <TableRow key={address.id} hover>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2">
                          {address.streetAddress}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          WardCode: {address.wardCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {address.wardName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {address.districtName}{' '}
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            ({address.districtID})
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {address.provinceName}{' '}
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            ({address.provinceID})
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>{address.phoneNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No addresses
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={closeConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>
          {isBanned ? 'Confirm unban user' : 'Confirm ban user'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isBanned
              ? 'Are you sure you want to unban this user? They will regain access to the system.'
              : 'Are you sure you want to ban this user? They will lose access to the system.'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirm}>Cancel</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={isBanned ? 'success' : 'error'}
            startIcon={isBanned ? <LockOpenIcon /> : <BlockIcon />}
          >
            {isBanned ? 'Unban' : 'Ban'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default UserDetailPage
