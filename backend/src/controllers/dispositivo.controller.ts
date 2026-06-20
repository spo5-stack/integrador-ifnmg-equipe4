import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	AtualizarDispositivoDados,
	CriarDispositivoDados,
} from '../models/dispositivo.model.js'
import {
	atualizarDispositivoService,
	criarDispositivoService,
	deletarDispositivoService,
	listarDispositivosService,
} from '../services/dispositivo.service.js'
import { RecursoNaoEncontradoError } from '../services/errors/recurso-nao-encontrado.error.js'

type GalpaoIdParams = { galpaoId: string }
type IdParams = { id: string }

export async function criarDispositivoController(
	request: FastifyRequest<{
		Params: GalpaoIdParams
		Body: CriarDispositivoDados
	}>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const dispositivo = await criarDispositivoService(
			request.body,
			request.params.galpaoId,
			usuarioId,
		)
		return reply.status(201).send(dispositivo)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function listarDispositivosController(
	request: FastifyRequest<{ Params: GalpaoIdParams }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const dispositivos = await listarDispositivosService(
			request.params.galpaoId,
			usuarioId,
		)
		return reply.send(dispositivos)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function atualizarDispositivoController(
	request: FastifyRequest<{
		Params: IdParams
		Body: AtualizarDispositivoDados
	}>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const dispositivo = await atualizarDispositivoService(
			request.params.id,
			request.body,
			usuarioId,
		)
		return reply.send(dispositivo)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function deletarDispositivoController(
	request: FastifyRequest<{ Params: IdParams }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		await deletarDispositivoService(request.params.id, usuarioId)
		return reply.status(204).send()
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
