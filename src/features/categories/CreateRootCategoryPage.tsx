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
  createRootCategorySchema,
  type CreateRootCategoryFormInputs,
} from './schemas'
import { useCreateRootCategory } from './hooks/useCreateRootCategory'

const CreateRootCategoryPage = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { mutate: createRootCategory, isPending } = useCreateRootCategory()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateRootCategoryFormInputs>({
    resolver: zodResolver(createRootCategorySchema),
    defaultValues: {
      values: [{ code: '', label: '', description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  })

  const onSubmit = (data: CreateRootCategoryFormInputs) => {
    const payload = data.values.map((value) => ({
      ...value,
      description: value.description || '',
    }))

    createRootCategory(payload, {
      onSuccess: () => {
        showNotification('Root category created successfully!', 'success')
        navigate('/categories')
      },
      onError: (error) => {
        showNotification(
          error.message || 'Failed to create root category.',
          'error'
        )
      },
    })
  }

  return (
    <Paper component="form" sx={{ p: 3 }} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        Create Root Category
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

export default CreateRootCategoryPage
