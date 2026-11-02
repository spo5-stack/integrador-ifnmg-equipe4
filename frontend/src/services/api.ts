import axios, { type AxiosError } from "axios"
import { clearStoredSession, getStoredToken } from "@/services/auth-storage"

type ApiErrorBody = {
  erro?: string
  message?: string
}

const AUTH_ROUTES = ["/api/auth/login", "/api/auth/register"]

function isAuthRoute(url: string | undefined): boolean {
  return AUTH_ROUTES.some((route) => url?.includes(route))
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && !isAuthRoute(error.config?.url)) {
      clearStoredSession()
      window.dispatchEvent(new Event("auth:unauthorized"))
    }

    return Promise.reject(error)
  }
)

export function getApiErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return fallback
  if (!error.response) return "Não foi possível conectar ao servidor."

  const apiMessage = error.response.data?.erro ?? error.response.data?.message
  return typeof apiMessage === "string" && apiMessage.trim()
    ? apiMessage
    : fallback
}
