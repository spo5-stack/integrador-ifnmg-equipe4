import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const atualizarNomeSchema = z.object({
	nome: z.string().min(1, 'Nome é obrigatório'),
})

export const alterarSenhaSchema = z
	.object({
		senhaAntiga: z.string().min(1, 'Senha antiga é obrigatória'),
		senhaNova: z.string().min(6, 'Senha nova deve ter no mínimo 6 caracteres'),
	})
	.refine((dados) => dados.senhaNova !== dados.senhaAntiga, {
		message: 'Senha nova deve ser diferente da senha antiga',
		path: ['senhaNova'],
	})

export type AtualizarNome = z.infer<typeof atualizarNomeSchema>
export type AlterarSenha = z.infer<typeof alterarSenhaSchema>

export type Usuario = {
	id: string
	nome: string
	email: string
}

export async function buscarUsuarioPorId(id: string) {
	return prisma.usuario.findUnique({ where: { id } })
}

export async function atualizarUsuario(
	id: string,
	dados: { nome?: string; senha?: string },
) {
	const usuario = await prisma.usuario.update({
		where: { id },
		data: dados,
	})
	return { id: usuario.id, nome: usuario.nome, email: usuario.email }
}

export async function deletarUsuario(id: string) {
	await prisma.usuario.delete({ where: { id } })
}
