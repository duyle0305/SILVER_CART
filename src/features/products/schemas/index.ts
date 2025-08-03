import { z } from 'zod'
import type { ProductType } from '@/features/products/constants'

const productItemSchema = z
  .object({
    sku: z.string().optional(),
    stock: z.number().min(0, 'Stock is required'),
    originalPrice: z.number().min(0, 'Original price is required'),
    discountedPrice: z.number().optional(),
    weight: z.number().optional(),
    images: z.array(z.instanceof(File)).optional(),
  })
  .refine(
    (data) => {
      if (data.discountedPrice === undefined || data.discountedPrice === null) {
        return true
      }
      return data.discountedPrice <= data.originalPrice
    },
    {
      message: 'Discount price must be less than or equal to original price',
      path: ['discountedPrice'],
    }
  )

const productVariantSchema = z.object({
  variantName: z.string().min(1, 'Variant name is required'),
  price: z.number().min(0, 'Price is required'),
  productItems: z
    .array(productItemSchema)
    .min(1, 'At least one product item is required'),
})

export const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  videoPath: z.string().optional(),
  videoFile: z.instanceof(File).optional(),
  productType: z.custom<ProductType>(),
  categoryIds: z
    .array(z.string().min(1, 'Category is required'))
    .length(1, 'At least one category is required'),
  productVariants: z
    .array(productVariantSchema)
    .min(1, 'At least one variant is required'),
})

export type AddProductFormInputs = z.infer<typeof addProductSchema>
