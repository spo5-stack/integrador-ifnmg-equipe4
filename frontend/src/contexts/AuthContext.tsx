import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { AuthSession, Usuario } from "@/interfaces/auth"
import {
  SESSION_STORAGE_KEY,
  clearStoredSession,
  readStoredSession,
  saveSession,
} from "@/services/auth-storage"

type AuthContextValue = {
  usuario: Usuario | null
  isAuthenticated: boolean
  signIn: (session: AuthSession, remember: boolean) => void
  updateUsuario: (usuario: Usuario) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

type AuthProviderProps = {
  children: ReactNode
}

/** Indica se a sessão está persistida em `localStorage`. */
function isPersistedInLocalStorage(): boolean {
  try {
    return window.localStorage.getItem(SESSION_STORAGE_KEY) !== null
  } catch {
    return false
  }
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

  function signIn(nextSession: AuthSession, remember: boolean): void {
    saveSession(nextSession, remember)
    setSession(nextSession)
  }

  function updateUsuario(usuario: Usuario): void {
    setSession((currentSession) => {
      if (!currentSession) return currentSession

      const nextSession: AuthSession = { ...currentSession, usuario }
      saveSession(nextSession, isPersistedInLocalStorage())

      return nextSession
    })
  }

  function logout(): void {
    clearStoredSession()
    setSession(null)
  }

  const value: AuthContextValue = {
    usuario: session?.usuario ?? null,
    isAuthenticated: session !== null,
    signIn,
    updateUsuario,
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
