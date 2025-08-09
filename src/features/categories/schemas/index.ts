import { z } from 'zod'

export const createRootCategorySchema = z.object({
  values: z
    .array(
      z.object({
        code: z.string().min(1, 'Code is required'),
        label: z.string().min(1, 'Label is required'),
        description: z.string().optional(),
      })
    )
    .min(1, 'At least one value is required'),
})

export type CreateRootCategoryFormInputs = z.infer<
  typeof createRootCategorySchema
>

const subCategoryValueSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  label: z.string().min(1, 'Label is required'),
  description: z.string().optional(),
})

export const createSubCategorySchema = z.object({
  label: z.string().min(1, 'Sub-category label is required'),
  note: z.string().optional(),
  values: z
    .array(subCategoryValueSchema)
    .min(1, 'At least one value is required'),
})

export type CreateSubCategoryFormInputs = z.infer<
  typeof createSubCategorySchema
>
