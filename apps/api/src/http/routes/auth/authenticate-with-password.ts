import { env } from '@paideia/env'
import { z } from 'zod'

import { getErrorResponses } from '@/lib/errors/error-responses'
import type { FastifyTypedInstance } from '@/types'
import { makeAuthenticateWithPasswordUseCase } from '@/use-cases/factories/user/make-authenticate-with-password-use-case'

export async function authenticateWithPassword(app: FastifyTypedInstance) {
  app.post(
    '/auth/password',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with e-mail and password',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z
            .object({
              token: z.string(),
            })
            .describe('OK'),
          ...getErrorResponses([400, 401, 409]),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const authenticateWithPasswordUseCase =
        makeAuthenticateWithPasswordUseCase()

      const result = await authenticateWithPasswordUseCase.execute({
        email,
        password,
      })

      if (result.isLeft()) {
        throw result.value
      }

      const { user } = result.value

      const token = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      const refreshToken = await reply.jwtSign(
        {
          sub: user.id,
        },
        {
          sign: {
            sub: user.id,
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
    },
  )
}
