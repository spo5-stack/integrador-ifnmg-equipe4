import { useEffect, useState } from "react"
import { obterGalpao } from "@/services/galpaoService"
import type { GalpaoDetalhe } from "@/interfaces/galpao"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"

export function useGalpaoDetalhe(id: string | undefined) {
  const [dados, setDados] = useState<GalpaoDetalhe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [naoEncontrado, setNaoEncontrado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!id) return

    let ativo = true

    obterGalpao(id)
      .then((galpao) => {
        if (ativo) setDados(galpao)
      })
      .catch((error: unknown) => {
        if (!ativo) return

        const status = getApiErrorStatus(error)

        if (status === 404 || status === 400) {
          setNaoEncontrado(true)
          return
        }

        setErro(
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
    setErro(null)
    setReloadToken((token) => token + 1)
  }

  return {
    dados,
    isLoading: id ? isLoading : false,
    naoEncontrado: !id || naoEncontrado,
    erro,
    recarregar,
  }
}
