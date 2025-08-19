import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import PersonIcon from '@mui/icons-material/Person'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useUserDetail } from '../users/hooks/useUserDetail'
import { useReportDetail } from './hooks/useReportDetail'

export default function ReportDetailsPage() {
  const { id = '' } = useParams()
  const { data: report, isLoading, isError } = useReportDetail(id)
  const { data: user, isLoading: isUserLoading } = useUserDetail(
    report?.userId ?? '',
    !!report?.userId
  )
  const { data: consultant, isLoading: isConsultantLoading } = useUserDetail(
    report?.consultantId ?? '',
    !!report?.consultantId
  )
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()

  useEffect(() => {
    if (isError) {
      showNotification('Failed to fetch report details', 'error')
    }
  }, [isError])

  useEffect(() => {
    if (isLoading) {
      showLoader()
    } else {
      hideLoader()
    }
  }, [isLoading])

  return (
    <Box p={3}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Report Details
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={3}>
            <Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Title
                  </Typography>
                  <Typography variant="body1">{report?.title}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        User Being Supported
                      </Typography>
                      {isUserLoading ? (
                        <Typography variant="body2">Loading...</Typography>
                      ) : (
                        <Typography variant="body1">
                          {user?.fullName ?? report?.userId}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      <AssignmentIndIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Reported By (Consultant)
                      </Typography>
                      {isConsultantLoading ? (
                        <Typography variant="body2">Loading...</Typography>
                      ) : (
                        <Typography variant="body1">
                          {consultant?.fullName ?? report?.consultantId}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Description
              </Typography>
              <Typography
                variant="body1"
                whiteSpace="pre-line"
                dangerouslySetInnerHTML={{ __html: report?.description ?? '' }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
