import {
	buscarGalpaoPorId,
	contarGalpoes,
	listarGalpoes,
} from '../models/galpao.model.js'
import { calcularFase } from '../shared/utils/fase.js'
import { RecursoNaoEncontradoError } from './errors/recurso-nao-encontrado.error.js'

type LoteComFase = {
	id: string
	quantidade: number
	dataInicio: Date
	status: string
	fase: string
}

type DispositivoStatus = {
	id: string
	nome: string
	ultimaLeitura: { valor: number; criadoEm: Date } | null
	statusLuminosidade: string
}

type GalpaoStatus = {
	galpaoId: string
	galpaoNome: string
	loteAtivo: LoteComFase | null
	dispositivos: DispositivoStatus[]
}

function calcularStatusLuminosidade(valor: number, fase: string): string {
	const faixas: Record<string, { min: number; max: number }> = {
		INICIAL: { min: 70, max: 100 },
		CRESCIMENTO: { min: 50, max: 70 },
		PRODUCAO: { min: 30, max: 50 },
	}

	const faixa = faixas[fase]
	if (!faixa) return 'DESCONHECIDO'
	if (valor < faixa.min) return 'ABAIXO'
	if (valor > faixa.max) return 'ACIMA'
	return 'ADEQUADO'
}

export async function buscarStatusGalpaoService(
	id: string,
	usuarioId: string,
): Promise<GalpaoStatus> {
	const galpao = await buscarGalpaoPorId(id)

	if (!galpao || galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const loteAtivo = galpao.lotes.find((l) => l.status === 'ATIVO') ?? null

	const loteComFase: LoteComFase | null = loteAtivo
		? {
				id: loteAtivo.id,
				quantidade: loteAtivo.quantidade,
				dataInicio: loteAtivo.dataInicio,
				status: loteAtivo.status,
				fase: calcularFase(loteAtivo.dataInicio),
			}
		: null

	const dispositivos: DispositivoStatus[] = galpao.dispositivos.map((d) => {
		const ultima = d.leituraSensors[0]
		const leitura = ultima
			? { valor: ultima.valorLuminosidade, criadoEm: ultima.criadoEm }
			: null

		const statusLuminosidade =
			leitura && loteComFase
				? calcularStatusLuminosidade(leitura.valor, loteComFase.fase)
				: 'SEM_LEITURA'

		return {
			id: d.id,
			nome: d.nome,
			ultimaLeitura: leitura,
			statusLuminosidade,
		}
	})

	return {
		galpaoId: galpao.id,
		galpaoNome: galpao.nome,
		loteAtivo: loteComFase,
		dispositivos,
	}
}

export async function buscarDashboardService(usuarioId: string) {
	const galpoes = await listarGalpoes(usuarioId, 1, 100)
	const total = await contarGalpoes(usuarioId)

	const galpoesStatus = await Promise.all(
		galpoes.map((g) => buscarStatusGalpaoService(g.id, usuarioId)),
	)

	const totais = galpoesStatus.reduce(
		(acc, g) => {
			acc.totalDispositivos += g.dispositivos.length
			if (g.loteAtivo) acc.totalLotesAtivos++
			const adequados = g.dispositivos.filter(
				(d) => d.statusLuminosidade === 'ADEQUADO',
			).length
			acc.totalAdequados += adequados
			return acc
		},
		{ totalLotesAtivos: 0, totalDispositivos: 0, totalAdequados: 0 },
	)

	return {
		totalGalpoes: total,
		...totais,
		galpoes: galpoesStatus,
	}
}
