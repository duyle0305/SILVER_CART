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
import { useNavigate } from 'react-router-dom'
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSubCategoryFormInputs>({
    resolver: zodResolver(createSubCategorySchema),
    defaultValues: {
      label: '',
      note: '',
      values: [{ code: '', label: '', description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  })

  const onSubmit = async (data: CreateSubCategoryFormInputs) => {
    showLoader()
    try {
      await createSubCategory({
        label: data.label,
        note: data.note || '',
        values: data.values.map((item) => ({
          ...item,
          description: item.description || '',
        })),
      })

      showNotification('Sub-category created successfully!', 'success')
      navigate('/categories')
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
        Create Sub-Category
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            {...register('label')}
            label="Sub-Category Label"
            fullWidth
            error={!!errors.label}
            helperText={errors.label?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField {...register('note')} label="Note" fullWidth />
        </Grid>
      </Grid>

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
