import { hash, verify } from 'argon2'
import {
	buscarPorEmail,
	criarUsuario,
	type RegistrarDados,
} from '../models/auth.model.js'
import { CredenciaisInvalidasError } from './errors/credenciais-invalidas.error.js'
import { EmailCadastradoError } from './errors/email-cadastrado.error.js'

export async function registerService(dados: RegistrarDados) {
	const existente = await buscarPorEmail(dados.email)

	if (existente) {
		throw new EmailCadastradoError()
	}

	const senhaHash = await hash(dados.senha)
	return criarUsuario({ ...dados, senha: senhaHash })
}

export async function loginService(email: string, senha: string) {
	const usuario = await buscarPorEmail(email.toLowerCase())

	if (!usuario) {
		throw new CredenciaisInvalidasError()
	}

	const valida = await verify(usuario.senha, senha)

	if (!valida) {
		throw new CredenciaisInvalidasError()
	}

	return { id: usuario.id, nome: usuario.nome, email: usuario.email }
}
