import {
	type AtualizarDispositivoDados,
	atualizarDispositivo,
	buscarDispositivoPorId,
	type CriarDispositivoDados,
	criarDispositivo,
	deletarDispositivo,
	listarDispositivosPorGalpao,
} from '../models/dispositivo.model.js'
import { buscarGalpaoPorId } from '../models/galpao.model.js'
import { RecursoNaoEncontradoError } from './errors/recurso-nao-encontrado.error.js'

export async function criarDispositivoService(
	dados: CriarDispositivoDados,
	galpaoId: string,
	usuarioId: string,
) {
	const galpao = await buscarGalpaoPorId(galpaoId)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	return criarDispositivo({ ...dados, galpoesId: galpaoId })
}

export async function listarDispositivosService(
	galpaoId: string,
	usuarioId: string,
) {
	const galpao = await buscarGalpaoPorId(galpaoId)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	return listarDispositivosPorGalpao(galpaoId)
}

export async function atualizarDispositivoService(
	id: string,
	dados: AtualizarDispositivoDados,
	usuarioId: string,
) {
	const dispositivo = await buscarDispositivoPorId(id)

	if (!dispositivo || dispositivo.galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	return atualizarDispositivo(id, dados)
}

export async function deletarDispositivoService(id: string, usuarioId: string) {
	const dispositivo = await buscarDispositivoPorId(id)

	if (!dispositivo || dispositivo.galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	await deletarDispositivo(id)
}
