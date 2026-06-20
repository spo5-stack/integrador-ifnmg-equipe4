import type { FastifyReply, FastifyRequest } from 'fastify'
import type { AlterarSenha, AtualizarNome } from '../models/usuario.model.js'
import { RecursoNaoEncontradoError } from '../services/errors/recurso-nao-encontrado.error.js'
import { SenhaAntigaInvalidaError } from '../services/errors/senha-antiga-invalida.error.js'
import {
	alterarSenhaService,
	atualizarNomeService,
	deletarUsuarioService,
} from '../services/usuario.service.js'

export async function atualizarNomeController(
	request: FastifyRequest<{ Body: AtualizarNome }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const usuario = await atualizarNomeService(usuarioId, request.body)
		return reply.send(usuario)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function alterarSenhaController(
	request: FastifyRequest<{ Body: AlterarSenha }>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const usuario = await alterarSenhaService(usuarioId, request.body)
		return reply.send(usuario)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		if (erro instanceof SenhaAntigaInvalidaError) {
			return reply.status(401).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function deletarUsuarioController(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		await deletarUsuarioService(usuarioId)
		return reply.status(204).send()
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
