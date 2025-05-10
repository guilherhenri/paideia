import { z } from 'zod'

export const courseSchema = z.object({
  __typename: z.literal('Course').default('Course'),
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  logoImage: z.string().url(),
  accessDurationMonths: z.number().int().positive(),
  instructorId: z.string().uuid(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']),
})

export type Course = z.infer<typeof courseSchema>
