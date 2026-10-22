import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import {
  editarDispositivo,
  listarDispositivosDoGalpao,
} from "@/features/dispositivos/model/dispositivo.service"
import type {
  Dispositivo,
  StatusRegistro,
} from "@/features/dispositivos/model/dispositivo.types"
import type { ErrosDispositivo } from "@/features/dispositivos/model/dispositivo.validation"
import { validarEditarDispositivo } from "@/features/dispositivos/model/dispositivo.validation"
import { listarGalpoesParaSelecao } from "@/services/galpaoService"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

type EstadoInicialEdicao = {
  dispositivo?: Dispositivo
  galpoesId?: string
  galpaoNome?: string
}

export function useEditarDispositivoForm(
  dispositivoId: string | undefined,
  estadoInicial?: EstadoInicialEdicao
) {
  const navigate = useNavigate()
  const dispositivoInicial = estadoInicial?.dispositivo

  const [nome, setNome] = useState(dispositivoInicial?.nome ?? "")
  const [modelo, setModelo] = useState(dispositivoInicial?.modelo ?? "")
  const [status, setStatus] = useState<StatusRegistro>(
    dispositivoInicial?.status ?? "ATIVO"
  )
  const [galpaoId, setGalpaoId] = useState(
    dispositivoInicial?.galpoesId ?? estadoInicial?.galpoesId ?? ""
  )
  const [galpaoNome, setGalpaoNome] = useState(estadoInicial?.galpaoNome ?? "")
  const [errors, setErrors] = useState<ErrosDispositivo>({})
  const [isLoading, setIsLoading] = useState(
    Boolean(dispositivoId) && !dispositivoInicial
  )
  const [naoEncontrado, setNaoEncontrado] = useState(!dispositivoId)
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!dispositivoId || dispositivoInicial) return

    let ativo = true
    const controller = new AbortController()

    listarGalpoesParaSelecao()
      .then(async (galpoes) => {
        for (const galpao of galpoes) {
          if (!ativo || controller.signal.aborted) return

          let dispositivos: Dispositivo[]

          try {
            dispositivos = await listarDispositivosDoGalpao(
              galpao.id,
              controller.signal
            )
          } catch {
            if (!ativo || controller.signal.aborted) return
            continue
          }

          const encontrado = dispositivos.find(
            (dispositivo) => dispositivo.id === dispositivoId
          )

          if (!encontrado) continue
          if (!ativo) return

          setNome(encontrado.nome)
          setModelo(encontrado.modelo)
          setStatus(encontrado.status)
          setGalpaoId(encontrado.galpoesId)
          setGalpaoNome(galpao.nome)
          setNaoEncontrado(false)
          setErroCarregamento(null)
          setIsLoading(false)
          return
        }

        if (!ativo) return
        setNaoEncontrado(true)
        setIsLoading(false)
      })
      .catch((error: unknown) => {
        if (!ativo || controller.signal.aborted) return
        setErroCarregamento(
          getApiErrorMessage(
            error,
            "Não foi possível carregar o dispositivo. Tente novamente."
          )
        )
        setIsLoading(false)
      })

    return () => {
      ativo = false
      controller.abort()
    }
  }, [dispositivoId, dispositivoInicial, reloadToken])

  function onChangeNome(valor: string): void {
    setNome(valor)
    setErrors((atuais) => ({ ...atuais, nome: undefined, geral: undefined }))
  }

  function onChangeModelo(valor: string): void {
    setModelo(valor)
    setErrors((atuais) => ({ ...atuais, modelo: undefined, geral: undefined }))
  }

  function onChangeStatus(valor: string): void {
    setStatus(valor as StatusRegistro)
    setErrors((atuais) => ({ ...atuais, status: undefined, geral: undefined }))
  }

  function recarregar(): void {
    setIsLoading(true)
    setNaoEncontrado(false)
    setErroCarregamento(null)
    setReloadToken((token) => token + 1)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (isSubmitting || !dispositivoId) return

    const validacao = validarEditarDispositivo({
      galpaoId,
      nome,
      modelo,
      status,
    })
    if (!validacao.dados) {
      setErrors(validacao.erros)
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      await editarDispositivo(dispositivoId, validacao.dados)
      setIsSubmitting(false)

      if (galpaoId) {
        navigate(`/galpoes/${encodeURIComponent(galpaoId)}`, {
          state: { sucesso: "Dispositivo atualizado com sucesso." },
        })
      } else {
        navigate("/galpoes", {
          state: { sucesso: "Dispositivo atualizado com sucesso." },
        })
      }
    } catch (error: unknown) {
      const statusErro = getApiErrorStatus(error)

      if (statusErro === 404) {
        setIsSubmitting(false)
        setNaoEncontrado(true)
        return
      }

      const fallback =
        statusErro === 400
          ? "Dados inválidos. Verifique os campos e tente novamente."
          : "Não foi possível atualizar o dispositivo. Tente novamente."

      setIsSubmitting(false)
      setErrors({ geral: getApiErrorMessage(error, fallback) })
    }
  }

  return {
    galpaoId,
    galpaoNome,
    nome,
    modelo,
    status,
    errors,
    isLoading: dispositivoId ? isLoading : false,
    naoEncontrado: !dispositivoId || naoEncontrado,
    erroCarregamento,
    isSubmitting,
    recarregar,
    onChangeNome,
    onChangeModelo,
    onChangeStatus,
    onSubmit,
  }
}
