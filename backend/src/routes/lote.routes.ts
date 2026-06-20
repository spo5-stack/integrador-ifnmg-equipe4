import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	atualizarLoteController,
	criarLoteController,
	encerrarLoteController,
	listarLotesController,
} from '../controllers/lote.controller.js'

export const loteRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'POST',
		url: '/galpoes/:galpaoId/lotes',
		schema: {
			tags: ['lotes'],
			summary: 'Criar lote em um galpão',
			params: z.object({
				galpaoId: z.uuid(),
			}),
			body: z.object({
				quantidade: z.number().int().positive(),
				dataInicio: z.iso.datetime(),
			}),
			response: {
				201: z.object({
					id: z.string(),
					quantidade: z.number(),
					dataInicio: z.date(),
					status: z.string(),
					galpoesId: z.string(),
					criadoEm: z.date(),
					atualizadoEm: z.date(),
				}),
				409: z.object({ erro: z.string() }),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: criarLoteController,
	})

	app.route({
		method: 'GET',
		url: '/galpoes/:galpaoId/lotes',
		schema: {
			tags: ['lotes'],
			summary: 'Listar lotes de um galpão',
			params: z.object({
				galpaoId: z.uuid(),
			}),
			response: {
				200: z.array(
					z.object({
						id: z.string(),
						quantidade: z.number(),
						dataInicio: z.date(),
						status: z.string(),
						fase: z.string(),
						galpoesId: z.string(),
						criadoEm: z.date(),
						atualizadoEm: z.date(),
					}),
				),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: listarLotesController,
	})

	app.route({
		method: 'PUT',
		url: '/lotes/:id',
		schema: {
			tags: ['lotes'],
			summary: 'Atualizar dados de um lote',
			params: z.object({
				id: z.uuid(),
			}),
			body: z.object({
				quantidade: z.number().int().positive().optional(),
				dataInicio: z.string().datetime().optional(),
			}),
			response: {
				200: z.object({
					id: z.string(),
					quantidade: z.number(),
					dataInicio: z.date(),
					status: z.string(),
					galpoesId: z.string(),
					criadoEm: z.date(),
					atualizadoEm: z.date(),
				}),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: atualizarLoteController,
	})

	app.route({
		method: 'PATCH',
		url: '/lotes/:id/encerrar',
		schema: {
			tags: ['lotes'],
			summary: 'Encerrar um lote (status DESATIVADO)',
			params: z.object({
				id: z.uuid(),
			}),
			response: {
				200: z.object({
					id: z.string(),
					quantidade: z.number(),
					dataInicio: z.date(),
					status: z.string(),
					galpoesId: z.string(),
					criadoEm: z.date(),
					atualizadoEm: z.date(),
				}),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: encerrarLoteController,
	})
}
