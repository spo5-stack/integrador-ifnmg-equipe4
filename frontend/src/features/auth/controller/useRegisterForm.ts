import { useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/features/auth/controller/AuthContext"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

type RegisterFormErrors = {
  nome?: string
  email?: string
  senha?: string
  confirmarSenha?: string
  geral?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type RegisterFields = {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

function validateRegister(fields: RegisterFields): RegisterFormErrors {
  const errors: RegisterFormErrors = {}

  if (!fields.nome) {
    errors.nome = "O preenchimento do nome é obrigatório."
  }

  if (!fields.email) {
    errors.email = "O preenchimento do e-mail é obrigatório."
  } else if (!EMAIL_PATTERN.test(fields.email)) {
    errors.email = "Por favor, insira um endereço de e-mail válido."
  }

  if (!fields.senha) {
    errors.senha = "O preenchimento da senha é obrigatório."
  } else if (fields.senha.length < 6) {
    errors.senha = "A senha deve ter no mínimo 6 caracteres."
  }

  if (!fields.confirmarSenha) {
    errors.confirmarSenha = "A confirmação da senha é obrigatória."
  } else if (fields.confirmarSenha !== fields.senha) {
    errors.confirmarSenha = "As senhas não coincidem."
    errors.senha = "As senhas não coincidem."
  }

  return errors
}

export function useRegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<RegisterFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleNomeChange(event: ChangeEvent<HTMLInputElement>) {
    setNome(event.target.value)
    setErrors((current) => ({
      ...current,
      nome: undefined,
      geral: undefined,
    }))
  }

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
      confirmarSenha: undefined,
      geral: undefined,
    }))
  }

  function handleConfirmarSenhaChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmarSenha(event.target.value)
    setErrors((current) => ({
      ...current,
      confirmarSenha: undefined,
      senha: undefined,
      geral: undefined,
    }))
  }

  function togglePassword() {
    setShowPassword((current) => !current)
  }

  function toggleConfirmPassword() {
    setShowConfirmPassword((current) => !current)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const fields: RegisterFields = {
      nome: nome.trim(),
      email: email.trim(),
      senha,
      confirmarSenha,
    }
    const nextErrors = validateRegister(fields)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)

    try {
      await register(fields)
      navigate("/", { replace: true })
    } catch (error) {
      const status = getApiErrorStatus(error)

      if (status === 409) {
        setErrors({ geral: "Este e-mail já está cadastrado." })
      } else if (status === 400) {
        setErrors({ geral: "Verifique os dados informados." })
      } else {
        setErrors({
          geral: getApiErrorMessage(
            error,
            "Não foi possível criar sua conta. Tente novamente."
          ),
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    nome,
    email,
    senha,
    confirmarSenha,
    showPassword,
    showConfirmPassword,
    errors,
    isSubmitting,
    handleNomeChange,
    handleEmailChange,
    handleSenhaChange,
    handleConfirmarSenhaChange,
    handleSubmit,
    togglePassword,
    toggleConfirmPassword,
  }
}
