import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const solicitarRecuperacaoSchema = z.object({
	email: z.email('Email inválido').transform((email) => email.toLowerCase()),
})

export const verificarCodigoSchema = z.object({
	email: z.email('Email inválido').transform((email) => email.toLowerCase()),
	codigo: z.string().regex(/^\d{6}$/, 'Código deve ter 6 dígitos'),
})

export const redefinirSenhaSchema = z.object({
	resetToken: z.string().min(1, 'Token é obrigatório').max(200),
	senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type SolicitarRecuperacaoDados = z.infer<
	typeof solicitarRecuperacaoSchema
>
export type VerificarCodigoDados = z.infer<typeof verificarCodigoSchema>
export type RedefinirSenhaDados = z.infer<typeof redefinirSenhaSchema>

export async function invalidarCodigosAtivos(usuarioId: string) {
	return prisma.codigoRecuperacaoSenha.updateMany({
		where: { usuarioId, usadoEm: null },
		data: { usadoEm: new Date() },
	})
}

export async function criarCodigoRecuperacao(data: {
	usuarioId: string
	codigoHash: string
	expiraEm: Date
}) {
	return prisma.codigoRecuperacaoSenha.create({
		data,
		select: { id: true, usuarioId: true },
	})
}

export async function buscarCodigoAtivo(usuarioId: string) {
	return prisma.codigoRecuperacaoSenha.findFirst({
		where: {
			usuarioId,
			usadoEm: null,
			expiraEm: { gt: new Date() },
		},
		orderBy: { criadoEm: 'desc' },
	})
}

export async function incrementarTentativasCodigo(id: string) {
	const codigo = await prisma.codigoRecuperacaoSenha.update({
		where: { id },
		data: { tentativas: { increment: 1 } },
		select: { tentativas: true },
	})
	return codigo.tentativas
}

export async function marcarCodigoComoUsado(id: string) {
	return prisma.codigoRecuperacaoSenha.update({
		where: { id },
		data: { usadoEm: new Date() },
	})
}

export async function salvarResetToken(
	id: string,
	resetTokenHash: string,
	resetTokenExpiraEm: Date,
) {
	return prisma.codigoRecuperacaoSenha.update({
		where: { id },
		data: { resetTokenHash, resetTokenExpiraEm },
	})
}

export async function buscarCodigoPorResetToken(resetTokenHash: string) {
	return prisma.codigoRecuperacaoSenha.findFirst({
		where: {
			resetTokenHash,
			usadoEm: null,
			resetTokenExpiraEm: { gt: new Date() },
		},
		include: {
			usuario: {
				select: { id: true, nome: true, email: true },
			},
		},
	})
}

export async function redefinirSenhaComCodigo(data: {
	codigoId: string
	usuarioId: string
	senhaHash: string
}) {
	return prisma.$transaction(async (tx) => {
		await tx.codigoRecuperacaoSenha.update({
			where: { id: data.codigoId },
			data: { usadoEm: new Date() },
		})

		await tx.codigoRecuperacaoSenha.updateMany({
			where: { usuarioId: data.usuarioId, usadoEm: null },
			data: { usadoEm: new Date() },
		})

		return tx.usuario.update({
			where: { id: data.usuarioId },
			data: {
				senha: data.senhaHash,
				tokenVersion: { increment: 1 },
			},
			select: { id: true, nome: true, email: true },
		})
	})
}
