import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { LoteDoGalpao } from "@/interfaces/galpao"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { encerrarLote } from "@/services/loteService"

export function useEncerrarLote(galpaoId: string | undefined) {
  const queryClient = useQueryClient()
  const [loteParaEncerrar, setLoteParaEncerrar] = useState<LoteDoGalpao | null>(
    null
  )
  const [erroEncerramento, setErroEncerramento] = useState<string | null>(null)
  const [sucessoEncerramento, setSucessoEncerramento] = useState<string | null>(
    null
  )

  const mutation = useMutation({
    mutationFn: (id: string) => encerrarLote(id),
    onSuccess: async () => {
      setLoteParaEncerrar(null)
      setErroEncerramento(null)
      setSucessoEncerramento("Lote encerrado com sucesso.")

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["galpao", galpaoId] }),
        queryClient.invalidateQueries({
          queryKey: ["galpao", galpaoId, "status"],
        }),
        queryClient.invalidateQueries({ queryKey: ["galpoes"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      ])
    },
    onError: (error) => {
      const status = getApiErrorStatus(error)

      if (status === 404) {
        setErroEncerramento("Lote não encontrado. A lista será atualizada.")
        void queryClient.invalidateQueries({ queryKey: ["galpao", galpaoId] })
      } else {
        setErroEncerramento(
          getApiErrorMessage(error, "Não foi possível encerrar o lote.")
        )
      }

      setLoteParaEncerrar(null)
    },
  })

  function solicitarEncerramento(lote: LoteDoGalpao): void {
    setErroEncerramento(null)
    setSucessoEncerramento(null)
    setLoteParaEncerrar(lote)
  }

  function cancelarEncerramento(): void {
    if (!mutation.isPending) setLoteParaEncerrar(null)
  }

  function confirmarEncerramento(): void {
    if (!loteParaEncerrar || mutation.isPending) return
    mutation.mutate(loteParaEncerrar.id)
  }

  function limparSucesso(): void {
    setSucessoEncerramento(null)
  }

  return {
    loteParaEncerrar,
    loteEmEncerramentoId: mutation.isPending ? mutation.variables : undefined,
    isEncerrando: mutation.isPending,
    erroEncerramento,
    sucessoEncerramento,
    solicitarEncerramento,
    cancelarEncerramento,
    confirmarEncerramento,
    limparSucesso,
  }
}
