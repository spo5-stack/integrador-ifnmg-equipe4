import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { criarDispositivo } from "@/features/dispositivos/model/dispositivo.service"
import type { ErrosDispositivo } from "@/features/dispositivos/model/dispositivo.validation"
import { validarCriarDispositivo } from "@/features/dispositivos/model/dispositivo.validation"
import { listarGalpoesParaSelecao } from "@/services/galpaoService"
import type { GalpaoOpcao } from "@/interfaces/galpao"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

export function useCriarDispositivoForm(galpaoIdInicial?: string) {
  const [galpoes, setGalpoes] = useState<GalpaoOpcao[]>([])
  const [galpaoId, setGalpaoId] = useState(galpaoIdInicial ?? "")
  const [nome, setNome] = useState("")
  const [modelo, setModelo] = useState("")
  const [errors, setErrors] = useState<ErrosDispositivo>({})
  const [isLoadingGalpoes, setIsLoadingGalpoes] = useState(true)
  const [erroGalpoes, setErroGalpoes] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dispositivoCriadoId, setDispositivoCriadoId] = useState<string | null>(
    null
  )
  const [galpaoCriadoId, setGalpaoCriadoId] = useState<string>("")

  useEffect(() => {
    let ativo = true

    listarGalpoesParaSelecao(galpaoIdInicial)
      .then((lista) => {
        if (!ativo) return
        setGalpoes(lista)
        setErroGalpoes(null)
      })
      .catch((error: unknown) => {
        if (!ativo) return
        setGalpoes([])
        setErroGalpoes(
          getApiErrorMessage(
            error,
            "Não foi possível carregar os galpões. Tente novamente."
          )
        )
      })
      .finally(() => {
        if (ativo) setIsLoadingGalpoes(false)
      })

    return () => {
      ativo = false
    }
  }, [galpaoIdInicial, reloadToken])

  function onChangeGalpao(valor: string): void {
    setGalpaoId(valor)
    setErrors((atuais) => ({
      ...atuais,
      galpaoId: undefined,
      geral: undefined,
    }))
  }

  function onChangeNome(valor: string): void {
    setNome(valor)
    setErrors((atuais) => ({ ...atuais, nome: undefined, geral: undefined }))
  }

  function onChangeModelo(valor: string): void {
    setModelo(valor)
    setErrors((atuais) => ({ ...atuais, modelo: undefined, geral: undefined }))
  }

  function recarregarGalpoes(): void {
    setIsLoadingGalpoes(true)
    setErroGalpoes(null)
    setReloadToken((token) => token + 1)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (isSubmitting || isLoadingGalpoes) return

    const validacao = validarCriarDispositivo({ galpaoId, nome, modelo })
    if (!validacao.dados) {
      setErrors(validacao.erros)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const dispositivo = await criarDispositivo(galpaoId, validacao.dados)
      setIsSubmitting(false)
      setDispositivoCriadoId(dispositivo.id)
      setGalpaoCriadoId(dispositivo.galpoesId)
    } catch (error: unknown) {
      const status = getApiErrorStatus(error)
      let mensagem = getApiErrorMessage(
        error,
        "Não foi possível cadastrar o dispositivo. Tente novamente."
      )

      if (status === 404) {
        mensagem = getApiErrorMessage(
          error,
          "Galpão não encontrado para este dispositivo."
        )
      } else if (status === 400) {
        mensagem = getApiErrorMessage(
          error,
          "Dados inválidos. Verifique o nome e o modelo do dispositivo."
        )
      }

      setIsSubmitting(false)
      setErrors({ geral: mensagem })
    }
  }

  function fecharModal(): void {
    setDispositivoCriadoId(null)
  }

  return {
    galpoes,
    galpaoId,
    nome,
    modelo,
    errors,
    isLoadingGalpoes,
    erroGalpoes,
    isSubmitting,
    dispositivoCriadoId,
    galpaoCriadoId,
    onChangeGalpao,
    onChangeNome,
    onChangeModelo,
    recarregarGalpoes,
    onSubmit,
    fecharModal,
  }
}
