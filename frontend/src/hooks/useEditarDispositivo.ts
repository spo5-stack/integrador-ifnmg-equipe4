import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import type { EditarDispositivoFormValues } from "@/components/dispositivos/dispositivoSchema"
import type { Dispositivo } from "@/interfaces/dispositivo"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import {
  editarDispositivo,
  listarDispositivosDoGalpao,
} from "@/services/dispositivoService"
import { listarGalpoesParaSelecao } from "@/services/galpaoService"

export type EstadoInicialEdicao = {
  dispositivo?: Dispositivo
  galpoesId?: string
  galpaoNome?: string
}

export function useEditarDispositivo(
  dispositivoId: string | undefined,
  estadoInicial?: EstadoInicialEdicao
) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dispositivoInicial = estadoInicial?.dispositivo

  const buscaQuery = useQuery({
    queryKey: ["dispositivo", dispositivoId, "busca"],
    enabled: Boolean(dispositivoId) && !dispositivoInicial,
    queryFn: async ({ signal }) => {
      const galpoes = await listarGalpoesParaSelecao()

      for (const galpao of galpoes) {
        if (signal.aborted) return null

        let dispositivos: Dispositivo[]

        try {
          dispositivos = await listarDispositivosDoGalpao(galpao.id, signal)
        } catch {
          if (signal.aborted) return null
          continue
        }

        const encontrado = dispositivos.find(
          (dispositivo) => dispositivo.id === dispositivoId
        )

        if (encontrado) {
          return { dispositivo: encontrado, galpaoNome: galpao.nome }
        }
      }

      return null
    },
  })

  const dispositivo = dispositivoInicial ?? buscaQuery.data?.dispositivo ?? null
  const galpaoNome = dispositivoInicial
    ? (estadoInicial?.galpaoNome ?? "")
    : (buscaQuery.data?.galpaoNome ?? "")

  const isBuscando = buscaQuery.isPending || buscaQuery.isFetching
  const isLoading = Boolean(dispositivoId) && !dispositivoInicial && isBuscando
  const erroCarregamento =
    !dispositivoInicial && buscaQuery.isError && !dispositivo
      ? getApiErrorMessage(
          buscaQuery.error,
          "Não foi possível carregar o dispositivo. Tente novamente."
        )
      : null
  const naoEncontrado =
    !dispositivoId ||
    (!dispositivoInicial && !isBuscando && !dispositivo && !erroCarregamento)

  const mutation = useMutation({
    mutationFn: (dados: EditarDispositivoFormValues) =>
      editarDispositivo(dispositivoId as string, dados),
    onSuccess: (atualizado) => {
      void queryClient.invalidateQueries({
        queryKey: ["galpao", atualizado.galpoesId],
      })
      void queryClient.invalidateQueries({ queryKey: ["galpoes"] })

      const destino = atualizado.galpoesId || dispositivo?.galpoesId

      navigate(
        destino ? `/galpoes/${encodeURIComponent(destino)}` : "/galpoes",
        { state: { sucesso: "Dispositivo atualizado com sucesso." } }
      )
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const naoEncontradoAposEdicao = status === 404
  const serverError =
    mutation.isError && !naoEncontradoAposEdicao
      ? getApiErrorMessage(
          mutation.error,
          status === 400
            ? "Dados inválidos. Verifique os campos e tente novamente."
            : "Não foi possível atualizar o dispositivo. Tente novamente."
        )
      : undefined

  function recarregar(): void {
    if (dispositivoInicial) return
    void buscaQuery.refetch()
  }

  return {
    dispositivo,
    galpaoId: dispositivo?.galpoesId ?? estadoInicial?.galpoesId ?? "",
    galpaoNome,
    isLoading,
    naoEncontrado: naoEncontrado || naoEncontradoAposEdicao,
    erroCarregamento,
    isSubmitting: mutation.isPending,
    serverError,
    resetServerError: () => {
      if (mutation.isError) mutation.reset()
    },
    recarregar,
    editar: (dados: EditarDispositivoFormValues) => mutation.mutate(dados),
  }
}
