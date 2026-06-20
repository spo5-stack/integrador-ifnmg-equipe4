import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	AtualizarLoteDados,
	CriarLoteDados,
} from '../models/lote.model.js'
import { DataInicioFuturaError } from '../services/errors/data-inicio-futura.error.js'
import { LoteAtivoExistenteError } from '../services/errors/lote-ativo-existente.error.js'
import { RecursoNaoEncontradoError } from '../services/errors/recurso-nao-encontrado.error.js'
import {
	atualizarLoteService,
	criarLoteService,
	encerrarLoteService,
	listarLotesService,
} from '../services/lote.service.js'

type GalpaoIdParams = { galpaoId: string }
type IdParams = { id: string }

export async function criarLoteController(
	request: FastifyRequest<{ Params: GalpaoIdParams; Body: CriarLoteDados }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const lote = await criarLoteService(
			request.body,
			request.params.galpaoId,
			usuarioId,
		)
		return reply.status(201).send(lote)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		if (erro instanceof LoteAtivoExistenteError) {
			return reply.status(409).send({ erro: erro.message })
		}
		if (erro instanceof DataInicioFuturaError) {
			return reply.status(400).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function listarLotesController(
	request: FastifyRequest<{ Params: GalpaoIdParams }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const lotes = await listarLotesService(request.params.galpaoId, usuarioId)
		return reply.send(lotes)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function atualizarLoteController(
	request: FastifyRequest<{ Params: IdParams; Body: AtualizarLoteDados }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const lote = await atualizarLoteService(
			request.params.id,
			request.body,
			usuarioId,
		)
		return reply.send(lote)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		if (erro instanceof DataInicioFuturaError) {
			return reply.status(400).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function encerrarLoteController(
	request: FastifyRequest<{ Params: IdParams }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const lote = await encerrarLoteService(request.params.id, usuarioId)
		return reply.send(lote)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
