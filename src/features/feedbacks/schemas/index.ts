import { z } from 'zod'

const stripTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim()

export const respondFeedbackSchema = z.object({
  responseMessage: z
    .string()
    .refine(
      (val) => stripTags(val).length > 0,
      'Response message cannot be empty'
    ),
  responseAttachment: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
})

export type RespondFeedbackFormInput = z.input<typeof respondFeedbackSchema>
export type RespondFeedbackFormOutput = z.output<typeof respondFeedbackSchema>
