import z from 'zod'

import type { FastifyTypedInstance } from '@/types'
import { makeCreateUserUseCase } from '@/use-cases/factories/user/make-create-user-use-case'

export async function createUser(app: FastifyTypedInstance) {
  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Create a new user',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.null().describe('User created'),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body

      const createUserUseCase = makeCreateUserUseCase()

      await createUserUseCase.execute({
        name,
        email,
      })

      return reply.status(201).send()
    },
  )
}
