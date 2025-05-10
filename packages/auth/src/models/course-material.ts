import { z } from 'zod'

import { courseSchema } from './course'

export const courseMaterialSchema = z.object({
  __typename: z.literal('CourseMaterial').default('CourseMaterial'),
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string(),
  downloadUrl: z.string().url(),
  course: courseSchema,
})

export type CourseMaterial = z.infer<typeof courseMaterialSchema>
