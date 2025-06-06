import { z } from 'zod'

export const roleSchema = z.union([
  z.literal('ADMIN'),
  z.literal('INSTRUCTOR'),
  z.literal('STUDENT'),
])

export type Role = z.infer<typeof roleSchema>
