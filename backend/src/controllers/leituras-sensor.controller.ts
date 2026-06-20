import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CriarLeituraDados } from '../models/leitura-sensor.model.js'
import { DispositivoNaoEncontradoError } from '../services/errors/dispositivo-nao-encontrado.error.js'
import { RecursoNaoEncontradoError } from '../services/errors/recurso-nao-encontrado.error.js'
import {
	criarLeiturasService,
	listarLeiturasService,
} from '../services/leitura-sensor.service.js'

export async function criarLeiturasController(
	request: FastifyRequest<{ Body: CriarLeituraDados[] }>,
	reply: FastifyReply,
) {
	try {
		const resultado = await criarLeiturasService(request.body)
		return reply.status(201).send(resultado)
	} catch (erro) {
		if (erro instanceof DispositivoNaoEncontradoError) {
			return reply.status(422).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}

type DispositivoIdParams = { dispositivosId: string }
type ListarLeiturasQuery = { pagina?: string; porPagina?: string }

export async function listarLeiturasController(
	request: FastifyRequest<{
		Params: DispositivoIdParams
		Querystring: ListarLeiturasQuery
	}>,
	reply: FastifyReply,
) {
	try {
		const usuarioId = request.user.sub
		const { pagina, porPagina } = request.query
		const p = Math.max(1, Number(pagina) || 1)
		const pp = Math.min(100, Math.max(1, Number(porPagina) || 10))

		const resultado = await listarLeiturasService(
			request.params.dispositivosId,
			usuarioId,
			p,
			pp,
		)
		return reply.send(resultado)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
