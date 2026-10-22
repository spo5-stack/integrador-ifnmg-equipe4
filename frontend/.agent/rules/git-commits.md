---
trigger: model_decision
description: "Use ao preparar, dividir ou escrever mensagens de commit."
---

# Commits

- Siga o padrão já usado no repositório: Conventional Commits no formato `tipo: descrição`.
- Tipos aceitos: `feat`, `fix`, `docs`, `chore`, `refactor`, `style`, `test`, `build`, `ci`, `perf`.
- Escreva a descrição em inglês, minúscula, no imperativo e sem ponto final. Exemplo: `feat: add dashboard filters`.
- Use escopo apenas quando ele ajudar a distinguir pacotes do monorepo. O histórico atual não usa escopo por padrão.
- Limite o assunto a aproximadamente 72 caracteres. Use o corpo somente para explicar o motivo quando necessário.
- Faça commits pequenos e coesos: um commit por mudança lógica. Não misture código, documentação e configuração sem relação.
- Antes de commitar, revise `git status`, `git diff` e `git diff --cached` e faça stage apenas dos arquivos intencionais.
- Sempre mostre os arquivos alterados e a mensagem de commit proposta e peça confirmação explícita ao usuário. Não crie o commit sem essa confirmação.
- Nunca commite `node_modules/`, `dist/`, segredos, `.env` locais ou arquivos gerados.
- Não use `--amend`, force-push ou commits vazios sem pedido explícito.
- Não faça push sem autorização explícita.
- Se um hook rejeitar o commit, corrija o problema e crie um novo commit; não altere o commit anterior.
