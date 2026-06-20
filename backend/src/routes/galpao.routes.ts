import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	atualizarGalpaoController,
	buscarGalpaoController,
	criarGalpaoController,
	deletarGalpaoController,
	listarGalpoesController,
} from '../controllers/galpao.controller.js'
import {
	atualizarGalpaoSchema,
	criarGalpaoSchema,
} from '../models/galpao.model.js'

const galpaoResponse = z.object({
	id: z.string(),
	nome: z.string(),
	capacidade: z.number(),
	criadoEm: z.date(),
	atualizadoEm: z.date(),
})

const galpaoListaResponse = z.object({
	id: z.string(),
	nome: z.string(),
	capacidade: z.number(),
	criadoEm: z.date(),
	atualizadoEm: z.date(),
	_count: z.object({
		lotes: z.number(),
		dispositivos: z.number(),
	}),
})

const erroResponse = z.object({
	erro: z.string(),
})

export const galpaoRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'POST',
		url: '/galpoes',
		schema: {
			tags: ['galpoes'],
			summary: 'Criar um novo galpão',
			body: criarGalpaoSchema,
			response: {
				201: galpaoResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: criarGalpaoController,
	})

	app.route({
		method: 'GET',
		url: '/galpoes',
		schema: {
			tags: ['galpoes'],
			summary: 'Listar galpões do usuário (paginado)',
			querystring: z.object({
				pagina: z.coerce.number().int().positive().default(1),
				porPagina: z.coerce.number().int().min(1).max(100).default(10),
			}),
			response: {
				200: z.object({
					galpoes: z.array(galpaoListaResponse),
					total: z.number(),
					pagina: z.number(),
					porPagina: z.number(),
				}),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: listarGalpoesController,
	})

	app.route({
		method: 'GET',
		url: '/galpoes/:id',
		schema: {
			tags: ['galpoes'],
			summary: 'Buscar galpão por ID (detalhe completo)',
			params: z.object({ id: z.uuid() }),
			response: {
				200: z.object({
					id: z.string(),
					nome: z.string(),
					capacidade: z.number(),
					criadoEm: z.date(),
					atualizadoEm: z.date(),
					lotes: z.array(z.any()),
					dispositivos: z.array(z.any()),
				}),
				404: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: buscarGalpaoController,
	})

	app.route({
		method: 'PUT',
		url: '/galpoes/:id',
		schema: {
			tags: ['galpoes'],
			summary: 'Atualizar dados de um galpão',
			params: z.object({ id: z.uuid() }),
			body: atualizarGalpaoSchema,
			response: {
				200: galpaoResponse,
				404: erroResponse,
				409: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: atualizarGalpaoController,
	})

	app.route({
		method: 'DELETE',
		url: '/galpoes/:id',
		schema: {
			tags: ['galpoes'],
			summary: 'Excluir um galpão',
			params: z.object({ id: z.uuid() }),
			response: {
				204: z.undefined(),
				404: erroResponse,
				409: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: deletarGalpaoController,
	})
}
