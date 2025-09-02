import { useNotification } from '@/hooks/useNotification'
import { zodResolver } from '@hookform/resolvers/zod'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { isAxiosError } from 'axios'
import { useEffect, useMemo } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'

import { createBrandSchema, type CreateBrandFormInputs } from './schemas'

import { useBrandDetails } from './hooks/useBrandDetails'
import { useCreateBrand } from './hooks/useCreateBrand'
import { useUpdateBrand } from './hooks/useEditBrand'

export default function CreateUpdateBrandPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const title = isEdit ? 'Update Brand' : 'Create Brand'
  const cta = isEdit ? 'Update' : 'Create'

  const { showNotification } = useNotification()
  const { data: brandDetails, isLoading: isLoadingDetail } = useBrandDetails(
    isEdit ? id! : ''
  )
  const { mutate: createBrand, isPending: isCreating } = useCreateBrand()
  const { mutate: updateBrand, isPending: isUpdating } = useUpdateBrand()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateBrandFormInputs>({
    resolver: zodResolver(createBrandSchema),
    mode: 'onChange',
    defaultValues: {
      values: [{ code: '', label: '', description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  })

  const normalizedValues = useMemo(() => {
    if (!brandDetails) return [{ code: '', label: '', description: '' }]

    if (Array.isArray((brandDetails as any).values)) {
      return (brandDetails as any).values.map((v: any) => ({
        code: v?.code ?? '',
        label: v?.label ?? '',
        description: v?.description ?? '',
      }))
    }

    return [
      {
        code: (brandDetails as any).code ?? '',
        label: (brandDetails as any).label ?? '',
        description: (brandDetails as any).description ?? '',
      },
    ]
  }, [brandDetails])

  useEffect(() => {
    if (isEdit && brandDetails) {
      reset({ values: normalizedValues })
    }
  }, [isEdit, brandDetails, normalizedValues, reset])

  const pending = isCreating || isUpdating || (isEdit && isLoadingDetail)

  const onSubmit = (data: CreateBrandFormInputs) => {
    const values = data.values.map((v) => ({
      code: v.code.trim(),
      label: v.label.trim(),
      description: v.description?.trim() ?? '',
    }))

    if (isEdit) {
      updateBrand({ id: id!, values } as any, {
        onSuccess: () => {
          showNotification('Brand updated successfully!', 'success')
          navigate('/brands')
        },
        onError: (err: any) => {
          const msg = isAxiosError(err)
            ? ((err.response?.data as any)?.message ??
              'Failed to update brand.')
            : 'Failed to update brand.'
          showNotification(msg, 'error')
        },
      })
    } else {
      createBrand(values as any, {
        onSuccess: () => {
          showNotification('Brand created successfully!', 'success')
          navigate('/brands')
        },
        onError: (err) => {
          const msg = isAxiosError(err)
            ? ((err.response?.data as any)?.message ??
              'Failed to create brand.')
            : 'Failed to create brand.'
          showNotification(msg, 'error')
        },
      })
    }
  }

  return (
    <Paper component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        {title}
      </Typography>

      {fields.map((field, index) => (
        <Paper
          key={field.id}
          variant="outlined"
          sx={{ p: 2, mb: 2, position: 'relative' }}
        >
          {fields.length > 1 && (
            <Stack direction="row" justifyContent="flex-end">
              <IconButton onClick={() => remove(index)} color="error">
                <CloseIcon />
              </IconButton>
            </Stack>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                {...register(`values.${index}.code`)}
                label="Code"
                fullWidth
                error={!!errors.values?.[index]?.code}
                helperText={errors.values?.[index]?.code?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                {...register(`values.${index}.label`)}
                label="Label"
                fullWidth
                error={!!errors.values?.[index]?.label}
                helperText={errors.values?.[index]?.label?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                {...register(`values.${index}.description`)}
                label="Description"
                fullWidth
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={() => append({ code: '', label: '', description: '' })}
        sx={{ mb: 2 }}
      >
        Add Value
      </Button>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => navigate('/brands')}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={pending || !isValid || !isDirty}
        >
          {pending ? `${cta}...` : cta}
        </Button>
      </Stack>
    </Paper>
  )
}
