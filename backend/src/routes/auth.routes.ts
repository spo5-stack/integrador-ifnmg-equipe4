import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
	cadastrarController,
	entrarController,
	redefinirSenhaController,
	solicitarRecuperacaoController,
	verificarCodigoController,
} from '../controllers/auth.controller.js'
import { loginSchema, registerSchema } from '../models/auth.model.js'
import {
	redefinirSenhaSchema,
	solicitarRecuperacaoSchema,
	verificarCodigoSchema,
} from '../models/recuperacao-senha.model.js'

const usuarioResponse = z.object({
	id: z.string(),
	nome: z.string(),
	email: z.string(),
})

const erroResponse = z.object({
	erro: z.string(),
})

const mensagemResponse = z.object({
	mensagem: z.string(),
})

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
	app.route({
		method: 'POST',
		url: '/auth/register',
		schema: {
			tags: ['auth'],
			summary: 'Cadastrar novo usuário',
			body: registerSchema,
			response: {
				201: z.object({
					usuario: usuarioResponse,
					token: z.string(),
				}),
			},
		},
		handler: cadastrarController,
	})

	app.route({
		method: 'POST',
		url: '/auth/login',
		schema: {
			tags: ['auth'],
			summary: 'Fazer login',
			body: loginSchema,
			response: {
				200: z.object({
					usuario: usuarioResponse,
					token: z.string(),
				}),
			},
		},
		handler: entrarController,
	})

	app.route({
		method: 'POST',
		url: '/auth/forgot-password',
		schema: {
			tags: ['auth'],
			summary: 'Solicitar código de recuperação de senha',
			description:
				'Responde de forma genérica para não revelar se o e-mail está cadastrado.',
			body: solicitarRecuperacaoSchema,
			response: {
				200: mensagemResponse,
				429: erroResponse,
			},
		},
		handler: solicitarRecuperacaoController,
	})

	app.route({
		method: 'POST',
		url: '/auth/verify-reset-code',
		schema: {
			tags: ['auth'],
			summary: 'Verificar código de recuperação',
			description:
				'Valida o código de 6 dígitos e devolve um token temporário de redefinição.',
			body: verificarCodigoSchema,
			response: {
				200: z.object({
					resetToken: z.string(),
					expiraEm: z.number().int(),
				}),
				401: erroResponse,
				429: erroResponse,
			},
		},
		handler: verificarCodigoController,
	})

	app.route({
		method: 'POST',
		url: '/auth/reset-password',
		schema: {
			tags: ['auth'],
			summary: 'Redefinir senha com token de recuperação',
			description:
				'Redefine a senha, invalida o código e encerra as sessões antigas. Não retorna token de sessão.',
			body: redefinirSenhaSchema,
			response: {
				200: mensagemResponse,
				401: erroResponse,
				429: erroResponse,
			},
		},
		handler: redefinirSenhaController,
	})
}
