import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const criarLoteSchema = z.object({
	quantidade: z.number().int().positive('Quantidade deve ser positiva'),
	dataInicio: z.string().datetime('Data de início inválida'),
})

export const atualizarLoteSchema = z.object({
	quantidade: z
		.number()
		.int()
		.positive('Quantidade deve ser positiva')
		.optional(),
	dataInicio: z.string().datetime('Data de início inválida').optional(),
})

export type CriarLoteDados = z.infer<typeof criarLoteSchema>
export type AtualizarLoteDados = z.infer<typeof atualizarLoteSchema>

export async function criarLote(data: CriarLoteDados & { galpoesId: string }) {
	return prisma.lotes.create({
		data: {
			quantidade: data.quantidade,
			dataInicio: new Date(data.dataInicio),
			status: 'ATIVO',
			galpoesId: data.galpoesId,
		},
		select: {
			id: true,
			quantidade: true,
			dataInicio: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function listarLotes(galpaoId: string) {
	return prisma.lotes.findMany({
		where: { galpoesId: galpaoId },
		orderBy: { dataInicio: 'desc' },
		select: {
			id: true,
			quantidade: true,
			dataInicio: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function buscarLotePorId(id: string) {
	return prisma.lotes.findUnique({
		where: { id },
		include: {
			galpao: {
				select: { usuarioId: true },
			},
		},
	})
}

export async function atualizarLote(
	id: string,
	data: { quantidade?: number; dataInicio?: Date },
) {
	return prisma.lotes.update({
		where: { id },
		data,
		select: {
			id: true,
			quantidade: true,
			dataInicio: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function encerrarLote(id: string) {
	return prisma.lotes.update({
		where: { id },
		data: { status: 'DESATIVADO' },
		select: {
			id: true,
			quantidade: true,
			dataInicio: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function contarLotesAtivos(galpaoId: string) {
	return prisma.lotes.count({
		where: { galpoesId: galpaoId, status: 'ATIVO' },
	})
}
