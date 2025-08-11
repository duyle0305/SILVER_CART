import CakeIcon from '@mui/icons-material/Cake'
import EmailIcon from '@mui/icons-material/Email'
import LoyaltyIcon from '@mui/icons-material/Loyalty'
import PaymentIcon from '@mui/icons-material/Payment'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserDetail } from './hooks/useUserDetail'
import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'

const genderLabel = (gender?: number) =>
  gender === 1
    ? 'Male'
    : gender === 2
      ? 'Female'
      : gender === 3
        ? 'Other'
        : 'Unknown'

const fmtDate = (dateString?: string) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString()
}

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
  if (!id) {
    navigate('/users')
  }

  const { data, isLoading, error } = useUserDetail(id || '')
  if (isLoading) {
    showLoader()
  } else {
    hideLoader()
  }

  useEffect(() => {
    if (error) {
      showNotification('Failed to load user details', 'error')
    }
  }, [error])

  return (
    <Stack spacing={3}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid>
              <Avatar
                src={data?.avatar ?? undefined}
                alt={data?.fullName}
                sx={{ width: 72, height: 72 }}
              >
                <PersonIcon />
              </Avatar>
            </Grid>
            <Grid>
              <Stack spacing={0.5}>
                <Typography variant="h6">
                  {data?.fullName || 'Unnamed User'}
                </Typography>
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
                    <Typography variant="body2">
                      {data?.email || '—'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">
                      {data?.phoneNumber || '—'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CakeIcon fontSize="small" />
                    <Typography variant="body2">
                      {fmtDate(data?.birthDate)}{' '}
                      {data?.age ? `• ${data?.age} yrs` : ''}
                    </Typography>
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
    </Stack>
  )
}

export default UserDetailPage
