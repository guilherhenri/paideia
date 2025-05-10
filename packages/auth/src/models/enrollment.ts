import { z } from 'zod'

import { courseSchema } from './course'

export const enrollmentSchema = z.object({
  __typename: z.literal('Enrollment').default('Enrollment'),
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  accessExpiresAt: z.date(),
  course: courseSchema,
})

export type Enrollment = z.infer<typeof enrollmentSchema>
