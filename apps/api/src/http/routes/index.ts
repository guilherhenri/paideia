import type { FastifyTypedInstance } from '@/types'

import { authRoutes } from './auth'
import { userRoutes } from './user'

export async function routes(app: FastifyTypedInstance) {
  app.register(authRoutes)
  app.register(userRoutes)
}
