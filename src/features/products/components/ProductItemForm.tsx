import FileUploader from '@/features/products/components/FileUploader'
import {
  ImagePreviewBox,
  RemoveImageButton,
  StyledAvatar,
} from '@/features/products/components/styles/CreateUpdateProductPage.styles'
import type { AddProductFormInputs } from '@/features/products/schemas'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import { Grid, Stack, TextField } from '@mui/material'
import { useEffect } from 'react'
import {
  Controller,
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'

interface ProductItemFormProps {
  variantIndex: number
  itemIndex: number
  control: Control<AddProductFormInputs>
  register: UseFormRegister<AddProductFormInputs>
  errors: FieldErrors<AddProductFormInputs>
  setValue: UseFormSetValue<AddProductFormInputs>
  onPreview: (file: File) => void
}

const ProductItemForm = ({
  variantIndex,
  itemIndex,
  control,
  register,
  errors,
  setValue,
  onPreview,
}: ProductItemFormProps) => {
  const originalPrice = useWatch({
    control,
    name: `productVariants.${variantIndex}.productItems.${itemIndex}.originalPrice`,
  })

  useEffect(() => {
    setValue(
      `productVariants.${variantIndex}.productItems.${itemIndex}.discountedPrice`,
      originalPrice
    )
  }, [originalPrice, variantIndex, itemIndex, setValue])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name={`productVariants.${variantIndex}.productItems.${itemIndex}.images`}
          control={control}
          render={({ field }) => (
            <Stack direction="row" alignItems="center" gap={2}>
              {(field.value || []).map((file, index) => (
                <ImagePreviewBox key={index} onClick={() => onPreview(file)}>
                  <StyledAvatar
                    src={URL.createObjectURL(file)}
                    variant="rounded"
                  />
                  <RemoveImageButton
                    size="small"
                    onClick={() => {
                      const updated = [...(field.value || [])]
                      updated.splice(index, 1)
                      setValue(
                        `productVariants.${variantIndex}.productItems.${itemIndex}.images`,
                        updated
                      )
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </RemoveImageButton>
                </ImagePreviewBox>
              ))}
              <FileUploader
                label="Add Item Image"
                accept="image/*"
                multiple
                icon={<AddPhotoAlternateIcon />}
                onFileSelect={(files) =>
                  setValue(
                    `productVariants.${variantIndex}.productItems.${itemIndex}.images`,
                    [...(field.value || []), ...files],
                    { shouldValidate: true }
                  )
                }
              />
            </Stack>
          )}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          {...register(
            `productVariants.${variantIndex}.productItems.${itemIndex}.stock`,
            { valueAsNumber: true }
          )}
          label="Stock"
          type="number"
          fullWidth
          error={
            !!errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.stock
          }
          helperText={
            errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.stock?.message
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          {...register(
            `productVariants.${variantIndex}.productItems.${itemIndex}.weight`,
            { valueAsNumber: true }
          )}
          label="Weight"
          type="number"
          fullWidth
          error={
            !!errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.weight
          }
          helperText={
            errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.weight?.message
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          {...register(
            `productVariants.${variantIndex}.productItems.${itemIndex}.originalPrice`,
            { valueAsNumber: true }
          )}
          label="Original Price"
          type="number"
          fullWidth
          error={
            !!errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.originalPrice
          }
          helperText={
            errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.originalPrice?.message
          }
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          {...register(
            `productVariants.${variantIndex}.productItems.${itemIndex}.discountedPrice`,
            { valueAsNumber: true }
          )}
          label="Discount Price"
          type="number"
          fullWidth
          error={
            !!errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.discountedPrice
          }
          helperText={
            errors.productVariants?.[variantIndex]?.productItems?.[itemIndex]
              ?.discountedPrice?.message
          }
        />
      </Grid>
    </Grid>
  )
}

export default ProductItemForm
