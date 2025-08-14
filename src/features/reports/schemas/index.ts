import { z } from 'zod'

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

export const createReportSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z
    .string()
    .refine((v) => stripTags(v).length > 0, 'Description cannot be empty'),
})

export type CreateReportFormInput = z.input<typeof createReportSchema>
export type CreateReportFormOutput = z.output<typeof createReportSchema>
