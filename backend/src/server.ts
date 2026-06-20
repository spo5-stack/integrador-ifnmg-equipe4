import { app } from './app.js'
import { env } from './env/index.js'

await app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		app.log.info('🚀 HTTP server Running!')
		app.log.info(`📚 Docs available at ${env.API_URL}/docs/`)
	})
