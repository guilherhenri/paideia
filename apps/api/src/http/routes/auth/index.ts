import type { FastifyTypedInstance } from '@/types'

import { authenticateWithGithub } from './authenticate-with-github'
import { authenticateWithPassword } from './authenticate-with-password'
import { getProfile } from './get-profile'

export async function authRoutes(app: FastifyTypedInstance) {
  app.register(authenticateWithPassword)
  app.register(authenticateWithGithub)
  app.register(getProfile)
}
