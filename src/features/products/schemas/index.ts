import { z } from 'zod'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const addProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  productType: z.string().min(1, 'Product type is required'),
  category: z.string().min(1, 'Category is required'),
  weight: z.string().optional(),
  stock: z.number().min(0, 'Stock is required'),
  originalPrice: z.number().min(0, 'Original price is required'),
  discountPrice: z.number().min(0, 'Discount price is required'),
  images: z
    .array(z.instanceof(File))
    .optional()
    .refine(
      (files) => !files || files.every((file) => file.size <= MAX_FILE_SIZE),
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        !files ||
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
})

export type AddProductFormInputs = z.infer<typeof addProductSchema>
