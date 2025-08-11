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
import { useNavigate } from 'react-router-dom'
import { useCreateListOfValueWithValues } from '@/features/product-property/hooks/useCreateListOfValueWithValues'
import {
  createProductPropertySchema,
  type CreateProductPropertyFormInputs,
} from '@/features/product-property/schemas'

const CreateProductPropertyPage = () => {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useCreateListOfValueWithValues()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateProductPropertyFormInputs>({
    resolver: zodResolver(createProductPropertySchema),
    defaultValues: {
      note: '',
      label: '',
      values: [{ code: '', label: '', description: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'values' })

  const onSubmit = async (data: CreateProductPropertyFormInputs) => {
    await mutateAsync({
      label: data.label,
      note: data.note,
      values: data.values.map((v) => ({
        code: v.code,
        label: v.label,
        description: v.description ?? '',
      })),
    })
    navigate(-1)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create Product Property
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Note"
            fullWidth
            {...register('note')}
            error={!!errors.note}
            helperText={errors.note?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Label"
            fullWidth
            {...register('label')}
            error={!!errors.label}
            helperText={errors.label?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>
            Values
          </Typography>

          <Stack spacing={2}>
            {fields.map((field, idx) => (
              <Grid container spacing={2} key={field.id}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Value Code"
                    {...register(`values.${idx}.code`)}
                    error={!!errors.values?.[idx]?.code}
                    helperText={errors.values?.[idx]?.code?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Value Label"
                    {...register(`values.${idx}.label`)}
                    error={!!errors.values?.[idx]?.label}
                    helperText={errors.values?.[idx]?.label?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    fullWidth
                    label="Value Description"
                    {...register(`values.${idx}.description`)}
                    error={!!errors.values?.[idx]?.description}
                    helperText={errors.values?.[idx]?.description?.message}
                  />
                </Grid>
                <Grid
                  size={{ xs: 12, md: 1 }}
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'flex-end', md: 'center' },
                  }}
                >
                  <IconButton onClick={() => remove(idx)} aria-label="remove">
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={() => append({ code: '', label: '', description: '' })}
            >
              Add Value
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default CreateProductPropertyPage
