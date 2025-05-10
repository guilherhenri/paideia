import { z } from 'zod'

export const userSchema = z.object({
  __typename: z.literal('User').default('User'),
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url().nullable(),
  role: z.enum(['ADMIN', 'INSTRUCTOR', 'STUDENT']),
})

export type User = z.infer<typeof userSchema>
