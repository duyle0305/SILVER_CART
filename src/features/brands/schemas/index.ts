import { z } from 'zod'

export const createBrandSchema = z.object({
  values: z
    .array(
      z.object({
        code: z.string().min(1, 'Code is required'),
        label: z.string().min(1, 'Label is required'),
        description: z.string().optional(),
      })
    )
    .min(1, 'At least one brand value is required'),
})

export type CreateBrandFormInputs = z.infer<typeof createBrandSchema>
