import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const criarDispositivoSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório'),
	modelo: z.string().min(1, 'Modelo é obrigatório'),
})

export const atualizarDispositivoSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório').optional(),
	modelo: z.string().min(1, 'Modelo é obrigatório').optional(),
	status: z.enum(['ATIVO', 'DESATIVADO']).optional(),
})

export type CriarDispositivoDados = z.infer<typeof criarDispositivoSchema>
export type AtualizarDispositivoDados = z.infer<
	typeof atualizarDispositivoSchema
>

export async function criarDispositivo(
	data: CriarDispositivoDados & { galpoesId: string },
) {
	return prisma.dispositivos.create({
		data: {
			nome: data.nome,
			modelo: data.modelo,
			galpoesId: data.galpoesId,
		},
		select: {
			id: true,
			nome: true,
			modelo: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function listarDispositivosPorGalpao(galpaoId: string) {
	return prisma.dispositivos.findMany({
		where: { galpoesId: galpaoId },
		select: {
			id: true,
			nome: true,
			modelo: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
		orderBy: { criadoEm: 'asc' },
	})
}

export async function buscarDispositivoPorId(id: string) {
	return prisma.dispositivos.findUnique({
		where: { id },
		include: {
			galpao: {
				select: { usuarioId: true },
			},
		},
	})
}

export async function atualizarDispositivo(
	id: string,
	data: AtualizarDispositivoDados,
) {
	return prisma.dispositivos.update({
		where: { id },
		data,
		select: {
			id: true,
			nome: true,
			modelo: true,
			status: true,
			galpoesId: true,
			criadoEm: true,
			atualizadoEm: true,
		},
	})
}

export async function deletarDispositivo(id: string) {
	return prisma.dispositivos.delete({ where: { id } })
}
