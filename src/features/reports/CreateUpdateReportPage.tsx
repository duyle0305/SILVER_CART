import {
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Grid,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createReportSchema,
  type CreateReportFormInput,
  type CreateReportFormOutput,
} from './schemas'
import { RHFTiny } from './components/RHFTiny'
import { useNotification } from '@/hooks/useNotification'
import { useNavigate, useParams } from 'react-router-dom'

// Tùy bạn hiện có hooks nào — mình để sẵn signatures tương tự Promotion
import { useCreateReport } from './hooks/useCreateReport'
import { useUpdateReport } from './hooks/useUpdateReport'
import { useAuthContext } from '@/contexts/AuthContext'
// import { useReportDetail } from './hooks/useReportDetail'
// import { useLoader } from '@/hooks/useLoader'

export default function CreateUpdateReportPage() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { user } = useAuthContext()
  // const { showLoader, hideLoader } = useLoader()
  const { id } = useParams()
  const isEditMode = !!id

  const { mutate: createReport, isPending: isCreating } = useCreateReport()
  const { mutate: updateReport, isPending: isUpdating } = useUpdateReport()
  // const { data: reportDetail, isLoading: isLoadingDetail } = useReportDetail(
  //   id ?? ''
  // )

  const methods = useForm<CreateReportFormInput>({
    resolver: zodResolver(createReportSchema),
    defaultValues: {
      title: '',
      description: '',
    },
    mode: 'onBlur',
  })

  const { handleSubmit, reset, control } = methods

  const onSubmit = (raw: CreateReportFormInput) => {
    const parsed: CreateReportFormOutput = createReportSchema.parse(raw)

    if (isEditMode) {
      updateReport(
        { id: id!, ...parsed },
        {
          onSuccess: () => {
            showNotification('Report updated successfully!', 'success')
            navigate('/reports')
          },
          onError: (e: any) => {
            showNotification(e?.message || 'Failed to update report.', 'error')
          },
        }
      )
    } else {
      createReport(
        { ...parsed, userId: '', consultantId: user?.userId ?? '' },
        {
          onSuccess: () => {
            showNotification('Report created successfully!', 'success')
            navigate('/reports')
          },
          onError: (e: any) => {
            showNotification(e?.message || 'Failed to create report.', 'error')
          },
        }
      )
    }
  }

  // useEffect(() => {
  //   if (isEditMode) {
  //     if (isLoadingDetail) showLoader()
  //     else hideLoader()
  //   }
  // }, [isEditMode, isLoadingDetail, showLoader, hideLoader])

  // useEffect(() => {
  //   if (isEditMode && reportDetail) {
  //     reset({
  //       title: reportDetail.title ?? '',
  //       description: reportDetail.description ?? '',
  //       userId: reportDetail.userId ?? '',
  //       consultantId: reportDetail.consultantId ?? '',
  //     })
  //   }
  // }, [isEditMode, reportDetail, reset])

  return (
    <FormProvider {...methods}>
      <Paper component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          {isEditMode ? 'Update Report' : 'Create Report'}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RHFTiny name="description" />
          </Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          <Button variant="outlined" onClick={() => navigate('/reports')}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isCreating || isUpdating}
          >
            {isEditMode
              ? isUpdating
                ? 'Updating…'
                : 'Update'
              : isCreating
                ? 'Creating…'
                : 'Create'}
          </Button>
        </Stack>
      </Paper>
    </FormProvider>
  )
}
