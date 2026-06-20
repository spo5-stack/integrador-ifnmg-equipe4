import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	cadastrarController,
	entrarController,
} from '../controllers/auth.controller.js'
import { loginSchema, registerSchema } from '../models/auth.model.js'

const usuarioResponse = z.object({
	id: z.string(),
	nome: z.string(),
	email: z.string(),
})

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'POST',
		url: '/auth/register',
		schema: {
			tags: ['auth'],
			summary: 'Cadastrar novo usuário',
			body: registerSchema,
			response: {
				201: z.object({
					usuario: usuarioResponse,
					token: z.string(),
				}),
			},
		},
		handler: cadastrarController,
	})

	app.route({
		method: 'POST',
		url: '/auth/login',
		schema: {
			tags: ['auth'],
			summary: 'Fazer login',
			body: loginSchema,
			response: {
				200: z.object({
					usuario: usuarioResponse,
					token: z.string(),
				}),
			},
		},
		handler: entrarController,
	})
}
