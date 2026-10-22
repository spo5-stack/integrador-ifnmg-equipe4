import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  atualizarGalpao,
  obterGalpao,
} from "@/features/galpoes/model/galpao.service"
import type { ErrosFormularioGalpao } from "@/features/galpoes/model/galpao.validation"
import { validarGalpao } from "@/features/galpoes/model/galpao.validation"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

export function useEditarGalpaoForm(id: string | undefined) {
  const navigate = useNavigate()
  const [nome, setNome] = useState("")
  const [capacidade, setCapacidade] = useState("")
  const [errors, setErrors] = useState<ErrosFormularioGalpao>({})
  const [isLoading, setIsLoading] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!id) return

    let ativo = true

    obterGalpao(id)
      .then((galpao) => {
        if (!ativo) return

        setNome(galpao.nome)
        setCapacidade(String(galpao.capacidade))
      })
      .catch((error: unknown) => {
        if (!ativo) return

        const status = getApiErrorStatus(error)

        if (status === 404 || status === 400) {
          setNaoEncontrado(true)
          return
        }

        setErroCarregamento(
          getApiErrorMessage(
            error,
            "Não foi possível carregar o galpão. Tente novamente."
          )
        )
      })
      .finally(() => {
        if (ativo) setIsLoading(false)
      })

    return () => {
      ativo = false
    }
  }, [id, reloadToken])

  function recarregar(): void {
    setIsLoading(true)
    setNaoEncontrado(false)
    setErroCarregamento(null)
    setReloadToken((token) => token + 1)
  }

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
    if (isSubmitting || !id) return

    const validacao = validarGalpao({ nome, capacidade })
    if (!validacao.dados) {
      setErrors(validacao.erros)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await atualizarGalpao(id, validacao.dados)
      setIsSubmitting(false)
      navigate("/galpoes", {
        state: { sucesso: "Galpão atualizado com sucesso." },
      })
    } catch (error: unknown) {
      const status = getApiErrorStatus(error)

      setIsSubmitting(false)

      if (status === 404) {
        setNaoEncontrado(true)
        return
      }

      const fallback =
        status === 400
          ? "Dados inválidos. Verifique os campos e tente novamente."
          : "Não foi possível atualizar o galpão. Tente novamente."

      setErrors({ geral: getApiErrorMessage(error, fallback) })
    }
  }

  return {
    nome,
    capacidade,
    errors,
    isLoading: id ? isLoading : false,
    naoEncontrado: !id || naoEncontrado,
    erroCarregamento,
    isSubmitting,
    recarregar,
    onChangeNome,
    onChangeCapacidade,
    onSubmit,
  }
}
