import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const criarGalpaoSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório'),
	capacidade: z
		.number()
		.int()
		.positive('Capacidade deve ser um número positivo'),
})

export const atualizarGalpaoSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório').optional(),
	capacidade: z
		.number()
		.int()
		.positive('Capacidade deve ser um número positivo')
		.optional(),
})

export type CriarGalpaoDados = z.infer<typeof criarGalpaoSchema>
export type AtualizarGalpaoDados = z.infer<typeof atualizarGalpaoSchema>
export type GalpaoLista = {
	id: string
	nome: string
	capacidade: number
	criadoEm: Date
	atualizadoEm: Date
	_count: { lotes: number; dispositivos: number }
}
export type GalpaoDetalhe = {
	id: string
	nome: string
	capacidade: number
	criadoEm: Date
	atualizadoEm: Date
	lotes: Array<{
		id: string
		quantidade: number
		dataInicio: Date
		status: string
		fase: string
		criadoEm: Date
		atualizadoEm: Date
	}>
	dispositivos: Array<{
		id: string
		nome: string
		modelo: string
		status: string
		criadoEm: Date
		atualizadoEm: Date
		ultimaLeitura: { valor: number; criadoEm: Date } | null
	}>
}

export async function criarGalpao(
	data: CriarGalpaoDados & { usuarioId: string },
) {
	return prisma.galpoes.create({
		data: {
			nome: data.nome,
			capacidade: data.capacidade,
			usuarioId: data.usuarioId,
		},
		select: {
			id: true,
			nome: true,
			capacidade: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function listarGalpoes(
	usuarioId: string,
	pagina: number,
	porPagina: number,
) {
	const galpoes = await prisma.galpoes.findMany({
		where: { usuarioId },
		include: {
			_count: { select: { lotes: true, dispositivos: true } },
		},
		skip: (pagina - 1) * porPagina,
		take: porPagina,
		orderBy: { criadoEm: 'desc' },
	})
	return galpoes
}

export async function contarGalpoes(usuarioId: string) {
	return prisma.galpoes.count({ where: { usuarioId } })
}

export async function buscarGalpaoPorId(id: string) {
	return prisma.galpoes.findUnique({
		where: { id },
		include: {
			lotes: {
				orderBy: { dataInicio: 'desc' },
			},
			dispositivos: {
				include: {
					leituraSensors: {
						orderBy: { criadoEm: 'desc' },
						take: 1,
					},
				},
				orderBy: { criadoEm: 'asc' },
			},
		},
	})
}

export async function atualizarGalpao(id: string, data: AtualizarGalpaoDados) {
	return prisma.galpoes.update({
		where: { id },
		data,
		select: {
			id: true,
			nome: true,
			capacidade: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function deletarGalpao(id: string) {
	return prisma.galpoes.delete({ where: { id } })
}

export async function contarLotesAtivos(galpaoId: string) {
	return prisma.lotes.count({
		where: { galpoesId: galpaoId, status: 'ATIVO' },
	})
}

export async function contarVinculos(galpaoId: string) {
	const [lotes, dispositivos] = await Promise.all([
		prisma.lotes.count({ where: { galpoesId: galpaoId } }),
		prisma.dispositivos.count({ where: { galpoesId: galpaoId } }),
	])
	return { lotes, dispositivos }
}
