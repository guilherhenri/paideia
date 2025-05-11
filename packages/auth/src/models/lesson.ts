import { z } from 'zod'

import { courseSchema } from './course'
import { moduleSchema } from './module'

// const courseForLessonSchema = courseSchema.pick({
//   instructorId: true,
// })

// const moduleForLessonSchema = moduleSchema.omit({ course: true }).extend({
//   course: courseForLessonSchema,
// })

export const lessonSchema = z.object({
  __typename: z.literal('Lesson').default('Lesson'),
  id: z.string().uuid(),
  moduleId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  providerType: z.enum(['youtube', 'panda']),
  providerVideoId: z.string(),
  comment: z.string().nullable(),
  order: z.number().int(),
  module: moduleSchema,
})

export type Lesson = z.infer<typeof lessonSchema>
