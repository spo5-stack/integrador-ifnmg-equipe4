import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const criarLeituraSchema = z.object({
	luminosidade: z.number().int().min(0).max(100),
	dispositivosId: z.uuid('Dispositivo inválido'),
})

export type CriarLeituraDados = z.infer<typeof criarLeituraSchema>

export async function criarLeitura(data: CriarLeituraDados) {
	return prisma.leituraSensor.create({
		data: {
			valorLuminosidade: data.luminosidade,
			dispositivosId: data.dispositivosId,
		},
		select: {
			id: true,
			valorLuminosidade: true,
			dispositivosId: true,
			criadoEm: true,
		},
	})
}

export async function buscarDispositivoParaValidacao(id: string) {
	return prisma.dispositivos.findUnique({
		where: { id },
		select: { id: true, status: true },
	})
}

export async function listarLeiturasPorDispositivo(
	dispositivosId: string,
	pagina: number,
	porPagina: number,
) {
	return prisma.leituraSensor.findMany({
		where: { dispositivosId },
		orderBy: { criadoEm: 'desc' },
		skip: (pagina - 1) * porPagina,
		take: porPagina,
		select: {
			id: true,
			valorLuminosidade: true,
			criadoEm: true,
		},
	})
}

export async function contarLeiturasPorDispositivo(dispositivosId: string) {
	return prisma.leituraSensor.count({ where: { dispositivosId } })
}
