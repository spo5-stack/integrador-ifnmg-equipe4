import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	AtualizarGalpaoDados,
	CriarGalpaoDados,
} from '../models/galpao.model.js'
import { CapacidadeComLoteAtivoError } from '../services/errors/capacidade-com-lote-ativo.error.js'
import { GalpaoPossuiVinculosError } from '../services/errors/galpao-possui-vinculos.error.js'
import { RecursoNaoEncontradoError } from '../services/errors/recurso-nao-encontrado.error.js'
import {
	atualizarGalpaoService,
	buscarGalpaoService,
	criarGalpaoService,
	deletarGalpaoService,
	listarGalpoesService,
} from '../services/galpao.service.js'

type GalpaoParams = { id: string }

export async function criarGalpaoController(
	request: FastifyRequest<{ Body: CriarGalpaoDados }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const galpao = await criarGalpaoService(request.body, usuarioId)
		return reply.status(201).send(galpao)
	} catch (erro) {
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

type ListarGalpoesQuery = { pagina?: string; porPagina?: string }

export async function listarGalpoesController(
	request: FastifyRequest<{ Querystring: ListarGalpoesQuery }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const { pagina, porPagina } = request.query
		const p = Math.max(1, Number(pagina) || 1)
		const pp = Math.min(100, Math.max(1, Number(porPagina) || 10))
		const resultado = await listarGalpoesService(usuarioId, p, pp)
		return reply.send(resultado)
	} catch (erro) {
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function buscarGalpaoController(
	request: FastifyRequest<{ Params: GalpaoParams }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const galpao = await buscarGalpaoService(request.params.id, usuarioId)
		return reply.send(galpao)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function atualizarGalpaoController(
	request: FastifyRequest<{ Params: GalpaoParams; Body: AtualizarGalpaoDados }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const galpao = await atualizarGalpaoService(
			request.params.id,
			request.body,
			usuarioId,
		)
		return reply.send(galpao)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		if (erro instanceof CapacidadeComLoteAtivoError) {
			return reply.status(409).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function deletarGalpaoController(
	request: FastifyRequest<{ Params: GalpaoParams }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		await deletarGalpaoService(request.params.id, usuarioId)
		return reply.status(204).send()
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		if (erro instanceof GalpaoPossuiVinculosError) {
			return reply.status(409).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
