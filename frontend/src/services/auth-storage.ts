import type { AuthSession } from "@/interfaces/auth"

const STORAGE_KEY = "granja.auth.session"

export const SESSION_STORAGE_KEY = STORAGE_KEY

type StorageKind = "local" | "session"

function getStorage(kind: StorageKind): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== "object" || value === null) return false

  const candidate = value as {
    token?: unknown
    usuario?: { id?: unknown; nome?: unknown; email?: unknown }
  }

  return (
    typeof candidate.token === "string" &&
    typeof candidate.usuario === "object" &&
    candidate.usuario !== null &&
    typeof candidate.usuario.id === "string" &&
    typeof candidate.usuario.nome === "string" &&
    typeof candidate.usuario.email === "string"
  )
}

function readSession(storage: Storage | null): AuthSession | null {
  if (!storage) return null

  try {
    const rawSession = storage.getItem(STORAGE_KEY)
    if (!rawSession) return null

    const parsedSession: unknown = JSON.parse(rawSession)
    return isAuthSession(parsedSession) ? parsedSession : null
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession, remember: boolean): void {
  const targetKind: StorageKind = remember ? "local" : "session"
  const otherKind: StorageKind = remember ? "session" : "local"
  const targetStorage = getStorage(targetKind)
  const otherStorage = getStorage(otherKind)

  if (!targetStorage) return

  try {
    targetStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    otherStorage?.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}

export function readStoredSession(): AuthSession | null {
  return readSession(getStorage("local")) ?? readSession(getStorage("session"))
}

export function getStoredToken(): string | null {
  return readStoredSession()?.token ?? null
}

export function clearStoredSession(): void {
  getStorage("local")?.removeItem(STORAGE_KEY)
  getStorage("session")?.removeItem(STORAGE_KEY)
}
