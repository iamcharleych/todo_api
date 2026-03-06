import { app } from './app.js'
import { config } from './config.js'

// launch server
app.listen(config.PORT, '0.0.0.0', () => {
	console.log(`Server running on http://localhost:${config.PORT} [${config.NODE_ENV}]`)
})

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
  // В продакшне: отправить в Sentry
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  // Graceful shutdown
  process.exit(1)
})