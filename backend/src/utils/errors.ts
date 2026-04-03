import type { ZodError } from 'zod'

export class AppError extends Error {
  statusCode: number
  details?: unknown

  constructor(message: string, statusCode = 400, details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
}

export function formatZodError(error: ZodError) {
  return error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }))
}

