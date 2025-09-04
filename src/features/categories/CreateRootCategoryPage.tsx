import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotification } from '@/hooks/useNotification'
import {
  createRootCategorySchema,
  type CreateRootCategoryFormInputs,
} from './schemas'
import { useCreateRootCategory } from './hooks/useCreateRootCategory'
import { useRootCategoryDetails } from './hooks/useRootCategoryDetails'
import { useUpdateCategory } from './hooks/useUpdateCategory'
import { useEffect, useMemo } from 'react'
import { isAxiosError } from 'axios'

export default function CreateUpdateRootCategoryPage() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const { mutate: createRootCategory, isPending: isCreating } =
    useCreateRootCategory()
  const { mutate: updateRootCategory, isPending: isUpdating } =
    useUpdateCategory()
  const { data: rootCategoryDetails, isLoading: isLoadingDetail } =
    useRootCategoryDetails(isEdit ? id! : '')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateRootCategoryFormInputs>({
    resolver: zodResolver(createRootCategorySchema),
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
    const src: any = rootCategoryDetails
    if (!src) return [{ code: '', label: '', description: '' }]
    if (Array.isArray(src.values)) {
      return src.values.map((v: any) => ({
        code: v?.code ?? '',
        label: v?.label ?? '',
        description: v?.description ?? '',
      }))
    }
    return [
      {
        code: src.code ?? '',
        label: src.label ?? '',
        description: src.description ?? '',
      },
    ]
  }, [rootCategoryDetails])

  useEffect(() => {
    if (isEdit && rootCategoryDetails) {
      reset({ values: normalizedValues })
    }
  }, [isEdit, rootCategoryDetails, normalizedValues, reset])

  const pending = isCreating || isUpdating || (isEdit && isLoadingDetail)

  const onSubmit = (data: CreateRootCategoryFormInputs) => {
    const values = data.values.map((v) => ({
      code: v.code.trim(),
      label: v.label.trim(),
      description: v.description?.trim() ?? '',
    }))
    if (isEdit) {
      updateRootCategory({ id: id!, ...values[0] } as any, {
        onSuccess: () => {
          showNotification('Root category updated successfully!', 'success')
          navigate('/categories')
        },
        onError: (error: any) => {
          const msg = isAxiosError(error)
            ? ((error.response?.data as any)?.message ??
              'Failed to update root category.')
            : 'Failed to update root category.'
          showNotification(msg, 'error')
        },
      })
    } else {
      createRootCategory(values as any, {
        onSuccess: () => {
          showNotification('Root category created successfully!', 'success')
          navigate('/categories')
        },
        onError: (error) => {
          const msg = isAxiosError(error)
            ? ((error.response?.data as any)?.message ??
              'Failed to create root category.')
            : 'Failed to create root category.'
          showNotification(msg, 'error')
        },
      })
    }
  }

  return (
    <Paper component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        {isEdit ? 'Update Root Category' : 'Create Root Category'}
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

      {!isEdit && (
        <Button
          startIcon={<AddIcon />}
          onClick={() => append({ code: '', label: '', description: '' })}
          sx={{ mb: 2 }}
        >
          Add Value
        </Button>
      )}

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 4 }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate('/categories')}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={pending || !isValid || !isDirty}
        >
          {pending
            ? isEdit
              ? 'Updating...'
              : 'Creating...'
            : isEdit
              ? 'Update'
              : 'Create'}
        </Button>
      </Stack>
    </Paper>
  )
}
