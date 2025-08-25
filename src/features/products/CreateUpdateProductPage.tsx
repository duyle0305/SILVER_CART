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
  VariantPaper,
} from '@/features/products/components/styles/CreateUpdateProductPage.styles'
import { useLoader } from '@/hooks/useLoader'
import { useNotification } from '@/hooks/useNotification'
import { uploadFile } from '@/services/fileUploadService'
import { zodResolver } from '@hookform/resolvers/zod'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import VideoCallIcon from '@mui/icons-material/VideoCall'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  type SelectChangeEvent,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { isAxiosError } from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useBrands } from '../brands/hooks/useBrands'
import { useLeafCategories } from '../categories/hooks/useLeafCategories'
import { useListProductProperty } from '../product-property/hooks/useListProductProperty'
import FileUploader from './components/FileUploader'
import PreviewDialog from './components/PreviewDialog'
import VideoThumbnail from './components/VideoThumbnail'
import { useCreateProduct } from './hooks/useCreateProduct'
import { useProductDetail } from './hooks/useProductDetail'
import { useUpdateProduct } from './hooks/useUpdateProduct'
import {
  createProductInputSchema,
  createProductOutputSchema,
  type CreateProductFormInputs,
} from './schemas'
import type { CreateProductPayload } from './types'

type ImageFile = File | { url: string }

