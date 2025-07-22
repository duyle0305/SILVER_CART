import {
  FormWrapper,
  UploadBox,
} from '@/features/products/components/styles/AddProductPage.styles'
import {
  addProductSchema,
  type AddProductFormInputs,
} from '@/features/products/schemas'
import { useNotification } from '@/hooks/useNotification'
import { zodResolver } from '@hookform/resolvers/zod'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRef, type ChangeEvent } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

const CreateUpdateProductPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddProductFormInputs>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      images: [],
      name: '',
      description: '',
      productType: '',
      category: '',
      stock: 0,
      weight: '',
      originalPrice: 0,
      discountPrice: 0,
    },
  })

  const onSubmit: SubmitHandler<AddProductFormInputs> = (data) => {
    // TODO: handle form submission logic here
    console.log('Form Submitted Data:', data)
    showNotification('Product added successfully!', 'success')
    navigate('/products')
  }

  return (
    <Box>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files
                        if (files) {
                          const newFiles = Array.from(files)
                          setValue(
                            'images',
                            [...(field.value || []), ...newFiles],
                            {
                              shouldValidate: true,
                            }
                          )
                        }
                      }}
                      style={{ display: 'none' }}
                      accept="image/*"
                      multiple
                    />
                    <Stack direction="row" spacing={2} alignItems="center">
                      {(field.value || []).map((file, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <Avatar
                            src={URL.createObjectURL(file)}
                            variant="rounded"
                            sx={{ width: 150, height: 150 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              const updatedFiles = [...(field.value || [])]
                              updatedFiles.splice(index, 1)
                              setValue('images', updatedFiles, {
                                shouldValidate: true,
                              })
                            }}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                      <UploadBox onClick={() => fileInputRef.current?.click()}>
                        <AddPhotoAlternateIcon sx={{ mb: 1 }} />
                        <Typography variant="body2">Add Image(s)</Typography>
                      </UploadBox>
                    </Stack>
                    {errors.images && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        {errors.images.message}
                      </Typography>
                    )}
                  </>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3}>
                <TextField
                  {...register('name')}
                  label="Name"
                  placeholder="Enter name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  {...register('description')}
                  label="Description"
                  placeholder="Enter description"
                  multiline
                  rows={5}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('productType')}
                    label="Product type"
                    placeholder="Enter product type"
                    error={!!errors.productType}
                    helperText={errors.productType?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('category')}
                    label="Category"
                    placeholder="Enter category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('stock', { valueAsNumber: true })}
                    label="Stock"
                    placeholder="Enter stock"
                    type="number"
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('weight')}
                    label="Weight"
                    placeholder="Enter weight"
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('originalPrice', { valueAsNumber: true })}
                    label="Original price"
                    placeholder="Enter original price"
                    type="number"
                    inputProps={{ step: 'any' }}
                    error={!!errors.originalPrice}
                    helperText={errors.originalPrice?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('discountPrice', { valueAsNumber: true })}
                    label="Discount price"
                    placeholder="Enter discount price"
                    type="number"
                    inputProps={{ step: 'any' }}
                    error={!!errors.discountPrice}
                    helperText={errors.discountPrice?.message}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                sx={{ mt: 3 }}
              >
                <Button
                  variant="outlined"
                  sx={{ width: '150px' }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: '150px' }}
                  type="submit"
                >
                  Create
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </FormWrapper>
    </Box>
  )
}

export default CreateUpdateProductPage
