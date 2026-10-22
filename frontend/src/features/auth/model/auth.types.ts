export type Usuario = {
  id: string
  nome: string
  email: string
}

export type LoginDados = {
  email: string
  senha: string
}

export type RegistrarDados = {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

export type AuthResponse = {
  usuario: Usuario
  token: string
}

export type AuthSession = AuthResponse
