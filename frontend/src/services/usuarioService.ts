import type { Usuario } from "@/interfaces/auth"
import type {
  AtualizarNomeDados,
  AtualizarSenhaDados,
} from "@/interfaces/usuario"
import { api } from "@/services/api"

export async function atualizarNome(
  dados: AtualizarNomeDados
): Promise<Usuario> {
  const { data } = await api.patch<Usuario>("/api/usuarios/nome", dados)
  return data
}

export async function atualizarSenha(
  dados: AtualizarSenhaDados
): Promise<Usuario> {
  const { data } = await api.patch<Usuario>("/api/usuarios/senha", dados)
  return data
}

export async function excluirConta(): Promise<void> {
  await api.delete("/api/usuarios")
}
