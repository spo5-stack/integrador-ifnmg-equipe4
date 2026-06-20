import dayjs from 'dayjs'
import { buscarGalpaoPorId } from '../models/galpao.model.js'
import {
	type AtualizarLoteDados,
	atualizarLote,
	buscarLotePorId,
	type CriarLoteDados,
	contarLotesAtivos,
	criarLote,
	encerrarLote,
	listarLotes,
} from '../models/lote.model.js'
import { calcularFase } from '../shared/utils/fase.js'
import { DataInicioFuturaError } from './errors/data-inicio-futura.error.js'
import { LoteAtivoExistenteError } from './errors/lote-ativo-existente.error.js'
import { RecursoNaoEncontradoError } from './errors/recurso-nao-encontrado.error.js'

export async function criarLoteService(
	dados: CriarLoteDados,
	galpaoId: string,
	usuarioId: string,
) {
	const galpao = await buscarGalpaoPorId(galpaoId)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	if (dayjs(dados.dataInicio).isAfter(dayjs())) {
		throw new DataInicioFuturaError()
	}

	const ativos = await contarLotesAtivos(galpaoId)
	if (ativos > 0) {
		throw new LoteAtivoExistenteError()
	}

	return criarLote({ ...dados, galpoesId: galpaoId })
}

export async function listarLotesService(galpaoId: string, usuarioId: string) {
	const galpao = await buscarGalpaoPorId(galpaoId)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const lotes = await listarLotes(galpaoId)
	return lotes.map((lote) => ({
		...lote,
		fase: calcularFase(lote.dataInicio),
	}))
}

export async function atualizarLoteService(
	id: string,
	dados: AtualizarLoteDados,
	usuarioId: string,
) {
	const lote = await buscarLotePorId(id)

	if (!lote || lote.galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const dataParaSalvar: { quantidade?: number; dataInicio?: Date } = {}
	if (dados.quantidade !== undefined)
		dataParaSalvar.quantidade = dados.quantidade
	if (dados.dataInicio !== undefined) {
		if (dayjs(dados.dataInicio).isAfter(dayjs())) {
			throw new DataInicioFuturaError()
		}
		dataParaSalvar.dataInicio = new Date(dados.dataInicio)
	}

	return atualizarLote(id, dataParaSalvar)
}

export async function encerrarLoteService(id: string, usuarioId: string) {
	const lote = await buscarLotePorId(id)

	if (!lote || lote.galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	return encerrarLote(id)
}
