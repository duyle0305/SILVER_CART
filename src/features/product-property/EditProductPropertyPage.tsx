import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'

import { useEditProductProperty } from '@/features/product-property/hooks/useEditProductProperty'
import { useProductPropertyDetail } from '@/features/product-property/hooks/useProductPropertyDetail'
import { useNotification } from '@/hooks/useNotification'

export interface EditProductPropertyBodyParam {
  id: string
  label: string
  description?: string
  code: string
}

const schema = z.object({
  label: z.string().min(1, 'Label is required'),
  code: z
    .string()
    .min(1, 'Code is required')
    .regex(
      /^[a-zA-Z0-9_\-]+$/,
      'Only letters, numbers, underscores, and hyphens are allowed'
    ),
  description: z.string().optional(),
})

type FormInput = z.infer<typeof schema>

export default function EditProductPropertyPage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const { mutateAsync: editProperty, isPending } = useEditProductProperty()
  const { data: detail, isLoading } = useProductPropertyDetail(id)

  const methods = useForm<FormInput>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      label: '',
      code: '',
      description: '',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = methods

  useEffect(() => {
    if (!detail) return
    reset({
      label: detail.label ?? '',
      code: detail.code ?? '',
      description: detail.description ?? '',
    })
  }, [detail, reset])

  const onSubmit = handleSubmit(async (values) => {
    const payload: EditProductPropertyBodyParam = {
      id,
      label: values.label.trim(),
      code: values.code.trim(),
      description: values.description?.trim()
        ? values.description.trim()
        : undefined,
    }

    try {
      await editProperty(payload)
      showNotification('Updated product property success', 'success')
      navigate(-1)
    } catch {
      showNotification('Update failed', 'error')
    }
  })

  return (
    <FormProvider {...methods}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Edit Product Property
        </Typography>

        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="label"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Label"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="code"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Code"
                    placeholder="vd: color_primary"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    label="Description (optional)"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Paper>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={!isValid || !isDirty || isPending || isLoading}
          >
            Save Changes
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  )
}
