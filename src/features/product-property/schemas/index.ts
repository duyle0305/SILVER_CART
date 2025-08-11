import { z } from 'zod'

export const createProductPropertySchema = z.object({
  note: z.string().min(1, 'Note is required'),
  label: z.string().min(1, 'Label is required'),
  values: z
    .array(
      z.object({
        code: z.string().min(1, 'Value code is required'),
        label: z.string().min(1, 'Value label is required'),
        description: z.string().optional(),
      })
    )
    .min(1, 'At least one value is required'),
})

export type CreateProductPropertyFormInputs = z.infer<
  typeof createProductPropertySchema
>
