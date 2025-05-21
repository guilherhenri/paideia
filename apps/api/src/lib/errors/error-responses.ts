import { z } from 'zod'

import {
  errorCodes,
  type HttpStatusCode,
  httpStatusToErrorCode,
} from './error-codes'

const baseErrorSchema = z.object({
  message: z.string(),
})

function createErrorSchema(statusCode: HttpStatusCode) {
  const errorCode = httpStatusToErrorCode[statusCode]

  const schema = baseErrorSchema
    .extend({
      code: z.literal(errorCodes[errorCode]),
      status: z.literal(statusCode),
    })
    .describe(`${httpStatusToErrorCode[statusCode]} Response`)

  if (statusCode === 400) {
    return schema.extend({
      details: z.object({
        fields: z.array(z.string()).default([]),
      }),
    })
  } else {
    return schema.extend({
      details: z.record(z.string(), z.unknown()).default({}),
    })
  }
}

export function getErrorResponses(statusCodes: HttpStatusCode[]) {
  const errorResponses: Record<number, z.ZodObject<z.ZodRawShape>> = {}

  statusCodes.forEach((code) => {
    if (code in httpStatusToErrorCode) {
      errorResponses[code] = createErrorSchema(code)
    }
  })

  return errorResponses
}
