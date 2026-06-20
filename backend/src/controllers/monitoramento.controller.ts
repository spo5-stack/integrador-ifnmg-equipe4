import type { FastifyReply, FastifyRequest } from 'fastify'
import { RecursoNaoEncontradoError } from '../services/errors/recurso-nao-encontrado.error.js'
import {
	buscarDashboardService,
	buscarStatusGalpaoService,
} from '../services/monitoramento.service.js'

export async function buscarStatusGalpaoController(
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const status = await buscarStatusGalpaoService(request.params.id, usuarioId)
		return reply.send(status)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function buscarDashboardController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const dashboard = await buscarDashboardService(usuarioId)
		return reply.send(dashboard)
	} catch (erro) {
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
