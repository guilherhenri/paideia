import { env } from '@paideia/env'
import z from 'zod'

import { errorCodes } from '@/lib/errors/error-codes'
import type { FastifyTypedInstance } from '@/types'

export async function refreshToken(app: FastifyTypedInstance) {
  app.patch(
    '/token/refresh',
    {
      schema: {
        tags: ['auth'],
        summary: 'Refresh JWT token',
        response: {
          201: z.object({
            token: z.string(),
          }),
          401: z
            .object({
              code: z.literal(errorCodes.TOKEN_INVALID),
              message: z.string(),
            })
            .describe('TOKEN_INVALID'),
        },
      },
    },
    async (request, reply) => {
      try {
        const { sub } = await request.jwtVerify<{ sub: string }>({
          onlyCookie: true,
        })

        const token = await reply.jwtSign(
          {
            sub,
          },
          {
            sign: {
              expiresIn: '7d',
            },
          },
        )

        const refreshToken = await reply.jwtSign(
          {
            sub,
          },
          {
            sign: {
              sub,
              expiresIn: '7d',
            },
          },
        )

        return reply
          .setCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            path: '/',
            secure: true,
            httpOnly: true,
            sameSite: 'none',
          })
          .status(200)
          .send({
            token,
          })
      } catch {
        return reply.status(401).send({
          code: 'TOKEN_INVALID',
          message: 'Token inválido ou expirado.',
        })
      }
    },
  )
}
