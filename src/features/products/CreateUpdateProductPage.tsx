import {
  ActionButtonsContainer,
  AddVariantButton,
  FormWrapper,
  ImagePreviewBox,
  RemoveButton,
  RemoveImageButton,
  SectionPaper,
  SectionTitle,
  StyledAvatar,
  StyledVideoName,
  VariantPaper,
} from '@/features/products/components/styles/CreateUpdateProductPage.styles'
import { ProductType } from '@/features/products/constants'
import { addProductSchema } from '@/features/products/schemas'
import { createProduct } from '@/features/products/services/productService'
import type { ProductDataParam } from '@/features/products/types'
import { useNotification } from '@/hooks/useNotification'
import { uploadFile } from '@/services/fileUploadService'
import { zodResolver } from '@hookform/resolvers/zod'
import CloseIcon from '@mui/icons-material/Close'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import type { z } from 'zod'
import FileUploader from './components/FileUploader'
import PreviewDialog from './components/PreviewDialog'
import ProductVariantForm from './components/ProductVariantForm'
import VideoThumbnail from './components/VideoThumbnail'
import { useCategories } from '../categories/hooks/useCategories'
import { useLoader } from '@/hooks/useLoader'

const CreateUpdateProductPage = () => {
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const { showNotification } = useNotification()
  const { mutateAsync: createProductMutation } = useMutation({
    mutationFn: createProduct,
  })
  const navigate = useNavigate()
  const { data: categoriesData } = useCategories({})
  const { showLoader, hideLoader } = useLoader()

  type FormInputs = z.infer<typeof addProductSchema>

  const handlePreview = (file: File) => {
    setPreviewFile(file)
  }

  const handleClosePreview = () => {
    setPreviewFile(null)
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      description: '',
      productType: undefined,
      categoryIds: [],
      productVariants: [
        {
          variantName: '',
          price: 0,
          productItems: [
            {
              stock: 0,
              originalPrice: 0,
              discountedPrice: 0,
              weight: 0,
              images: [],
            },
          ],
        },
      ],
    },
  })

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: 'productVariants',
  })

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      showLoader()
      let videoUrl = ''
      if (data.videoFile) {
        videoUrl = await uploadFile(data.videoFile, 'videos')
      }

      const processedVariants = await Promise.all(
        data.productVariants.map(async (variant) => ({
          ...variant,
          productItems: await Promise.all(
            variant.productItems.map(async (item) => {
              const imageUrls = await Promise.all(
                (item.images || []).map((file) => uploadFile(file, 'images'))
              )
              return {
                sku: item.sku,
                stock: item.stock,
                originalPrice: item.originalPrice,
                discountedPrice: item.discountedPrice,
                weight: item.weight,
                productImages: imageUrls.map((url, index) => ({
                  imagePath: url,
                  imageName: (item.images || [])[index]?.name || 'image',
                })),
              }
            })
          ),
        }))
      )

      const finalPayload: ProductDataParam = {
        name: data.name,
        description: data.description || '',
        videoPath: videoUrl,
        productType: data.productType,
        categoryIds: data.categoryIds,
        productVariants: processedVariants,
      }

      await createProductMutation(finalPayload)
      showNotification('Product added successfully!', 'success')
      navigate('/products')
    } catch (error) {
      console.error('Error processing product:', error)
      showNotification('Failed to add product. Please try again.', 'error')
    } finally {
      hideLoader()
    }
  }

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SectionPaper>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" gap={2}>
                <Controller
                  name="videoFile"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      {field.value ? (
                        <ImagePreviewBox>
                          <StyledAvatar
                            variant="rounded"
                            onClick={() =>
                              field.value && handlePreview(field.value)
                            }
                          >
                            <VideoThumbnail file={field.value} />
                          </StyledAvatar>
                          <Tooltip
                            title={field.value.name}
                            placement="top"
                            arrow
                            followCursor
                          >
                            <StyledVideoName variant="caption" noWrap>
                              {field.value.name}
                            </StyledVideoName>
                          </Tooltip>
                          <RemoveImageButton
                            size="small"
                            onClick={() => setValue('videoFile', undefined)}
                          >
                            <CloseIcon fontSize="small" />
                          </RemoveImageButton>
                        </ImagePreviewBox>
                      ) : (
                        <FileUploader
                          label="Add Video"
                          accept="video/*"
                          icon={<VideoCallIcon />}
                          onFileSelect={(files) =>
                            setValue('videoFile', files[0], {
                              shouldValidate: true,
                            })
                          }
                        />
                      )}
                    </Box>
                  )}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('name')}
                label="Name"
                placeholder="Enter name"
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth error={!!errors.productType}>
                <InputLabel id="product-type-label">Product type</InputLabel>
                <Select
                  labelId="product-type-label"
                  id="product-type"
                  {...register('productType')}
                  label="Product type"
                  defaultValue={ProductType.ALL}
                >
                  {Object.values(ProductType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.productType && (
                  <FormHelperText>{errors.productType.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth error={!!errors.categoryIds}>
                <InputLabel id="product-categories-label">
                  Categories
                </InputLabel>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="product-categories-label"
                      multiple
                      label="Categories"
                      renderValue={(selectedIds) => {
                        const selectedNames = (
                          categoriesData?.results
                            ?.filter((cat) => selectedIds.includes(cat.id))
                            .map((cat) => cat.name) || []
                        ).join(', ')
                        return selectedNames
                      }}
                    >
                      {categoriesData?.results?.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Checkbox
                            checked={field.value.includes(category.id)}
                          />
                          <ListItemText primary={category.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.categoryIds && (
                  <FormHelperText>
                    {Array.isArray(errors.categoryIds)
                      ? errors.categoryIds[0]?.message
                      : errors.categoryIds.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                {...register('description')}
                label="Description"
                placeholder="Enter description"
                multiline
                rows={6}
                fullWidth
              />
            </Grid>
          </Grid>
        </SectionPaper>

        <SectionPaper>
          <SectionTitle>Product Variant</SectionTitle>
          {variantFields.map((variant, variantIndex) => (
            <VariantPaper key={variant.id}>
              {variantFields.length > 1 && (
                <Stack direction="row" justifyContent="flex-end">
                  <RemoveButton
                    color="error"
                    onClick={() => removeVariant(variantIndex)}
                  >
                    <CloseIcon />
                  </RemoveButton>
                </Stack>
              )}
              <ProductVariantForm
                variantIndex={variantIndex}
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                onPreview={handlePreview}
              />
            </VariantPaper>
          ))}
          <Stack direction="row" justifyContent="flex-end">
            <AddVariantButton
              variant="outlined"
              onClick={() =>
                appendVariant({
                  variantName: '',
                  price: 0,
                  productItems: [
                    { stock: 0, originalPrice: 0, weight: 0, images: [] },
                  ],
                })
              }
            >
              Add Variant
            </AddVariantButton>
          </Stack>
        </SectionPaper>

        <ActionButtonsContainer direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => navigate('/products')}
            sx={{ width: 150 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ width: 150 }}>
            Create Product
          </Button>
        </ActionButtonsContainer>
      </form>

      <PreviewDialog file={previewFile} onClose={handleClosePreview} />
    </FormWrapper>
  )
}

export default CreateUpdateProductPage
