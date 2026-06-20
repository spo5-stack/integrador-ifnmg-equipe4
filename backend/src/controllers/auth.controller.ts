import type { FastifyReply, FastifyRequest } from 'fastify'
import type { LoginDados, RegistrarDados } from '../models/auth.model.js'
import { loginService, registerService } from '../services/auth.service.js'
import { CredenciaisInvalidasError } from '../services/errors/credenciais-invalidas.error.js'
import { EmailCadastradoError } from '../services/errors/email-cadastrado.error.js'

export async function cadastrarController(
	request: FastifyRequest<{ Body: RegistrarDados }>,
	reply: FastifyReply,
) {
	try {
		const dados = request.body
		const usuario = await registerService(dados)
		const token = await reply.jwtSign({ sub: usuario.id }, { expiresIn: '3h' })
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
		const usuario = await loginService(email, senha)
		const token = await reply.jwtSign({ sub: usuario.id }, { expiresIn: '3h' })
		return reply.send({ usuario, token })
	} catch (erro) {
		if (erro instanceof CredenciaisInvalidasError) {
			return reply.status(401).send({ erro: erro.message })
		}

		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
