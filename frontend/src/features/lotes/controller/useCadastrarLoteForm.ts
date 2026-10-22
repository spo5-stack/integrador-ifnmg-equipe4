import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { listarGalpoesParaSelecao, obterGalpao } from "@/services/galpaoService"
import type { GalpaoOpcao } from "@/interfaces/galpao"
import { criarLote } from "@/features/lotes/model/lote.service"
import type { ErrosLote } from "@/features/lotes/model/lote.validation"
import { validarLote } from "@/features/lotes/model/lote.validation"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

export function useCadastrarLoteForm(galpaoIdInicial?: string) {
  const navigate = useNavigate()
  const [galpoes, setGalpoes] = useState<GalpaoOpcao[]>([])
  const [galpaoId, setGalpaoId] = useState(galpaoIdInicial ?? "")
  const [quantidade, setQuantidade] = useState("")
  const [dataInicio, setDataInicio] = useState("")
  const [errors, setErrors] = useState<ErrosLote>({})
  const [isLoadingGalpoes, setIsLoadingGalpoes] = useState(true)
  const [erroGalpoes, setErroGalpoes] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let ativo = true

    listarGalpoesParaSelecao(galpaoIdInicial)
      .then((lista) => {
        if (!ativo) return
        setGalpoes(lista)
        setErroGalpoes(null)
      })
      .catch(async (error: unknown) => {
        if (!ativo) return

        const status = getApiErrorStatus(error)

        if (galpaoIdInicial && status !== 404) {
          try {
            const galpao = await obterGalpao(galpaoIdInicial)
            if (!ativo) return
            setGalpoes([
              {
                id: galpao.id,
                nome: galpao.nome,
                capacidade: galpao.capacidade,
              },
            ])
            setErroGalpoes(null)
            return
          } catch {
            // Mantém a mensagem de erro original abaixo.
          }
        }

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

  const capacidadeGalpao =
    galpoes.find((galpao) => galpao.id === galpaoId)?.capacidade ?? null

  function onChangeGalpao(valor: string): void {
    setGalpaoId(valor)
    setErrors((atuais) => ({
      ...atuais,
      galpaoId: undefined,
      quantidade: undefined,
      geral: undefined,
    }))
  }

  function onChangeQuantidade(valor: string): void {
    setQuantidade(valor)
    setErrors((atuais) => ({
      ...atuais,
      quantidade: undefined,
      geral: undefined,
    }))
  }

  function onChangeDataInicio(valor: string): void {
    setDataInicio(valor)
    setErrors((atuais) => ({
      ...atuais,
      dataInicio: undefined,
      geral: undefined,
    }))
  }

  function recarregarGalpoes(): void {
    setIsLoadingGalpoes(true)
    setErroGalpoes(null)
    setReloadToken((token) => token + 1)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (isSubmitting || isLoadingGalpoes) return

    const validacao = validarLote({
      galpaoId,
      quantidade,
      dataInicio,
      capacidade: capacidadeGalpao,
    })
    if (!validacao.dados) {
      setErrors(validacao.erros)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await criarLote(galpaoId, validacao.dados)
      setIsSubmitting(false)
      navigate(`/galpoes/${encodeURIComponent(galpaoId)}`, {
        state: { sucesso: "Lote cadastrado com sucesso." },
      })
    } catch (error: unknown) {
      const status = getApiErrorStatus(error)
      let mensagem = getApiErrorMessage(
        error,
        "Não foi possível cadastrar o lote. Tente novamente."
      )

      if (status === 404) {
        mensagem =
          "Galpão não encontrado. Verifique se ele ainda está disponível."
      } else if (status === 409) {
        mensagem = getApiErrorMessage(
          error,
          "Já existe um lote ativo para este galpão."
        )
      } else if (status === 400) {
        mensagem = getApiErrorMessage(
          error,
          "Dados inválidos. Verifique a quantidade e a data de início."
        )
      }

      setIsSubmitting(false)
      setErrors({ geral: mensagem })
    }
  }

  return {
    galpoes,
    galpaoId,
    quantidade,
    dataInicio,
    errors,
    capacidadeGalpao,
    isLoadingGalpoes,
    erroGalpoes,
    isSubmitting,
    onChangeGalpao,
    onChangeQuantidade,
    onChangeDataInicio,
    recarregarGalpoes,
    onSubmit,
  }
}
