import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type {
  AuthSession,
  LoginDados,
  RegistrarDados,
  Usuario,
} from "@/features/auth/model/auth.types"
import {
  login as loginRequest,
  register as registerRequest,
} from "@/features/auth/model/auth.service"
import {
  clearStoredSession,
  readStoredSession,
  saveSession,
} from "@/services/auth-storage"

type AuthContextValue = {
  usuario: Usuario | null
  isAuthenticated: boolean
  login: (dados: LoginDados, remember: boolean) => Promise<void>
  register: (dados: RegistrarDados) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    readStoredSession()
  )

  useEffect(() => {
    function handleUnauthorized() {
      setSession(null)
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized)
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized)
  }, [])

  async function login(dados: LoginDados, remember: boolean): Promise<void> {
    const response = await loginRequest(dados)
    saveSession(response, remember)
    setSession(response)
  }

  async function register(dados: RegistrarDados): Promise<void> {
    const response = await registerRequest(dados)
    saveSession(response, false)
    setSession(response)
  }

  function logout(): void {
    clearStoredSession()
    setSession(null)
  }

  const value: AuthContextValue = {
    usuario: session?.usuario ?? null,
    isAuthenticated: session !== null,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider")
  }

  return context
}
