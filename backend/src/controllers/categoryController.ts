import { asyncHandler } from '../utils/asyncHandler.js'
import * as categoryService from '../services/categoryService.js'

export const list = asyncHandler(async (_req, res) => {
  const categories = await categoryService.listCategories()
  res.status(200).json({ categories })
})

export const create = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body)
  res.status(201).json({ category })
})

export const update = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id!, req.body)
  res.status(200).json({ category })
})

export const remove = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id!)
  res.status(200).json(result)
})
