import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	criarLeiturasController,
	listarLeiturasController,
} from '../controllers/leituras-sensor.controller.js'
import { criarLeituraSchema } from '../models/leitura-sensor.model.js'

export const leituraSensorRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'POST',
		url: '/leituras-sensores',
		schema: {
			tags: ['leituras-sensor'],
			summary: 'Receber lote de leituras do gateway',
			body: z.array(criarLeituraSchema),
			response: {
				201: z.object({
					recebidas: z.number(),
				}),
				422: z.object({
					erro: z.string(),
				}),
			},
		},
		handler: criarLeiturasController,
	})

	app.route({
		method: 'GET',
		url: '/dispositivos/:dispositivosId/leituras',
		schema: {
			tags: ['leituras-sensor'],
			summary: 'Listar histórico de leituras de um dispositivo',
			params: z.object({
				dispositivosId: z.uuid(),
			}),
			querystring: z.object({
				pagina: z.coerce.number().int().positive().default(1),
				porPagina: z.coerce.number().int().positive().max(100).default(20),
			}),
			response: {
				200: z.object({
					leituras: z.array(
						z.object({
							id: z.string(),
							valorLuminosidade: z.number(),
							criadoEm: z.date(),
						}),
					),
					total: z.number(),
					pagina: z.number(),
					porPagina: z.number(),
				}),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: listarLeiturasController,
	})
}
