import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import type { LoteFormValues } from "@/components/lotes/loteSchema"
import { converterParaCriarLote } from "@/components/lotes/loteSchema"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { listarGalpoesParaSelecao } from "@/services/galpaoService"
import { criarLote } from "@/services/loteService"

export function useCadastrarLote(galpaoIdInicial?: string) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
    mutationFn: ({
      galpaoId,
      dados,
    }: {
      galpaoId: string
      dados: LoteFormValues
    }) => criarLote(galpaoId, converterParaCriarLote(dados)),
    onSuccess: (_lote, variaveis) => {
      void queryClient.invalidateQueries({ queryKey: ["galpoes"] })
      void queryClient.invalidateQueries({
        queryKey: ["galpao", variaveis.galpaoId],
      })
      navigate(`/galpoes/${encodeURIComponent(variaveis.galpaoId)}`, {
        state: { sucesso: "Lote cadastrado com sucesso." },
      })
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? getApiErrorMessage(
        mutation.error,
        status === 404
          ? "Galpão não encontrado. Verifique se ele ainda está disponível."
          : status === 409
            ? "Já existe um lote ativo para este galpão."
            : status === 400
              ? "Dados inválidos. Verifique a quantidade e a data de início."
              : "Não foi possível cadastrar o lote. Tente novamente."
      )
    : undefined

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
    cadastrar: (galpaoId: string, dados: LoteFormValues) =>
      mutation.mutate({ galpaoId, dados }),
  }
}
