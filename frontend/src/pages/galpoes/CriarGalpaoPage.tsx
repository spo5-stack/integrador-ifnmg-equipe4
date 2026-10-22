import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { GalpaoForm } from "@/components/galpoes/GalpaoForm"
import type { GalpaoFormValues } from "@/components/galpoes/galpaoSchema"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import { criarGalpao } from "@/services/galpaoService"

export function CriarGalpaoPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (dados: GalpaoFormValues) =>
      criarGalpao({
        nome: dados.nome,
        capacidade: Number(dados.capacidade),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["galpoes"] })
      navigate("/galpoes", {
        state: { sucesso: "Galpão cadastrado com sucesso." },
      })
    },
  })

  const status = mutation.isError
    ? getApiErrorStatus(mutation.error)
    : undefined
  const serverError = mutation.isError
    ? getApiErrorMessage(
        mutation.error,
        status === 400
          ? "Dados inválidos. Verifique os campos e tente novamente."
          : "Não foi possível cadastrar o galpão. Tente novamente."
      )
    : undefined

  return (
    <div className="flex flex-col gap-6">
      <header>
        <Link
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          to="/galpoes"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Voltar
        </Link>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Novo Galpão
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cadastre um novo galpão no sistema.
        </p>
      </header>

      <section className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <GalpaoForm
          cancelHref="/galpoes"
          isSubmitting={mutation.isPending}
          onFieldChange={() => {
            if (mutation.isError) mutation.reset()
          }}
          onSubmit={(dados) => mutation.mutate(dados)}
          serverError={serverError}
          submitLabel="Salvar"
        />
      </section>
    </div>
  )
}
