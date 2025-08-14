import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { FeedbackStatus } from './constants'
import { useNavigate, useParams } from 'react-router-dom'
import { useFeedbackDetail } from './hooks/useFeedbackDetail'
import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'
import { useEffect } from 'react'
import {
  Label,
  Root,
  SectionCard,
  Value,
} from './components/styles/FeedbackDetailPage.style'
import dayjs from 'dayjs'
import { useUserDetail } from '../users/hooks/useUserDetail'
import SendIcon from '@mui/icons-material/Send'

const renderStatusChip = (status: number) => {
  switch (status) {
    case FeedbackStatus.PENDING:
      return <Chip label="Pending" color="warning" size="small" />
    case FeedbackStatus.IN_PROGRESS:
      return <Chip label="In Progress" color="info" size="small" />
    case FeedbackStatus.RESOLVED:
      return <Chip label="Resolved" color="success" size="small" />
    case FeedbackStatus.REJECTED:
      return <Chip label="Rejected" color="error" size="small" />
    default:
      return <Chip label="Unknown" size="small" />
  }
}

export default function FeedbackDetailPage() {
  const { id = '' } = useParams()
  const { data, isLoading, error } = useFeedbackDetail(id)
  const { data: userData } = useUserDetail(data?.userId || '')
  const { data: adminData } = useUserDetail(data?.adminId || '')
  const { hideLoader, showLoader } = useLoader()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  useEffect(() => {
    if (isLoading) {
      showLoader()
    } else {
      hideLoader()
    }

    if (error) {
      showNotification(error.message, 'error')
    }
  }, [isLoading, error])

  const onRespondClick = () => {
    navigate(`/feedbacks/response/${id}`)
  }

  return (
    <Root>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Feedback Detail
        </Typography>

        {data?.status === FeedbackStatus.PENDING && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRespondClick}
            endIcon={<SendIcon />}
          >
            Respond
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Submitted Feedback
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Label>Title</Label>
                  <Value>{data?.title}</Value>
                </Box>

                <Box>
                  <Label>Description</Label>
                  <Typography variant="body2" whiteSpace="pre-wrap">
                    {data?.description}
                  </Typography>
                </Box>

                <Box>
                  <Label>Image</Label>
                  {data?.imagePath ? (
                    <Box
                      component="img"
                      src={data.imagePath}
                      alt="Feedback"
                      sx={{
                        width: '100%',
                        maxHeight: 280,
                        objectFit: 'contain',
                        borderRadius: 1,
                        border: '1px solid #eee',
                        mt: 1,
                      }}
                    />
                  ) : (
                    <Value>—</Value>
                  )}
                </Box>

                <Box>
                  <Label>User</Label>
                  <Value>{userData?.fullName || '—'}</Value>
                </Box>

                <Box>
                  <Label>Status</Label>
                  {renderStatusChip(data?.status ?? 0)}
                </Box>
              </Stack>
            </CardContent>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <SectionCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Response
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Label>Response Message</Label>
                  {data?.responseMessage ? (
                    <Typography
                      variant="body2"
                      whiteSpace="pre-wrap"
                      dangerouslySetInnerHTML={{ __html: data.responseMessage }}
                    />
                  ) : (
                    <Value sx={{ fontStyle: 'italic' }}>No response yet</Value>
                  )}
                </Box>

                <Box>
                  <Label>Attachment</Label>
                  {data?.responseAttachment ? (
                    <a
                      href={data.responseAttachment}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Typography
                        color="primary"
                        sx={{ wordBreak: 'break-all' }}
                      >
                        {data.responseAttachment}
                      </Typography>
                    </a>
                  ) : (
                    <Value>—</Value>
                  )}
                </Box>

                <Box>
                  <Label>Responded At</Label>
                  <Value>{dayjs(data?.respondedAt).format('LLL')}</Value>
                </Box>

                <Box>
                  <Label>Admin</Label>
                  <Value>{adminData?.fullName || '—'}</Value>
                </Box>
              </Stack>
            </CardContent>
          </SectionCard>
        </Grid>
      </Grid>
    </Root>
  )
}
