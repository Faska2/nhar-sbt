import { asyncHandler } from '../utils/asyncHandler.js'
import * as productService from '../services/productService.js'

export const list = asyncHandler(async (req, res) => {
  const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined
  const q = typeof req.query.q === 'string' ? req.query.q : undefined
  const sort = typeof req.query.sort === 'string' ? req.query.sort : undefined
  const products = await productService.listProducts({
    categoryId,
    q,
    sort: sort === 'price_asc' || sort === 'price_desc' || sort === 'newest' ? sort : undefined
  })
  res.status(200).json({ products })
})

export const getOne = asyncHandler(async (req, res) => {
  const product = await productService.getProduct(req.params.id!)
  res.status(200).json({ product })
})

export const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body)
  res.status(201).json({ product })
})

export const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id!, req.body)
  res.status(200).json({ product })
})

export const remove = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id!)
  res.status(200).json(result)
})
