import { useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { criarGalpao } from "@/services/galpaoService"
import type { ErrosFormularioGalpao } from "@/features/galpoes/model/galpao.validation"
import { validarGalpao } from "@/features/galpoes/model/galpao.validation"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

export function useCriarGalpaoForm() {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [capacidade, setCapacidade] = useState("")
  const [errors, setErrors] = useState<ErrosFormularioGalpao>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function onChangeNome(valor: string): void {
    setNome(valor)
    setErrors((atuais) => ({ ...atuais, nome: undefined, geral: undefined }))
  }

  function onChangeCapacidade(valor: string): void {
    setCapacidade(valor)
    setErrors((atuais) => ({
      ...atuais,
      capacidade: undefined,
      geral: undefined,
    }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (isSubmitting) return

    const validacao = validarGalpao({ nome, capacidade })
    if (!validacao.dados) {
      setErrors(validacao.erros)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await criarGalpao(validacao.dados)
      setIsSubmitting(false)
      navigate("/galpoes", {
        state: { sucesso: "Galpão cadastrado com sucesso." },
      })
    } catch (error: unknown) {
      const status = getApiErrorStatus(error)
      const mensagem =
        status === 400
          ? getApiErrorMessage(
              error,
              "Dados inválidos. Verifique os campos e tente novamente."
            )
          : getApiErrorMessage(
              error,
              "Não foi possível cadastrar o galpão. Tente novamente."
            )

      setIsSubmitting(false)
      setErrors({ geral: mensagem })
    }
  }

  return {
    nome,
    capacidade,
    errors,
    isSubmitting,
    onChangeNome,
    onChangeCapacidade,
    onSubmit,
  }
}
