import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { AppError, type AppErrorResponse } from '@/lib/errors/app-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(error.statusCode ?? 400).send({
      code: 'INVALID_INPUT',
      message:
        error.validation.length > 1 ? 'Campos inválidos.' : 'Campo inválido.',
      details: {
        fields: error.validation.map(
          (err) => err.instancePath.replace('/', '') ?? 'unknown',
        ),
      },
    } as AppErrorResponse)
  }

  if (error instanceof AppError) {
    return reply.status(error.status).send({
      code: error.code,
      message: error.message,
    } as AppErrorResponse)
  }

  console.log(error)

  return reply.status(500).send({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor.',
  } as AppErrorResponse)
}
