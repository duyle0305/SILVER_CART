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
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useNotification } from '@/hooks/useNotification'
import {
  createSubCategorySchema,
  type CreateSubCategoryFormInputs,
} from './schemas'
import { useCreateSubCategory } from './hooks/useCreateSubCategory'
import { useUpdateCategory } from './hooks/useUpdateCategory'
import { useSubCategoryDetails } from './hooks/useSubCategoryDetails'
import { useLoader } from '@/hooks/useLoader'
import { isAxiosError } from 'axios'
import { useEffect, useMemo } from 'react'

export default function CreateUpdateSubCategoryPage() {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()
  const { subId = '', id = '' } = useParams()
  const location = useLocation()
  const isEdit = /edit|update/i.test(location.pathname)
  const { data: subCategoryDetails, isLoading: isLoadingDetail } =
    useSubCategoryDetails(id, subId)
  const { mutateAsync: createSubCategory, isPending: isCreating } =
    useCreateSubCategory()
  const { mutateAsync: updateSubCategory, isPending: isUpdating } =
    useUpdateCategory()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateSubCategoryFormInputs>({
    resolver: zodResolver(createSubCategorySchema),
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
    const src: any = subCategoryDetails
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
  }, [subCategoryDetails])

  useEffect(() => {
    if (isEdit && subCategoryDetails) {
      reset({ values: normalizedValues })
    }
  }, [isEdit, subCategoryDetails, normalizedValues, reset])

  const pending = isCreating || isUpdating || (isEdit && isLoadingDetail)

  const onSubmit = async (data: CreateSubCategoryFormInputs) => {
    if (!subId) {
      showNotification('Missing sub-category id in URL.', 'error')
      return
    }
    const values = data.values.map((item) => ({
      code: item.code.trim(),
      label: item.label.trim(),
      description: item.description?.trim() ?? '',
    }))
    showLoader()
    try {
      if (isEdit) {
        await updateSubCategory({
          id: subId,
          updateCategoryValueDtos: values,
        } as any)
        showNotification('Sub-category values updated successfully!', 'success')
      } else {
        await createSubCategory({
          id: subId,
          createCategoryValueDtos: values,
        })
        showNotification('Sub-category values created successfully!', 'success')
      }
      navigate(`/categories/sub-category/${subId}`)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.'
      if (isAxiosError(error) && error.response) {
        errorMessage =
          (error.response.data as any)?.errors?.[0] ||
          (error.response.data as any)?.message ||
          'An unexpected API error occurred.'
      }
      showNotification(errorMessage, 'error')
    } finally {
      hideLoader()
    }
  }

  return (
    <Paper component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        {isEdit ? 'Update Sub-Category Values' : 'Create Sub-Category Values'}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Values
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
          onClick={() => navigate('/categories/sub-category/' + subId)}
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
