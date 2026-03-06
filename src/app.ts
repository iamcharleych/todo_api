import express from 'express'
import { todosRouter } from './todos/todos.router.js'
import { errorHandler } from './middleware/error-handler.js'

export const app = express()

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

app.use('/api/todos', todosRouter)

// 404 для неизвестных маршрутов
app.use((req, res) => {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: `${req.method} ${req.path} not found` },
  })
})

// Error handler — ВСЕГДА ПОСЛЕДНИЙ
app.use(errorHandler)