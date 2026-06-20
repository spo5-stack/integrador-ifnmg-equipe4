import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	buscarDashboardController,
	buscarStatusGalpaoController,
} from '../controllers/monitoramento.controller.js'

const dispositivoStatusSchema = z.object({
	id: z.string(),
	nome: z.string(),
	ultimaLeitura: z
		.object({
			valor: z.number(),
			criadoEm: z.date(),
		})
		.nullable(),
	statusLuminosidade: z.string(),
})

export const monitoramentoRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'GET',
		url: '/galpoes/:id/status',
		schema: {
			tags: ['monitoramento'],
			summary: 'Obter status atual de luminosidade de um galpão',
			params: z.object({
				id: z.uuid(),
			}),
			response: {
				200: z.object({
					galpaoId: z.string(),
					galpaoNome: z.string(),
					loteAtivo: z
						.object({
							id: z.string(),
							quantidade: z.number(),
							dataInicio: z.date(),
							status: z.string(),
							fase: z.string(),
						})
						.nullable(),
					dispositivos: z.array(dispositivoStatusSchema),
				}),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: buscarStatusGalpaoController,
	})

	app.route({
		method: 'GET',
		url: '/dashboard',
		schema: {
			tags: ['monitoramento'],
			summary: 'Obter dashboard com indicadores de todos os galpões',
			response: {
				200: z.object({
					totalGalpoes: z.number(),
					totalLotesAtivos: z.number(),
					totalDispositivos: z.number(),
					totalAdequados: z.number(),
					galpoes: z.array(
						z.object({
							galpaoId: z.string(),
							galpaoNome: z.string(),
							loteAtivo: z
								.object({
									id: z.string(),
									quantidade: z.number(),
									dataInicio: z.date(),
									status: z.string(),
									fase: z.string(),
								})
								.nullable(),
							dispositivos: z.array(dispositivoStatusSchema),
						}),
					),
				}),
			},
			security: [{ bearerAuth: [] }],
		},
		onRequest: [app.authenticate],
		handler: buscarDashboardController,
	})
}
