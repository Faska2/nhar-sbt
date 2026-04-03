import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().optional().default(4000),
  DATABASE_URL: z.string().optional().default('file:./dev.db'),
  JWT_SECRET: z.string().min(16),
  FRONTEND_ORIGIN: z.string().optional().default('http://localhost:5173')
})

export const env = envSchema.parse(process.env)

