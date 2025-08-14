import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Label,
  PageHeader,
  Root,
  SectionCard,
  StatCard,
  TitleWrap,
  Toolbar,
  Value,
} from './components/styles/PromotionDetailPage.style'
import { usePromotionDetail } from './hooks/usePromotionDetail'
import { useUpdatePromotion } from './hooks/useUpdatePromotion'
import { useAuthContext } from '@/contexts/AuthContext'
import { authorizationAction } from '../authentication/constants'

function formatDate(val?: string) {
  if (!val) return '-'
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return '-'
  return dayjs(val).format('LLL')
}

export default function PromotionDetailPage() {
  const { id } = useParams()
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()
  const navigate = useNavigate()
  const { data, isLoading, isError } = usePromotionDetail(id ?? '')
  const { mutate: updatePromotion } = useUpdatePromotion()
  const { user } = useAuthContext()
  const allowWritePromotion =
    user?.role && authorizationAction.allowWritePromotion.includes(user.role)

  const onToggleActive = (value: boolean) => {
    updatePromotion({ ...data, id: data?.id ?? '', isActive: value })
  }
  const onEdit = () => {
    navigate(`/promotions/edit/${data?.id}`)
  }

  useEffect(() => {
    if (isError) {
      showNotification('Failed to load promotion details.', 'error')
    }
  }, [isError, showNotification])

  useEffect(() => {
    if (isLoading) {
      showLoader()
    } else {
      hideLoader()
    }
  }, [isLoading, showLoader, hideLoader])

  return (
    <Root>
      <PageHeader>
        <TitleWrap>
          <Typography variant="h5" fontWeight={800}>
            {data?.title || '---'}
          </Typography>
        </TitleWrap>

        {allowWritePromotion && (
          <Toolbar>
            <Tooltip title={data?.isActive ? 'Deactivate' : 'Activate'}>
              <span>
                <Button
                  variant="outlined"
                  onClick={() => onToggleActive(!data?.isActive)}
                  color={data?.isActive ? 'error' : 'primary'}
                >
                  {data?.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </span>
            </Tooltip>
            <Tooltip title="Edit">
              <span>
                <IconButton
                  aria-label="Edit promotion"
                  onClick={() => onEdit()}
                >
                  <EditRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Toolbar>
        )}
      </PageHeader>

      <Divider />

      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard>
              <CardContent>
                <Label>Discount</Label>
                <Value>{data?.discountPercent ?? '-'} %</Value>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard>
              <CardContent>
                <Label>Required Points</Label>
                <Value>{data?.requiredPoints.toLocaleString() ?? '-'}</Value>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <StatCard>
              <CardContent>
                <Label>Created At</Label>
                <Value>{formatDate(data?.creationDate)}</Value>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>
      </Box>

      <Box mt={3} mb={6}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <SectionCard>
              <CardContent>
                <Label>Description</Label>
                <Typography variant="body1" mt={1.25}>
                  {data?.description || '—'}
                </Typography>
              </CardContent>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SectionCard>
              <CardContent>
                <Label>Schedule</Label>
                <Box mt={1.25} display="grid" gap={8}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Start
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDate(data?.startAt)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      End
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDate(data?.endAt)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Label>Metadata</Label>
                <Box mt={1.25} display="grid" gap={8}>
                  <MetaRow label="ID" value={id} />
                  <MetaRow
                    label="Status"
                    value={
                      data?.isActive ? (
                        <Typography color="success.main" fontWeight={500}>
                          Active
                        </Typography>
                      ) : (
                        <Typography color="error.main" fontWeight={500}>
                          Inactive
                        </Typography>
                      )
                    }
                  />
                </Box>
              </CardContent>
            </SectionCard>
          </Grid>
        </Grid>
      </Box>
    </Root>
  )
}

function MetaRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      gap={12}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} textAlign="right">
        {value ?? '—'}
      </Typography>
    </Box>
  )
}
