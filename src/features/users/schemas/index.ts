import { z } from 'zod'

export const createUserSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  userName: z.string().min(1, 'Username is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  roleId: z.string().min(1, 'Role is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type CreateUserFormInputs = z.infer<typeof createUserSchema>
