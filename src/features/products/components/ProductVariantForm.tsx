import ProductItemForm from '@/features/products/components/ProductItemForm'
import {
  AddItemButton,
  ProductItemWrapper,
  RemoveButton,
  SectionTitle,
} from '@/features/products/components/styles/CreateUpdateProductPage.styles'
import type { AddProductFormInputs } from '@/features/products/schemas'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Grid, Stack, TextField } from '@mui/material'
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form'

interface ProductVariantFormProps {
  variantIndex: number
  control: Control<AddProductFormInputs>
  register: UseFormRegister<AddProductFormInputs>
  errors: FieldErrors<AddProductFormInputs>
  setValue: UseFormSetValue<AddProductFormInputs>
  onPreview: (file: File) => void
}

const ProductVariantForm = ({
  variantIndex,
  control,
  register,
  errors,
  setValue,
  onPreview,
}: ProductVariantFormProps) => {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `productVariants.${variantIndex}.productItems`,
  })

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12 }} sx={{ mb: 2 }}>
          <TextField
            {...register(`productVariants.${variantIndex}.variantName`)}
            label="Variant name"
            placeholder="Enter variant name"
            fullWidth
            error={!!errors.productVariants?.[variantIndex]?.variantName}
            helperText={
              errors.productVariants?.[variantIndex]?.variantName?.message
            }
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            {...register(`productVariants.${variantIndex}.price`, {
              valueAsNumber: true,
            })}
            label="Price"
            type="number"
            placeholder="Enter price"
            fullWidth
            error={!!errors.productVariants?.[variantIndex]?.price}
            helperText={errors.productVariants?.[variantIndex]?.price?.message}
          />
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid size={{ xs: 12 }}>
          {itemFields.map((item, itemIndex) => (
            <ProductItemWrapper sx={{ marginBottom: '16px' }} key={item.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <SectionTitle>Product Item</SectionTitle>
                {itemFields.length > 1 && (
                  <Stack direction="row" justifyContent="flex-end">
                    <RemoveButton
                      color="error"
                      onClick={() => removeItem(itemIndex)}
                    >
                      <CloseIcon />
                    </RemoveButton>
                  </Stack>
                )}
              </Stack>
              <ProductItemForm
                variantIndex={variantIndex}
                itemIndex={itemIndex}
                control={control}
                register={register}
                errors={errors}
                setValue={setValue}
                onPreview={onPreview}
              />
            </ProductItemWrapper>
          ))}
          <AddItemButton
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              appendItem({
                stock: 0,
                originalPrice: 0,
                weight: 0,
                images: [],
              })
            }
          >
            Add Product Item
          </AddItemButton>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductVariantForm
