import { z } from 'zod'

import { moduleSchema } from '../models/module'

export const moduleSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('read'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.union([z.literal('Module'), moduleSchema]),
])

export type ModuleSubject = z.infer<typeof moduleSubject>
