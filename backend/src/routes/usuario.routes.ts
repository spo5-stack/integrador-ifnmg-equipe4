import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	alterarSenhaController,
	atualizarNomeController,
	deletarUsuarioController,
} from '../controllers/usuario.controller.js'
import {
	alterarSenhaSchema,
	atualizarNomeSchema,
} from '../models/usuario.model.js'

const usuarioResponse = z.object({
	id: z.string(),
	nome: z.string(),
	email: z.string(),
})

export const usuarioRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'PATCH',
		url: '/usuarios/nome',
		schema: {
			tags: ['usuarios'],
			summary: 'Atualizar próprio nome',
			body: atualizarNomeSchema,
			response: {
				200: usuarioResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: atualizarNomeController,
	})

	app.route({
		method: 'PATCH',
		url: '/usuarios/senha',
		schema: {
			tags: ['usuarios'],
			summary: 'Alterar própria senha',
			body: alterarSenhaSchema,
			response: {
				200: usuarioResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: alterarSenhaController,
	})

	app.route({
		method: 'DELETE',
		url: '/usuarios',
		schema: {
			tags: ['usuarios'],
			summary: 'Excluir própria conta',
			response: {
				204: z.undefined(),
			},
			security: [{ bearerAuth: [] }],
		},

		onRequest: [app.authenticate],
		handler: deletarUsuarioController,
	})
}
