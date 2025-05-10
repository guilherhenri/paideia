import { z } from 'zod'

import { progressSchema } from '../models/progress'

export const progressSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
  ]),
  z.union([z.literal('Progress'), progressSchema]),
])

export type ProgressSubject = z.infer<typeof progressSubject>
