import z from 'zod'
import { prisma } from '@/shared/database/prisma.js'

export const registerSchema = z
	.object({
		nome: z.string().min(1, 'Nome é obrigatório'),
		email: z.email('Email inválido'),
		senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
		confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
	})
	.refine((dados) => dados.senha === dados.confirmarSenha, {
		message: 'Senhas não conferem',
		path: ['confirmarSenha'],
	})
	.transform(({ confirmarSenha: _, ...dados }) => ({
		...dados,
		email: dados.email.toLowerCase(),
	}))

export const loginSchema = z.object({
	email: z.email('Email inválido'),
	senha: z.string().min(1, 'Senha é obrigatória'),
})

export type RegistrarDados = z.infer<typeof registerSchema>
export type LoginDados = z.infer<typeof loginSchema>
export type Usuario = { id: string; nome: string; email: string }

export async function criarUsuario(
	data: RegistrarDados & { senha: string },
): Promise<Usuario> {
	const usuario = await prisma.usuario.create({ data })
	return { id: usuario.id, nome: usuario.nome, email: usuario.email }
}

export async function buscarPorEmail(email: string) {
	return prisma.usuario.findUnique({ where: { email } })
}
