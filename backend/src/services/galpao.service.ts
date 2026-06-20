import {
	type AtualizarGalpaoDados,
	atualizarGalpao,
	buscarGalpaoPorId,
	type CriarGalpaoDados,
	contarGalpoes,
	contarLotesAtivos,
	contarVinculos,
	criarGalpao,
	deletarGalpao,
	listarGalpoes,
} from '../models/galpao.model.js'
import { calcularFase } from '../shared/utils/fase.js'
import { CapacidadeComLoteAtivoError } from './errors/capacidade-com-lote-ativo.error.js'
import { GalpaoPossuiVinculosError } from './errors/galpao-possui-vinculos.error.js'
import { RecursoNaoEncontradoError } from './errors/recurso-nao-encontrado.error.js'

export async function criarGalpaoService(
	dados: CriarGalpaoDados,
	usuarioId: string,
) {
	return criarGalpao({ ...dados, usuarioId })
}

export async function listarGalpoesService(
	usuarioId: string,
	pagina: number,
	porPagina: number,
) {
	const [galpoes, total] = await Promise.all([
		listarGalpoes(usuarioId, pagina, porPagina),
		contarGalpoes(usuarioId),
	])
	return { galpoes, total, pagina, porPagina }
}

export async function buscarGalpaoService(id: string, usuarioId: string) {
	const galpao = await buscarGalpaoPorId(id)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const lotes = galpao.lotes.map((lote) => ({
		id: lote.id,
		quantidade: lote.quantidade,
		dataInicio: lote.dataInicio,
		status: lote.status,
		fase: calcularFase(lote.dataInicio),
		criadoEm: lote.criadoEm,
		atualizadoEm: lote.atualizadoEm,
	}))

	const dispositivos = galpao.dispositivos.map((d) => {
		const ultima = d.leituraSensors[0]
		return {
			id: d.id,
			nome: d.nome,
			modelo: d.modelo,
			status: d.status,
			criadoEm: d.criadoEm,
			atualizadoEm: d.atualizadoEm,
			ultimaLeitura: ultima
				? { valor: ultima.valorLuminosidade, criadoEm: ultima.criadoEm }
				: null,
		}
	})

	return {
		id: galpao.id,
		nome: galpao.nome,
		capacidade: galpao.capacidade,
		criadoEm: galpao.criadoEm,
		atualizadoEm: galpao.atualizadoEm,
		lotes,
		dispositivos,
	}
}

export async function atualizarGalpaoService(
	id: string,
	dados: AtualizarGalpaoDados,
	usuarioId: string,
) {
	const galpao = await buscarGalpaoPorId(id)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	if (dados.capacidade !== undefined) {
		const ativos = await contarLotesAtivos(id)
		if (ativos > 0) {
			throw new CapacidadeComLoteAtivoError()
		}
	}

	return atualizarGalpao(id, dados)
}

export async function deletarGalpaoService(id: string, usuarioId: string) {
	const galpao = await buscarGalpaoPorId(id)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const vinculos = await contarVinculos(id)
	if (vinculos.lotes > 0 || vinculos.dispositivos > 0) {
		throw new GalpaoPossuiVinculosError()
	}

	await deletarGalpao(id)
}
