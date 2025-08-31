import z from 'zod'

export const loginSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  deviceId: z.string().optional(),
  stayLoggedIn: z.boolean().optional(),
})

export type LoginFormInputs = z.infer<typeof loginSchema>
