import type {
  AuthResponse,
  LoginDados,
  RegistrarDados,
} from "@/interfaces/auth"
import { api } from "@/services/api"

export async function login(dados: LoginDados): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", dados)
  return data
}

export async function register(dados: RegistrarDados): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", dados)
  return data
}
