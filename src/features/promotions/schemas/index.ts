import dayjs from 'dayjs'
import { z } from 'zod'

export const createPromotionSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().optional().or(z.literal('')),
    discountPercent: z.coerce.number().min(0).max(100),
    requiredPoints: z.coerce.number().int().min(0),
    startAt: z.string().min(1, 'Start time is required'),
    endAt: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => {
      const start = dayjs(data.startAt)
      const end = dayjs(data.endAt)
      return start.isValid() && end.isValid() && end.isAfter(start)
    },
    { message: 'End time must be after Start time', path: ['endAt'] }
  )

export type CreatePromotionFormInput = z.input<typeof createPromotionSchema>
export type CreatePromotionFormOutput = z.output<typeof createPromotionSchema>
