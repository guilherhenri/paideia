

import { createEnv } from '@t3-oss/env-nextjs'
import { z  } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),

    JWT_SECRET: z.string(),

    GITHUB_OAUTH_CLIENT_ID: z.string(),
    GITHUB_OAUTH_CLIENT_SECRET: z.string(),
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string().url(),
  },
  client: {},
  shared: {
    API_URL: z.string(),
    APP_URL: z.string(),

    TOKEN_COOKIE_NAME: z.string(),
    REFRESH_TOKEN_COOKIE_NAME: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET,

    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    GITHUB_OAUTH_CLIENT_REDIRECT_URI: process.env.GITHUB_OAUTH_CLIENT_REDIRECT_URI,

    API_URL: process.env.API_URL,
    APP_URL: process.env.APP_URL,

    TOKEN_COOKIE_NAME: process.env.TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME,
  },
  emptyStringAsUndefined: true,
})