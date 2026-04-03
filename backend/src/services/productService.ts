import { prisma } from '../db/prisma.js'
import { AppError } from '../utils/errors.js'
import { Prisma } from '@prisma/client'

export async function listProducts(params: {
  categoryId?: string
  q?: string
  sort?: 'price_asc' | 'price_desc' | 'newest'
}) {
  const where: any = {}
  if (params.categoryId) where.categoryId = params.categoryId
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: 'insensitive' } },
      { description: { contains: params.q, mode: 'insensitive' } }
    ]
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    params.sort === 'price_asc'
      ? { price: 'asc' }
      : params.sort === 'price_desc'
        ? { price: 'desc' }
        : { createdAt: 'desc' }

  return prisma.product.findMany({
    where,
    orderBy,
    include: { images: true, category: true }
  })
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true }
  })
  if (!product) throw new AppError('Product not found', 404)
  return product
}

export async function createProduct(input: {
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  images: string[]
}) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } })
  if (!category) throw new AppError('Category not found', 404)

  const product = await prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      categoryId: input.categoryId,
      images: { create: input.images.map((url) => ({ url })) }
    },
    include: { images: true, category: true }
  })

  return product
}

export async function updateProduct(
  id: string,
  input: {
    name?: string
    description?: string
    price?: number
    stock?: number
    categoryId?: string
    images?: string[]
  }
) {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw new AppError('Product not found', 404)
  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } })
    if (!category) throw new AppError('Category not found', 404)
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: input.name ?? undefined,
      description: input.description ?? undefined,
      price: input.price ?? undefined,
      stock: input.stock ?? undefined,
      categoryId: input.categoryId ?? undefined
    },
    include: { images: true, category: true }
  })

  if (input.images) {
    await prisma.productImage.deleteMany({ where: { productId: id } })
    if (input.images.length > 0) {
      await prisma.productImage.createMany({
        data: input.images.map((url) => ({ url, productId: id }))
      })
    }
  }

  return prisma.product.findUnique({
    where: { id },
    include: { images: true, category: true }
  })
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) throw new AppError('Product not found', 404)

  await prisma.productImage.deleteMany({ where: { productId: id } })
  await prisma.cartItem.deleteMany({ where: { productId: id } })
  await prisma.orderItem.deleteMany({ where: { productId: id } })
  await prisma.product.delete({ where: { id } })
  return { ok: true }
}
