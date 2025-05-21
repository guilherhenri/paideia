import type { FastifyInstance } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'

import type { AppErrorResponse } from '@/lib/errors/app-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request, reply) => {
    request.getCurrentUserId = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>()

        return sub
      } catch {
        return reply.status(401).send({
          code: 'TOKEN_INVALID',
          message: 'Token inválido ou expirado.',
        } as AppErrorResponse)
      }
    }
  })
})
