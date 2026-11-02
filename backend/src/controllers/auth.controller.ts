import type { FastifyReply, FastifyRequest } from 'fastify'
import type { LoginDados, RegistrarDados } from '../models/auth.model.js'
import type {
	RedefinirSenhaDados,
	SolicitarRecuperacaoDados,
	VerificarCodigoDados,
} from '../models/recuperacao-senha.model.js'
import {
	loginService,
	redefinirSenhaService,
	registerService,
	solicitarRecuperacaoService,
	verificarCodigoService,
} from '../services/auth.service.js'
import { CodigoRecuperacaoInvalidoError } from '../services/errors/codigo-recuperacao-invalido.error.js'
import { CredenciaisInvalidasError } from '../services/errors/credenciais-invalidas.error.js'
import { EmailCadastradoError } from '../services/errors/email-cadastrado.error.js'
import { MuitasSolicitacoesError } from '../services/errors/muitas-solicitacoes.error.js'
import { TentativasRecuperacaoExcedidasError } from '../services/errors/tentativas-recuperacao-excedidas.error.js'
import { TokenRedefinicaoInvalidoError } from '../services/errors/token-redefinicao-invalido.error.js'

const MENSAGEM_RECUPERACAO =
	'Se o e-mail estiver cadastrado, enviaremos um código.'

export async function cadastrarController(
	request: FastifyRequest<{ Body: RegistrarDados }>,
	reply: FastifyReply,
) {
	try {
		const dados = request.body
		const { tokenVersion, ...usuario } = await registerService(dados)
		const token = await reply.jwtSign(
			{ sub: usuario.id, ver: tokenVersion },
			{ expiresIn: '3h' },
		)
		return reply.status(201).send({ usuario, token })
	} catch (erro) {
		if (erro instanceof EmailCadastradoError) {
			return reply.status(409).send({ erro: erro.message })
		}

		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function entrarController(
	request: FastifyRequest<{ Body: LoginDados }>,
	reply: FastifyReply,
) {
	try {
		const { email, senha } = request.body
		const { tokenVersion, ...usuario } = await loginService(email, senha)
		const token = await reply.jwtSign(
			{ sub: usuario.id, ver: tokenVersion },
			{ expiresIn: '3h' },
		)
		return reply.send({ usuario, token })
	} catch (erro) {
		if (erro instanceof CredenciaisInvalidasError) {
			return reply.status(401).send({ erro: erro.message })
		}

		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function solicitarRecuperacaoController(
	request: FastifyRequest<{ Body: SolicitarRecuperacaoDados }>,
	reply: FastifyReply,
) {
	try {
		await solicitarRecuperacaoService(request.body.email, request.ip)
		return reply.send({ mensagem: MENSAGEM_RECUPERACAO })
	} catch (erro) {
		if (erro instanceof MuitasSolicitacoesError) {
			return reply.status(429).send({ erro: erro.message })
		}

		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function verificarCodigoController(
	request: FastifyRequest<{ Body: VerificarCodigoDados }>,
	reply: FastifyReply,
) {
	try {
		const { email, codigo } = request.body
		const resultado = await verificarCodigoService(email, codigo, request.ip)
		return reply.send(resultado)
	} catch (erro) {
		if (erro instanceof TentativasRecuperacaoExcedidasError) {
			return reply.status(429).send({ erro: erro.message })
		}
		if (erro instanceof MuitasSolicitacoesError) {
			return reply.status(429).send({ erro: erro.message })
		}
		if (erro instanceof CodigoRecuperacaoInvalidoError) {
			return reply.status(401).send({ erro: erro.message })
		}

		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

export async function redefinirSenhaController(
	request: FastifyRequest<{ Body: RedefinirSenhaDados }>,
	reply: FastifyReply,
) {
	try {
		const { resetToken, senha } = request.body
		await redefinirSenhaService(resetToken, senha, request.ip)
		return reply.send({ mensagem: 'Senha redefinida com sucesso.' })
	} catch (erro) {
		if (erro instanceof MuitasSolicitacoesError) {
			return reply.status(429).send({ erro: erro.message })
		}
		if (erro instanceof TokenRedefinicaoInvalidoError) {
			return reply.status(401).send({ erro: erro.message })
		}

		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
