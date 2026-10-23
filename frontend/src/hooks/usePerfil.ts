import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import type {
  NomeFormValues,
  SenhaFormValues,
} from "@/components/perfil/perfilSchema"
import { useAuth } from "@/contexts/AuthContext"
import { getApiErrorMessage, getApiErrorStatus } from "@/services/api"
import {
  atualizarNome,
  atualizarSenha,
  excluirConta,
} from "@/services/usuarioService"

export type FeedbackPerfil = {
  tipo: "nome" | "senha"
  mensagem: string
}

export function usePerfil() {
  const navigate = useNavigate()
  const { usuario, updateUsuario, logout } = useAuth()
  const [feedback, setFeedback] = useState<FeedbackPerfil | null>(null)
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)

  const nomeMutation = useMutation({
    mutationFn: (dados: NomeFormValues) =>
      atualizarNome({ nome: dados.nome.trim() }),
    onSuccess: (atualizado) => {
      updateUsuario(atualizado)
      setFeedback({
        tipo: "nome",
        mensagem: "Nome atualizado com sucesso!",
      })
    },
  })

  const senhaMutation = useMutation({
    mutationFn: (dados: SenhaFormValues) =>
      atualizarSenha({
        senhaAntiga: dados.senhaAntiga,
        senhaNova: dados.senhaNova,
      }),
    onSuccess: () => {
      setFeedback({
        tipo: "senha",
        mensagem: "Senha alterada com sucesso!",
      })
    },
  })

  const exclusaoMutation = useMutation({
    mutationFn: () => excluirConta(),
    onSuccess: () => {
      logout()
      navigate("/login", {
        replace: true,
        state: { sucesso: "Sua conta foi excluída." },
      })
    },
    onError: (error) => {
      setErroPerfil(
        getApiErrorMessage(error, "Não foi possível excluir sua conta.")
      )
    },
  })

  const statusNome = nomeMutation.isError
    ? getApiErrorStatus(nomeMutation.error)
    : undefined
  const erroNome = nomeMutation.isError
    ? getApiErrorMessage(
        nomeMutation.error,
        statusNome === 400
          ? "Nome inválido. Verifique o valor informado."
          : "Não foi possível atualizar o nome. Tente novamente."
      )
    : undefined

  const statusSenha = senhaMutation.isError
    ? getApiErrorStatus(senhaMutation.error)
    : undefined
  const erroSenha = senhaMutation.isError
    ? getApiErrorMessage(
        senhaMutation.error,
        statusSenha === 400
          ? "Senha atual incorreta. Verifique e tente novamente."
          : "Não foi possível alterar a senha. Tente novamente."
      )
    : undefined

  return {
    usuario,
    nomeInicial: usuario?.nome ?? "",
    isAlterandoNome: nomeMutation.isPending,
    erroNome,
    salvarNome: (dados: NomeFormValues) => {
      setFeedback(null)
      nomeMutation.mutate(dados)
    },
    resetErroNome: () => {
      if (nomeMutation.isError) nomeMutation.reset()
    },
    isAlterandoSenha: senhaMutation.isPending,
    erroSenha,
    salvarSenha: (dados: SenhaFormValues) => {
      setFeedback(null)
      senhaMutation.mutate(dados)
    },
    resetErroSenha: () => {
      if (senhaMutation.isError) senhaMutation.reset()
    },
    feedbackNome: feedback?.tipo === "nome" ? feedback.mensagem : null,
    feedbackSenha: feedback?.tipo === "senha" ? feedback.mensagem : null,
    fecharFeedback: () => setFeedback(null),
    isExcluindoConta: exclusaoMutation.isPending,
    erroExclusao: erroPerfil,
    excluirConta: () => {
      setErroPerfil(null)
      exclusaoMutation.mutate()
    },
  }
}
