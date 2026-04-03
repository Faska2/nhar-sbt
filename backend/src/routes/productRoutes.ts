import { Router } from 'express'
import { z } from 'zod'
import * as productController from '../controllers/productController.js'
import { requireAuth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/requireRole.js'
import { validateBody, validateParams } from '../middlewares/validate.js'

export const productRouter = Router()

productRouter.get('/', productController.list)
productRouter.get(
  '/:id',
  validateParams(z.object({ id: z.string().min(1) })),
  productController.getOne
)

productRouter.post(
  '/',
  requireAuth,
  requireRole('ADMIN'),
  validateBody(
    z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      stock: z.number().int().min(0),
      categoryId: z.string().min(1),
      images: z.array(z.string().url()).default([])
    })
  ),
  productController.create
)

productRouter.patch(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateParams(z.object({ id: z.string().min(1) })),
  validateBody(
    z
      .object({
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        price: z.number().positive().optional(),
        stock: z.number().int().min(0).optional(),
        categoryId: z.string().min(1).optional(),
        images: z.array(z.string().url()).optional()
      })
      .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' })
  ),
  productController.update
)

productRouter.delete(
  '/:id',
  requireAuth,
  requireRole('ADMIN'),
  validateParams(z.object({ id: z.string().min(1) })),
  productController.remove
)

