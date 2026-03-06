import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default('local.db'),
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})

export const config = envSchema.parse(process.env)