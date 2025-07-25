import z from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
  stayLoggedIn: z.boolean().optional(),
})

export type LoginFormInputs = z.infer<typeof loginSchema>
