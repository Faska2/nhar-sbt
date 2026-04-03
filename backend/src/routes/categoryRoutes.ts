import { Router } from 'express'
import { z } from 'zod'
import * as categoryController from '../controllers/categoryController.js'
import { requireAuth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/requireRole.js'
import { validateBody, validateParams } from '../middlewares/validate.js'

export const categoryRouter = Router()

categoryRouter.get('/', categoryController.list)

categoryRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(z.object({ name: z.string().min(1), slug: z.string().min(1).optional() })),
  categoryController.create
)

categoryRouter.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateParams(z.object({ id: z.string().min(1) })),
  validateBody(z.object({ name: z.string().min(1).optional(), slug: z.string().min(1).optional() })),
  categoryController.update
)

categoryRouter.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateParams(z.object({ id: z.string().min(1) })),
  categoryController.remove
)

