import { buscarDispositivoPorId } from '../models/dispositivo.model.js'
import {
	buscarDispositivoParaValidacao,
	type CriarLeituraDados,
	contarLeiturasPorDispositivo,
	criarLeitura,
	listarLeiturasPorDispositivo,
} from '../models/leitura-sensor.model.js'
import { DispositivoNaoEncontradoError } from './errors/dispositivo-nao-encontrado.error.js'
import { RecursoNaoEncontradoError } from './errors/recurso-nao-encontrado.error.js'

export async function criarLeiturasService(leituras: CriarLeituraDados[]) {
	for (const leitura of leituras) {
		const dispositivo = await buscarDispositivoParaValidacao(
			leitura.dispositivosId,
		)
		if (dispositivo?.status !== 'ATIVO') {
			throw new DispositivoNaoEncontradoError()
		}
		await criarLeitura(leitura)
	}
	return { recebidas: leituras.length }
}

export async function listarLeiturasService(
	dispositivosId: string,
	usuarioId: string,
	pagina: number,
	porPagina: number,
) {
	const dispositivo = await buscarDispositivoPorId(dispositivosId)

	if (!dispositivo || dispositivo.galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const [leituras, total] = await Promise.all([
		listarLeiturasPorDispositivo(dispositivosId, pagina, porPagina),
		contarLeiturasPorDispositivo(dispositivosId),
	])

	return { leituras, total, pagina, porPagina }
}
