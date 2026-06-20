import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	atualizarDispositivoController,
	criarDispositivoController,
	deletarDispositivoController,
	listarDispositivosController,
} from '../controllers/dispositivo.controller.js'
import {
	atualizarDispositivoSchema,
	criarDispositivoSchema,
} from '../models/dispositivo.model.js'

const dispositivoResponse = z.object({
	id: z.string(),
	nome: z.string(),
	modelo: z.string(),
	status: z.enum(['ATIVO', 'DESATIVADO']),
	galpoesId: z.string(),
	criadoEm: z.date(),
	atualizadoEm: z.date(),
})

const erroResponse = z.object({
	erro: z.string(),
})

export const dispositivoRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'POST',
		url: '/galpoes/:galpaoId/dispositivos',
		schema: {
			tags: ['dispositivos'],
			summary: 'Cadastrar dispositivo em um galpão',
			params: z.object({ galpaoId: z.uuid() }),
			body: criarDispositivoSchema,
			response: {
				201: dispositivoResponse,
				404: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: criarDispositivoController,
	})

	app.route({
		method: 'GET',
		url: '/galpoes/:galpaoId/dispositivos',
		schema: {
			tags: ['dispositivos'],
			summary: 'Listar dispositivos de um galpão',
			params: z.object({ galpaoId: z.uuid() }),
			response: {
				200: z.array(dispositivoResponse),
				404: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: listarDispositivosController,
	})

	app.route({
		method: 'PUT',
		url: '/dispositivos/:id',
		schema: {
			tags: ['dispositivos'],
			summary: 'Atualizar dados de um dispositivo',
			params: z.object({ id: z.uuid() }),
			body: atualizarDispositivoSchema,
			response: {
				200: dispositivoResponse,
				404: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: atualizarDispositivoController,
	})

	app.route({
		method: 'DELETE',
		url: '/dispositivos/:id',
		schema: {
			tags: ['dispositivos'],
			summary: 'Remover dispositivo',
			params: z.object({ id: z.uuid() }),
			response: {
				204: z.undefined(),
				404: erroResponse,
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: deletarDispositivoController,
	})
}