const CreateUpdateProductPage = () => {
  const [previewFile, setPreviewFile] = useState<ImageFile | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const { id } = useParams<{ id: string }>()
  const isEditMode = !!id
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { showLoader, hideLoader } = useLoader()
  const { data: leafCategories = [], isLoading: isLoadingCategories } =
    useLeafCategories()
  const {
    data: listProductProperties = [],
    isLoading: isLoadingListProperties,
  } = useListProductProperty()
  const { mutateAsync: createProductMutation, isPending: isCreating } =
    useCreateProduct()
  const { data: brands = [], isLoading: isLoadingBrands } = useBrands()
  const { mutateAsync: updateProductMutation, isPending: isUpdating } =
    useUpdateProduct()
  const { data: productDetail, isLoading: isLoadingProductDetail } =
    useProductDetail(id!)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormInputs>({
    resolver: zodResolver(createProductInputSchema),
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      weight: '',
      height: '',
      length: '',
      width: '',
      valueCategoryIds: [],
      productVariants: [
        {
          price: '',
          discount: '',
          stock: '',
          isActive: true,
          productImages: [],
          valueIds: [],
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

  const handlePreview = (file: ImageFile) => {
    if (file instanceof File) {
      setPreviewFile(file)
    } else {
      window.open(file.url, '_blank')
    }
  }
  const handleClosePreview = () => setPreviewFile(null)

  const onSubmit: SubmitHandler<CreateProductFormInputs> = async (data) => {
    showLoader()
    try {
      const transformedData = createProductOutputSchema.parse(data)

      let videoUrlToSend = videoUrl || ''
      if (transformedData.videoFile) {
        videoUrlToSend = await uploadFile(transformedData.videoFile, 'videos')
      }

      const processedVariants = await Promise.all(
        transformedData.productVariants.map(async (variant) => {
          const imageUrls = await Promise.all(
            (variant.productImages || []).map(async (img) => {
              if (img instanceof File) {
                return await uploadFile(img, 'images')
              }
              return (img as { url: string }).url
            })
          )
          return {
            price: variant.price,
            discount: variant.discount,
            stock: variant.stock,
            isActive: variant.isActive,
            valueIds: variant.valueIds,
            productImages: imageUrls.map((url) => ({ url })),
          }
        })
      )

      const finalPayload: CreateProductPayload = {
        name: transformedData.name,
        brand: transformedData.brand,
        description: transformedData.description || '',
        videoPath: videoUrlToSend,
        weight: transformedData.weight,
        height: transformedData.height,
        length: transformedData.length,
        width: transformedData.width,
        manufactureDate: new Date(
          transformedData.manufactureDate
        ).toISOString(),
        expirationDate: new Date(transformedData.expirationDate).toISOString(),
        valueCategoryIds: transformedData.valueCategoryIds,
        productVariants: processedVariants,
      }

      if (isEditMode) {
        await updateProductMutation({ id: id!, data: finalPayload })
        showNotification('Product updated successfully!', 'success')
      } else {
        await createProductMutation(finalPayload)
        showNotification('Product created successfully!', 'success')
      }
      navigate('/products')
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

  useEffect(() => {
    if (isEditMode && productDetail) {
      const productVariants = productDetail.productVariants.map((variant) => ({
        price: variant.price.toString(),
        discount: variant.discount.toString(),
        stock: variant.stock.toString(),
        isActive: variant.isActive,
        productImages: (variant.productImages || []).map((img) => ({
          url: img.url,
        })),
        valueIds: variant.productVariantValues.map((v) => v.valueId),
      }))
      const formValues: Partial<CreateProductFormInputs> = {
        name: String(productDetail.name),
        brand: productDetail.brand,
        description: productDetail.description || '',
        weight: String(productDetail.weight),
        height: String(productDetail.height),
        length: String(productDetail.length),
        width: String(productDetail.width),
        manufactureDate: new Date(productDetail.manufactureDate),
        expirationDate: new Date(productDetail.expirationDate),
        valueCategoryIds: productDetail.categories.map((c) => c.id) ?? [],
        productVariants,
      }
      reset(formValues)
      if (productDetail.videoPath) {
        setVideoUrl(productDetail.videoPath)
      }
    }
  }, [isEditMode, productDetail, reset])

  useEffect(() => {
    if (isEditMode) {
      if (isLoadingProductDetail) {
        showLoader()
      } else {
        hideLoader()
      }
    }
  }, [hideLoader, isEditMode, isLoadingProductDetail, showLoader])

  const isPending = isCreating || isUpdating

  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SectionPaper>
          <SectionTitle>
            {isEditMode ? 'Edit Product' : 'Basic Information'}
          </SectionTitle>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Product Name"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!errors.brand}>
                <InputLabel>Brand</InputLabel>
                <Controller
                  name="brand"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select {...field} label="Brand" disabled={isLoadingBrands}>
                      {brands.map((brand) => (
                        <MenuItem key={brand.id} value={brand.label}>
                          {brand.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.brand && (
                  <FormHelperText>{errors.brand.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth error={!!errors.valueCategoryIds}>
                <InputLabel>Categories</InputLabel>
                <Controller
                  name="valueCategoryIds"
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Categories"
                      disabled={isLoadingCategories}
                      input={<OutlinedInput label="Categories" />}
                      value={field.value ? JSON.stringify(field.value) : ''}
                      onChange={(event) => {
                        const selectedPathString = event.target.value as string
                        if (selectedPathString) {
                          const selectedPath = JSON.parse(
                            selectedPathString
                          ) as string[]
                          field.onChange(selectedPath)
                        } else {
                          field.onChange([])
                        }
                      }}
                      renderValue={(selectedPathString) => {
                        if (!selectedPathString) {
                          return <em>Chọn danh mục...</em>
                        }
                        try {
                          const selectedPath = JSON.parse(
                            selectedPathString as string
                          )
                          const category = leafCategories.find(
                            (c) =>
                              JSON.stringify(c.path) ===
                              JSON.stringify(selectedPath)
                          )
                          return category?.label || 'Select category'
                        } catch {
                          return 'Invalid selection'
                        }
                      }}
                    >
                      {leafCategories.map((cat, index) => {
                        return (
                          <MenuItem
                            key={`${cat.valueId}${index}`}
                            value={JSON.stringify(cat.path)}
                          >
                            <ListItemText primary={cat.label} />
                          </MenuItem>
                        )
                      })}
                    </Select>
                  )}
                />
                {errors.valueCategoryIds && (
                  <FormHelperText>
                    {errors.valueCategoryIds.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </SectionPaper>

        <SectionPaper>
          <SectionTitle>Details & Media</SectionTitle>
          <Grid container spacing={3}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="weight"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Weight (g)"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="height"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Height (cm)"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="length"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Length (cm)"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Controller
                name="width"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Width (cm)"
                    type="number"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="manufactureDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Manufacture Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toDate())}
                    sx={{ width: '100%' }}
                    slotProps={{
                      textField: {
                        error: !!errors.manufactureDate,
                        helperText:
                          typeof errors.manufactureDate?.message === 'string'
                            ? errors.manufactureDate?.message
                            : undefined,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Expiration Date"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toDate())}
                    sx={{ width: '100%' }}
                    slotProps={{
                      textField: {
                        error: !!errors.expirationDate,
                        helperText:
                          typeof errors.expirationDate?.message === 'string'
                            ? errors.expirationDate.message
                            : undefined,
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
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
                          <VideoThumbnail source={field.value} />
                        </StyledAvatar>
                        <RemoveImageButton
                          size="small"
                          onClick={() => {
                            setValue('videoFile', undefined)
                            setVideoUrl(null)
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </RemoveImageButton>
                      </ImagePreviewBox>
                    ) : videoUrl ? (
                      <ImagePreviewBox>
                        <StyledAvatar
                          variant="rounded"
                          onClick={() => window.open(videoUrl, '_blank')}
                        >
                          <VideoThumbnail
                            source={videoUrl}
                            onOpen={(url) => window.open(url, '_blank')}
                          />
                        </StyledAvatar>
                        <RemoveImageButton
                          size="small"
                          onClick={() => setVideoUrl(null)}
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
            </Grid>
          </Grid>
        </SectionPaper>

        <SectionPaper>
          <SectionTitle>Variants</SectionTitle>
          <Stack spacing={3}>
            {variantFields.map((variant, index) => (
              <VariantPaper key={variant.id}>
                {variantFields.length > 1 && (
                  <Stack direction="row" justifyContent="flex-end">
                    <RemoveButton
                      color="error"
                      onClick={() => removeVariant(index)}
                    >
                      <CloseIcon />
                    </RemoveButton>
                  </Stack>
                )}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      {...register(`productVariants.${index}.price`)}
                      label="Price"
                      type="number"
                      fullWidth
                      error={!!errors.productVariants?.[index]?.price}
                      helperText={
                        errors.productVariants?.[index]?.price?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      {...register(`productVariants.${index}.stock`)}
                      label="Stock"
                      type="number"
                      fullWidth
                      error={!!errors.productVariants?.[index]?.stock}
                      helperText={
                        errors.productVariants?.[index]?.stock?.message
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      {...register(`productVariants.${index}.discount`)}
                      label="Discount (%)"
                      type="number"
                      fullWidth
                      error={!!errors.productVariants?.[index]?.discount}
                      helperText={
                        errors.productVariants?.[index]?.discount?.message
                      }
                    />
                  </Grid>

                  {listProductProperties.length === 0 ? (
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="body2" color="text.secondary">
                        No properties available.
                      </Typography>
                    </Grid>
                  ) : (
                    listProductProperties.map((group) => {
                      const groupValueIds = group.values.map((v) => v.id)

                      return (
                        <Grid key={group.id} size={{ xs: 12, md: 6 }}>
                          <FormControl
                            fullWidth
                            error={!!errors.productVariants?.[index]?.valueIds}
                          >
                            <InputLabel>{group.label}</InputLabel>

                            <Controller
                              name={`productVariants.${index}.valueIds`}
                              control={control}
                              defaultValue={[]}
                              render={({ field }) => {
                                const selectedAll: string[] = field.value || []
                                const selectedInGroup = selectedAll.filter(
                                  (id) => groupValueIds.includes(id)
                                )

                                const handleChange = (
                                  event: SelectChangeEvent<string[]>
                                ) => {
                                  const newGroupSelected = event.target
                                    .value as string[]
                                  const others = selectedAll.filter(
                                    (id) => !groupValueIds.includes(id)
                                  )
                                  field.onChange([
                                    ...others,
                                    ...newGroupSelected,
                                  ])
                                }

                                return (
                                  <Select
                                    multiple
                                    label={group.label}
                                    value={selectedInGroup}
                                    onChange={handleChange}
                                    disabled={isLoadingListProperties}
                                    input={
                                      <OutlinedInput label={group.label} />
                                    }
                                    renderValue={(selectedIds) => (
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: 0.5,
                                        }}
                                      >
                                        {group.values
                                          .filter((v) =>
                                            (selectedIds as string[]).includes(
                                              v.id
                                            )
                                          )
                                          .map((v) => (
                                            <Chip key={v.id} label={v.label} />
                                          ))}
                                      </Box>
                                    )}
                                  >
                                    {group.values.map((v) => (
                                      <MenuItem key={v.id} value={v.id}>
                                        <Checkbox
                                          checked={selectedInGroup.includes(
                                            v.id
                                          )}
                                        />
                                        <ListItemText
                                          primary={v.label}
                                          secondary={v.description}
                                        />
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )
                              }}
                            />

                            {errors.productVariants?.[index]?.valueIds && (
                              <FormHelperText>
                                {
                                  errors.productVariants?.[index]?.valueIds
                                    ?.message
                                }
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      )
                    })
                  )}

                  <Grid size={{ xs: 12 }}>
                    <Controller
                      name={`productVariants.${index}.isActive`}
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} />}
                          label="Active Variant"
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Variant Images
                    </Typography>
                    <Controller
                      name={`productVariants.${index}.productImages`}
                      control={control}
                      render={({ field }) => (
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap={2}
                          flexWrap="wrap"
                        >
                          {(field.value || []).map((file, imgIndex) => {
                            const isFileObject = file instanceof File
                            const imageUrl = isFileObject
                              ? URL.createObjectURL(file)
                              : (file as { url: string }).url

                            return (
                              <ImagePreviewBox
                                key={imgIndex}
                                onClick={() => handlePreview(file)}
                              >
                                <StyledAvatar
                                  src={imageUrl}
                                  variant="rounded"
                                />
                                <RemoveImageButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const updated = [...(field.value || [])]
                                    updated.splice(imgIndex, 1)
                                    setValue(
                                      `productVariants.${index}.productImages`,
                                      updated
                                    )
                                  }}
                                >
                                  <CloseIcon fontSize="small" />
                                </RemoveImageButton>
                              </ImagePreviewBox>
                            )
                          })}
                          <FileUploader
                            label="Add Image"
                            accept="image/*"
                            multiple
                            icon={<AddPhotoAlternateIcon />}
                            onFileSelect={(files) =>
                              setValue(
                                `productVariants.${index}.productImages`,
                                [...(field.value || []), ...files],
                                { shouldValidate: true }
                              )
                            }
                          />
                        </Stack>
                      )}
                    />
                  </Grid>
                </Grid>
              </VariantPaper>
            ))}
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <AddVariantButton
              variant="outlined"
              onClick={() =>
                appendVariant({
                  price: '0',
                  discount: '0',
                  stock: '0',
                  isActive: true,
                  productImages: [],
                  valueIds: [],
                })
              }
            >
              Add Variant
            </AddVariantButton>
          </Stack>
        </SectionPaper>

        <ActionButtonsContainer direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate('/products')}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
                ? 'Update Product'
                : 'Create Product'}
          </Button>
        </ActionButtonsContainer>
      </form>
      <PreviewDialog
        file={previewFile instanceof File ? previewFile : null}
        onClose={handleClosePreview}
      />
    </FormWrapper>
  )
}

export default CreateUpdateProductPage
