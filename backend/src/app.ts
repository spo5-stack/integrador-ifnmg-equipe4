import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env/index.js'
import { authRoutes } from './routes/auth.routes.js'
import { dispositivoRoutes } from './routes/dispositivo.routes.js'
import { galpaoRoutes } from './routes/galpao.routes.js'
import { leituraSensorRoutes } from './routes/leituras-sensor.routes.js'
import { loteRoutes } from './routes/lote.routes.js'
import { monitoramentoRoutes } from './routes/monitoramento.routes.js'
import { usuarioRoutes } from './routes/usuario.routes.js'
import { prisma } from './shared/database/prisma.js'

const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	},
	production: true,
	test: false,
}

export const app = fastify({
	logger: envToLogger[env.NODE_ENV],
}).withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(cors, {
	origin: env.CORS_ORIGIN,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
})

app.register(jwt, { secret: env.JWT_SECRET })

app.decorate(
	'authenticate',
	async (request: FastifyRequest, reply: FastifyReply) => {
		await request.jwtVerify()

		const usuario = await prisma.usuario.findUnique({
			where: { id: request.user.sub },
			select: { tokenVersion: true },
		})

		if (!usuario || usuario.tokenVersion !== (request.user.ver ?? 0)) {
			await reply.status(401).send({ erro: 'Sessão inválida ou expirada' })
			return
		}
	},
)

await app.register(fastifySwagger, {
	openapi: {
		openapi: '3.0.0',
		info: {
			title: 'Monitoramento de Luminosidade para Galpões Avícolas',
			description:
				'API REST do sistema de monitoramento de luminosidade em galpões de ' +
				'criação de aves. Realiza o cadastro de usuários, galpões, lotes e ' +
				'dispositivos IoT, além de receber leituras de sensores LDR via ' +
				'gateway e exibir dashboard com status de luminosidade por fase da ave.',
			version: '0.1.0',
		},
		servers: [
			{
				url: env.API_URL,
				description: 'Development server',
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
})

await app.register(scalarFastifyApiReference, {
	routePrefix: '/docs',
	configuration: {
		theme: 'bluePlanet',
	},
})

app.register(authRoutes, { prefix: '/api' })
app.register(dispositivoRoutes, { prefix: '/api' })
app.register(usuarioRoutes, { prefix: '/api' })
app.register(galpaoRoutes, { prefix: '/api' })
app.register(loteRoutes, { prefix: '/api' })
app.register(leituraSensorRoutes, { prefix: '/api' })
app.register(monitoramentoRoutes, { prefix: '/api' })
