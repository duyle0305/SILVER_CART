import { useNotification } from '@/hooks/useNotification'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { RHFTiny } from './components/RHFTiny'
import {
  createReportSchema,
  type CreateReportFormInput,
  type CreateReportFormOutput,
} from './schemas'

import { useAuthContext } from '@/contexts/AuthContext'
import { useLoader } from '@/hooks/useLoader'
import { useCreateReport } from './hooks/useCreateReport'
import { useReportDetail } from './hooks/useReportDetail'
import { useUpdateReport } from './hooks/useUpdateReport'

export default function CreateUpdateReportPage() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { user: consultant } = useAuthContext()
  const [searchParams] = useSearchParams()
  const userId = searchParams.get('userId')
  const { showLoader, hideLoader } = useLoader()
  const { id } = useParams()
  const isEditMode = !!id

  const { mutate: createReport, isPending: isCreating } = useCreateReport()
  const { mutate: updateReport, isPending: isUpdating } = useUpdateReport()
  const { data: reportDetail, isLoading: isLoadingDetail } = useReportDetail(
    id ?? ''
  )

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
        {
          ...parsed,
          userId: reportDetail?.userId ?? '',
          consultantId: reportDetail?.consultantId ?? '',
          id: id!,
        },
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
        {
          ...parsed,
          userId: userId ?? '',
          consultantId: consultant?.userId ?? '',
        },
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

  useEffect(() => {
    if (isEditMode) {
      if (isLoadingDetail) showLoader()
      else hideLoader()
    }
  }, [isEditMode, isLoadingDetail, showLoader, hideLoader])

  useEffect(() => {
    if (isEditMode && reportDetail) {
      reset({
        title: reportDetail.title ?? '',
        description: reportDetail.description ?? '',
      })
    }
  }, [isEditMode, reportDetail, reset])

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
