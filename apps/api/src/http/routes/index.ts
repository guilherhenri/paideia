import type { FastifyTypedInstance } from '@/types'

import { userRoutes } from './user'

export async function routes(app: FastifyTypedInstance) {
  app.register(userRoutes)
}
