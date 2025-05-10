import { z } from 'zod'

// import { courseSchema } from './course'
import { lessonSchema } from './lesson'
// import { moduleSchema } from './module'

// const courseForLessonSchema = courseSchema.pick({
//   instructorId: true,
// })

// const moduleForLessonSchema = moduleSchema.omit({ course: true }).extend({
//   course: courseForLessonSchema,
// })

// const lessonForProgressSchema = lessonSchema.omit({ module: true }).extend({
//   module: moduleForLessonSchema,
// })

export const progressSchema = z.object({
  __typename: z.literal('Progress').default('Progress'),
  id: z.string().uuid(),
  userId: z.string().uuid(),
  lessonId: z.string().uuid(),
  completed: z.boolean(),
  rating: z.number().int().min(1).max(5).nullable(),
  lesson: lessonSchema,
})

export type Progress = z.infer<typeof progressSchema>
