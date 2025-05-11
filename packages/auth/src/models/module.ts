import { z } from 'zod'

import { courseSchema } from './course'

// const courseForLessonSchema = courseSchema.pick({
//   instructorId: true,
// })

export const moduleSchema = z.object({
  __typename: z.literal('Module').default('Module'),
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  order: z.number().int(),
  course: courseSchema,
})

export type Module = z.infer<typeof moduleSchema>
