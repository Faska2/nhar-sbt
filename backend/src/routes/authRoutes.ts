import { Router } from 'express'
import { z } from 'zod'
import * as authController from '../controllers/authController.js'
import { validateBody } from '../middlewares/validate.js'
import { requireAuth } from '../middlewares/auth.js'

export const authRouter = Router()

authRouter.post(
  '/register',
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(1).optional()
    })
  ),
  authController.register
)

authRouter.post(
  '/login',
  validateBody(z.object({ email: z.string().email(), password: z.string().min(1) })),
  authController.login
)

authRouter.get('/me', requireAuth, authController.me)

