import { hash, verify } from 'argon2'
import {
	type AtualizarNome,
	atualizarUsuario,
	buscarUsuarioPorId,
	deletarUsuario,
} from '../models/usuario.model.js'
import { RecursoNaoEncontradoError } from './errors/recurso-nao-encontrado.error.js'
import { SenhaAntigaInvalidaError } from './errors/senha-antiga-invalida.error.js'

export async function atualizarNomeService(id: string, dados: AtualizarNome) {
	const usuario = await buscarUsuarioPorId(id)

	if (!usuario) {
		throw new RecursoNaoEncontradoError()
	}

	return atualizarUsuario(id, { nome: dados.nome })
}

export async function alterarSenhaService(
	id: string,
	dados: { senhaAntiga: string; senhaNova: string },
) {
	const usuario = await buscarUsuarioPorId(id)

	if (!usuario) {
		throw new RecursoNaoEncontradoError()
	}

	const valida = await verify(usuario.senha, dados.senhaAntiga)
	if (!valida) {
		throw new SenhaAntigaInvalidaError()
	}

	const senhaHash = await hash(dados.senhaNova)
	return atualizarUsuario(id, { senha: senhaHash })
}

export async function deletarUsuarioService(id: string) {
	const usuario = await buscarUsuarioPorId(id)

	if (!usuario) {
		throw new RecursoNaoEncontradoError()
	}

	await deletarUsuario(id)
}
