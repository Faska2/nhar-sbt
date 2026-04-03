import { prisma } from '../db/prisma.js'
import { AppError } from '../utils/errors.js'
import { toSlug } from '../utils/slug.js'

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export async function createCategory(input: { name: string; slug?: string }) {
  const slug = input.slug?.trim() ? toSlug(input.slug) : toSlug(input.name)
  const existing = await prisma.category.findUnique({ where: { slug } })
  if (existing) throw new AppError('Category slug already exists', 409)
  return prisma.category.create({ data: { name: input.name, slug } })
}

export async function updateCategory(id: string, input: { name?: string; slug?: string }) {
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) throw new AppError('Category not found', 404)

  const nextSlug = input.slug?.trim()
    ? toSlug(input.slug)
    : input.name?.trim()
      ? toSlug(input.name)
      : undefined

  if (nextSlug && nextSlug !== category.slug) {
    const existing = await prisma.category.findUnique({ where: { slug: nextSlug } })
    if (existing) throw new AppError('Category slug already exists', 409)
  }

  return prisma.category.update({
    where: { id },
    data: {
      name: input.name ?? undefined,
      slug: nextSlug ?? undefined
    }
  })
}

export async function deleteCategory(id: string) {
  const productsCount = await prisma.product.count({ where: { categoryId: id } })
  if (productsCount > 0) throw new AppError('Cannot delete category with products', 400)
  await prisma.category.delete({ where: { id } })
  return { ok: true }
}

