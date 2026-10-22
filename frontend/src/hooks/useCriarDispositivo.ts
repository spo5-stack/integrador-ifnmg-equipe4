import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { CriarDispositivoFormValues } from "@/components/dispositivos/dispositivoSchema"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { criarDispositivo } from "@/services/dispositivoService"
import { listarGalpoesParaSelecao } from "@/services/galpaoService"

export function useCriarDispositivo(galpaoIdInicial?: string) {
  const queryClient = useQueryClient()
  const [dispositivoCriadoId, setDispositivoCriadoId] = useState<string | null>(
    null
  )
  const [galpaoCriadoId, setGalpaoCriadoId] = useState("")

  const galpoesQuery = useQuery({
    queryKey: ["galpoes", "selecao", galpaoIdInicial ?? null],
    queryFn: () => listarGalpoesParaSelecao(galpaoIdInicial),
  })

  const erroGalpoes = galpoesQuery.isError
    ? getApiErrorMessage(
        galpoesQuery.error,
        "Não foi possível carregar os galpões. Tente novamente."
      )
    : null

  const mutation = useMutation({
    mutationFn: (dados: CriarDispositivoFormValues) =>
      criarDispositivo(dados.galpaoId, {
        nome: dados.nome,
        modelo: dados.modelo,
      }),
    onSuccess: (dispositivo) => {
      void queryClient.invalidateQueries({
        queryKey: ["galpao", dispositivo.galpoesId],
      })
      void queryClient.invalidateQueries({ queryKey: ["galpoes"] })
      setDispositivoCriadoId(dispositivo.id)
      setGalpaoCriadoId(dispositivo.galpoesId)
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? getApiErrorMessage(
        mutation.error,
        status === 404
          ? "Galpão não encontrado para este dispositivo."
          : status === 400
            ? "Dados inválidos. Verifique o nome e o modelo do dispositivo."
            : "Não foi possível cadastrar o dispositivo. Tente novamente."
      )
    : undefined

  function fecharModal(): void {
    setDispositivoCriadoId(null)
  }

  return {
    galpoes: galpoesQuery.data ?? [],
    isLoadingGalpoes: galpoesQuery.isPending || galpoesQuery.isFetching,
    erroGalpoes,
    recarregarGalpoes: () => void galpoesQuery.refetch(),
    isSubmitting: mutation.isPending,
    serverError,
    resetServerError: () => {
      if (mutation.isError) mutation.reset()
    },
    dispositivoCriadoId,
    galpaoCriadoId,
    fecharModal,
    criar: (dados: CriarDispositivoFormValues) => mutation.mutate(dados),
  }
}
