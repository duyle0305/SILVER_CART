import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotification } from '@/hooks/useNotification'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import {
  createSubCategorySchema,
  type CreateSubCategoryFormInputs,
} from './schemas'
import { useCreateSubCategory } from './hooks/useCreateSubCategory'
import { useLoader } from '@/hooks/useLoader'
import { isAxiosError } from 'axios'

const CreateSubCategoryPage = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()
  const { mutateAsync: createSubCategory, isPending } = useCreateSubCategory()
  const { id = '' } = useParams()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSubCategoryFormInputs>({
    resolver: zodResolver(createSubCategorySchema),
    defaultValues: {
      values: [{ code: '', label: '', description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  })

  const onSubmit = async (data: CreateSubCategoryFormInputs) => {
    if (!id) {
      showNotification('Missing sub-category id in URL.', 'error')
      return
    }

    showLoader()
    try {
      await createSubCategory({
        id,
        createCategoryValueDtos: data.values.map((item) => ({
          code: item.code,
          label: item.label,
          description: item.description || '',
        })),
      })

      showNotification('Sub-category values created successfully!', 'success')
      navigate(`/categories/sub-category/${id}`)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.'
      if (isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data?.errors?.[0] ||
          error.response.data?.message ||
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
        Create Sub-Category Values
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

      <Button
        startIcon={<AddIcon />}
        onClick={() => append({ code: '', label: '', description: '' })}
      >
        Add Value
      </Button>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 4 }}
      >
        <Button variant="outlined" onClick={() => navigate('/categories')}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </Stack>
    </Paper>
  )
}

export default CreateSubCategoryPage
