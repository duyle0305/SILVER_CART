import { zodResolver } from '@hookform/resolvers/zod'
import {
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Grid,
} from '@mui/material'
import dayjs from 'dayjs'
import { Controller, useForm } from 'react-hook-form'
import {
  createPromotionSchema,
  type CreatePromotionFormInput,
  type CreatePromotionFormOutput,
} from './schemas'
import { useCreatePromotion } from './hooks/useCreatePromotion'
import { useNotification } from '@/hooks/useNotification'
import { useNavigate, useParams } from 'react-router-dom'
import { useUpdatePromotion } from './hooks/useUpdatePromotion'
import { usePromotionDetail } from './hooks/usePromotionDetail'
import { useEffect, useState } from 'react'

export default function CreateUpdatePromotionPage() {
  const [focusStart, setFocusStart] = useState(false)
  const [focusEnd, setFocusEnd] = useState(false)
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { id } = useParams()
  const { mutateAsync: createPromotion, isPending } = useCreatePromotion()
  const { mutateAsync: updatePromotion, isPending: isUpdating } =
    useUpdatePromotion()
  const { data: promotionDetail } = usePromotionDetail(id ?? '')
  const isEditMode = !!id

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
  } = useForm<CreatePromotionFormInput>({
    resolver: zodResolver(createPromotionSchema),
    defaultValues: {
      title: '',
      description: '',
      discountPercent: 0,
      requiredPoints: 0,
      startAt: dayjs().format('YYYY-MM-DDTHH:mm'),
      endAt: dayjs().add(7, 'day').format('YYYY-MM-DDTHH:mm'),
    },
    mode: 'onBlur',
  })

  const onSubmit = (raw: CreatePromotionFormInput) => {
    const parsed: CreatePromotionFormOutput = createPromotionSchema.parse(raw)

    const payload = {
      ...parsed,
      startAt: dayjs(parsed.startAt).toISOString(),
      endAt: dayjs(parsed.endAt).toISOString(),
      description: parsed.description || '',
    }

    if (isEditMode) {
      const editPayload = {
        ...payload,
        id,
      }

      updatePromotion(editPayload, {
        onSuccess: () => {
          showNotification('Promotion updated successfully!', 'success')
          navigate('/promotions')
        },
      })
    } else {
      createPromotion(payload, {
        onSuccess: () => {
          showNotification('Promotion created successfully!', 'success')
          navigate('/promotions')
        },
        onError: (error: any) => {
          showNotification(
            error?.message || 'Failed to create promotion.',
            'error'
          )
        },
      })
    }
  }

  useEffect(() => {
    if (isEditMode && promotionDetail) {
      const formData: Partial<CreatePromotionFormInput> = {
        title: promotionDetail.title,
        description: promotionDetail.description,
        discountPercent: promotionDetail.discountPercent,
        requiredPoints: promotionDetail.requiredPoints,
        startAt: dayjs(promotionDetail.startAt).format('YYYY-MM-DDTHH:mm'),
        endAt: dayjs(promotionDetail.endAt).format('YYYY-MM-DDTHH:mm'),
      }

      reset(formData)
    }
  }, [isEditMode, promotionDetail, reset])

  return (
    <Paper component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        {isEditMode ? 'Update Promotion' : 'Create Promotion'}
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

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('discountPercent')}
            label="Discount Percent"
            type="number"
            fullWidth
            inputProps={{ min: 0, max: 100, step: 1 }}
            error={!!errors.discountPercent}
            helperText={errors.discountPercent?.message ?? '0 – 100'}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('requiredPoints')}
            label="Required Points"
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 1 }}
            error={!!errors.requiredPoints}
            helperText={errors.requiredPoints?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('startAt')}
            label="Start At"
            type="datetime-local"
            fullWidth
            error={!!errors.startAt}
            helperText={errors.startAt?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('endAt')}
            label="End At"
            type="datetime-local"
            fullWidth
            error={!!errors.endAt}
            helperText={errors.endAt?.message}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                minRows={3}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Grid>
      </Grid>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 4 }}
      >
        <Button variant="outlined" onClick={() => navigate('/promotions')}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isEditMode
            ? isUpdating
              ? 'Updating...'
              : 'Update'
            : isPending
              ? 'Creating...'
              : 'Create'}
        </Button>
      </Stack>
    </Paper>
  )
}
