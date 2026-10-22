import { api } from "@/services/api"
import type {
  AuthResponse,
  LoginDados,
  RegistrarDados,
} from "@/features/auth/model/auth.types"

export async function login(dados: LoginDados): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", dados)
  return data
}

export async function register(dados: RegistrarDados): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", dados)
  return data
}
