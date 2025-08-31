import { z } from 'zod'

const productVariantInputSchema = z.object({
  price: z.string().min(1, 'Price is required'),
  discount: z.string().min(1, 'Discount is required'),
  stock: z.string().min(1, 'Stock is required'),
  isActive: z.boolean(),
  productImages: z.array(
    z.union([z.instanceof(File), z.object({ url: z.string().url() })])
  ),
  valueIds: z.array(z.string()).optional(),
})

export const createProductInputSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().optional(),
  videoFile: z.instanceof(File).optional(),
  weight: z.string().min(1, 'Weight is required'),
  height: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  manufactureDate: z.any().refine((val) => val, {
    message: 'Manufacture date is required',
  }),
  expirationDate: z.any().refine((val) => val, {
    message: 'Expiration date is required',
  }),
  valueCategoryIds: z
    .array(z.string())
    .min(1, 'Please select at least one category'),
  productVariants: z
    .array(productVariantInputSchema)
    .min(1, 'At least one product variant is required'),
})

export const createProductOutputSchema = createProductInputSchema.transform(
  (data) => ({
    ...data,
    weight: parseFloat(data.weight),
    height: data.height ? parseFloat(data.height) : null,
    length: data.length ? parseFloat(data.length) : null,
    width: data.width ? parseFloat(data.width) : null,
    productVariants: data.productVariants.map((variant) => ({
      ...variant,
      price: parseFloat(variant.price),
      discount: parseFloat(variant.discount),
      stock: parseFloat(variant.stock),
    })),
  })
)

export type CreateProductFormInputs = z.infer<typeof createProductInputSchema>
export type CreateProductOutputs = z.infer<typeof createProductOutputSchema>
