import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import type { Galpao } from "@/interfaces/galpao"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { excluirGalpao, listarGalpoes } from "@/services/galpaoService"

const GALPOES_POR_PAGINA = 10

export function useGalpoes() {
  const queryClient = useQueryClient()
  const [pagina, setPagina] = useState(1)
  const [busca, setBusca] = useState("")
  const [galpaoParaExcluir, setGalpaoParaExcluir] = useState<Galpao | null>(
    null
  )
  const [erroExclusao, setErroExclusao] = useState<string | null>(null)

  const query = useQuery({
    queryKey: ["galpoes", pagina],
    queryFn: ({ signal }) =>
      listarGalpoes({ pagina, porPagina: GALPOES_POR_PAGINA }, signal),
  })

  const galpoes = query.data?.galpoes ?? []
  const total = query.data?.total ?? 0
  const totalPaginas = Math.max(
    1,
    Math.ceil(total / (query.data?.porPagina ?? GALPOES_POR_PAGINA))
  )
  const inicio = total === 0 ? 0 : (pagina - 1) * GALPOES_POR_PAGINA + 1
  const fim = Math.min(pagina * GALPOES_POR_PAGINA, total)
  const termoBusca = busca.trim().toLocaleLowerCase("pt-BR")
  const galpoesFiltrados = termoBusca
    ? galpoes.filter((galpao) =>
        galpao.nome.toLocaleLowerCase("pt-BR").includes(termoBusca)
      )
    : galpoes

  const erro = query.isError
    ? getApiErrorMessage(
        query.error,
        "Não foi possível carregar os galpões. Tente novamente."
      )
    : null

  const isLoading = query.isPending || query.isFetching

  const exclusao = useMutation({
    mutationFn: (id: string) => excluirGalpao(id),
    onSuccess: async () => {
      setGalpaoParaExcluir(null)
      setBusca("")

      if (pagina > 1 && galpoes.length === 1) {
        setPagina(pagina - 1)
        return
      }

      await queryClient.invalidateQueries({ queryKey: ["galpoes"] })
    },
    onError: (error) => {
      const status = getApiErrorStatus(error)

      if (status === 409) {
        setErroExclusao(
          "Este galpão possui lotes ou dispositivos vinculados e não pode ser excluído."
        )
      } else if (status === 404) {
        setErroExclusao("Galpão não encontrado. A lista será atualizada.")
        void queryClient.invalidateQueries({ queryKey: ["galpoes"] })
      } else {
        setErroExclusao(
          getApiErrorMessage(error, "Não foi possível excluir o galpão.")
        )
      }

      setGalpaoParaExcluir(null)
    },
  })

  function recarregar(): void {
    void query.refetch()
  }

  function mudarBusca(valor: string): void {
    setBusca(valor)
  }

  function irParaPagina(novaPagina: number): void {
    if (novaPagina < 1 || novaPagina > totalPaginas) return
    if (novaPagina === pagina) return

    setBusca("")
    setPagina(novaPagina)
  }

  function solicitarExclusao(galpao: Galpao): void {
    setErroExclusao(null)
    setGalpaoParaExcluir(galpao)
  }

  function cancelarExclusao(): void {
    if (!exclusao.isPending) setGalpaoParaExcluir(null)
  }

  function confirmarExclusao(): void {
    if (!galpaoParaExcluir || exclusao.isPending) return
    exclusao.mutate(galpaoParaExcluir.id)
  }

  return {
    pagina,
    galpoes,
    galpoesFiltrados,
    total,
    totalPaginas,
    inicio,
    fim,
    isLoading,
    erro,
    busca,
    temBusca: termoBusca.length > 0,
    galpaoParaExcluir,
    isExcluindo: exclusao.isPending,
    erroExclusao,
    recarregar,
    mudarBusca,
    irParaPagina,
    solicitarExclusao,
    cancelarExclusao,
    confirmarExclusao,
  }
}
