import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { apiRouter } from './routes/index.js'
import { env } from './config/env.js'
import { errorHandler } from './middlewares/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: true
    })
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan('dev'))

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true })
  })

  app.use('/api', apiRouter)

  app.use(errorHandler)

  return app
}

