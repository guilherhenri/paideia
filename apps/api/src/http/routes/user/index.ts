import type { FastifyTypedInstance } from '@/types'

import { createUser } from './create-user'

export async function userRoutes(app: FastifyTypedInstance) {
  app.register(createUser)
}
