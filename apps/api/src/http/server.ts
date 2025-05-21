import { fastifyCookie } from '@fastify/cookie'
import { fastifyCors } from '@fastify/cors'
import { fastifyJwt } from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { env } from '@paideia/env'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { routes } from './routes'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: env.REFRESH_TOKEN_COOKIE_NAME,
    signed: false,
  },
  verify: {
    extractToken: (request) => {
      if (request.url === '/api/token/refresh') {
        return request.cookies && request.cookies[env.REFRESH_TOKEN_COOKIE_NAME]
      } else {
        return (
          request.headers.authorization &&
          request.headers.authorization.split(' ')[1]
        )
      }
    },
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.setErrorHandler(errorHandler)

app.register(fastifyCors, { origin: '*' })

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Paideia API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(routes, {
  prefix: '/api',
})

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running!')
  })
