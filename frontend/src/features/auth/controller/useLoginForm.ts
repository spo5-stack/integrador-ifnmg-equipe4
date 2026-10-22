import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/controller/AuthContext"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

type LoginFormErrors = {
  email?: string
  senha?: string
  geral?: string
}

type LocationState = {
  from?: {
    pathname?: string
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateLogin(email: string, senha: string): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!email) {
    errors.email = "O preenchimento do e-mail é obrigatório."
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Por favor, insira um endereço de e-mail válido."
  }

  if (!senha) {
    errors.senha = "O preenchimento da senha é obrigatório."
  }

  return errors
}

export function useLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
    setErrors((current) => ({
      ...current,
      email: undefined,
      geral: undefined,
    }))
  }

  function handleSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setSenha(event.target.value)
    setErrors((current) => ({
      ...current,
      senha: undefined,
      geral: undefined,
    }))
  }

  function handleRememberChange(checked: boolean) {
    setRemember(checked)
  }

  function togglePassword() {
    setShowPassword((current) => !current)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const nextErrors = validateLogin(trimmedEmail, senha)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      await login({ email: trimmedEmail, senha }, remember)
      const state = location.state as LocationState | null
      navigate(state?.from?.pathname ?? "/", { replace: true })
    } catch (error) {
      const status = getApiErrorStatus(error)

      if (status === 401) {
        setErrors({ geral: "E-mail ou senha incorretos." })
      } else if (status === 400) {
        setErrors({ geral: "Verifique os dados informados." })
      } else {
        setErrors({
          geral: getApiErrorMessage(
            error,
            "Não foi possível entrar. Tente novamente."
          ),
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    email,
    senha,
    remember,
    showPassword,
    errors,
    isSubmitting,
    handleEmailChange,
    handleSenhaChange,
    handleRememberChange,
    handleSubmit,
    togglePassword,
  }
}
