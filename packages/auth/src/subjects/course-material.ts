import { z } from 'zod'

import { courseMaterialSchema } from '../models/course-material'

export const courseMaterialSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('CourseMaterial'), courseMaterialSchema]),
])

export type CourseMaterialSubject = z.infer<typeof courseMaterialSubject>
