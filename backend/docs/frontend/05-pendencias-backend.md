# 05 — Pendências que o frontend ainda precisa do backend

- **Status:** pendente
- **Origem:** revisão da integração das mudanças 01 a 04 no frontend

As mudanças 01 a 04 foram integradas e testadas. Restam os itens abaixo, que
ou causam erro para o usuário hoje, ou exigem decisão de contrato.

## 1. `DELETE /api/usuarios` com galpões vinculados retorna 500

Hoje a exclusão da conta falha com `500 {"erro":"Erro interno do servidor"}`
quando o usuário ainda tem galpões. A causa é a FK
`galpoes_usuario_id_fkey ... ON DELETE RESTRICT`: o Prisma lança
`PrismaClientKnownRequestError` com `code === 'P2003'`, e o service não trata.

### O que fazer

- Capturar `P2003` na exclusão do usuário e lançar um erro de domínio (ex.:
  `UsuarioPossuiGalpoesError`).
- Mapear para `409 { "erro": "Exclua seus galpões antes de excluir a conta." }`.
- Documentar `409` na rota `DELETE /api/usuarios` no OpenAPI.

### Critérios de aceite

- [ ] Usuário sem galpões: `DELETE /api/usuarios` retorna `204`.
- [ ] Usuário com galpão: retorna `409` com a mensagem acima, nunca `500`.
- [ ] `409` aparece em `/docs`.

### Impacto no frontend

`usePerfil` já mostra `response.data.erro` quando existe. Com a mudança, o
usuário verá a orientação correta em vez de "Erro interno do servidor".

## 2. Senha antiga incorreta responde `401`

`PATCH /api/usuarios/senha` com `senhaAntiga` errada retorna
`401 {"erro":"Senha antiga inválida"}`.

Na convenção HTTP, `401` significa "sessão inválida ou ausente". O frontend
trata qualquer `401` fora das rotas de autenticação como sessão expirada e
desloga o usuário, o que acontece hoje ao errar a senha atual.

### O que fazer (uma das opções)

- **Preferida:** responder `400 { "erro": "Senha antiga inválida" }` nesse caso.
  Ou `403`, se preferirem manter a semântica de "não autorizado a trocar".
- Manter `401` só para token ausente, inválido ou expirado.

### Critérios de aceite

- [ ] Senha antiga errada não retorna `401`.
- [ ] Token inválido continua retornando `401`.
- [ ] OpenAPI documenta o status escolhido.

### Impacto no frontend

Quando a mudança chegar, o frontend deve passar a exibir a mensagem de senha
atual incorreta sem deslogar. Esse ajuste ainda não foi feito.

## 3. Sessão de 3 horas e "Lembrar de mim" (decisão pendente)

O access token expira em 3 horas (`exp - iat = 10800`) e não existe refresh
token. Por isso, "Lembrar de mim" não mantém o login além desse prazo.

Se quiserem sessões longas, a proposta é:

- `POST /api/auth/refresh` com refresh token de longa duração, rotacionado a
  cada uso e armazenado com hash no banco.
- `POST /api/auth/logout` que revoga o refresh token.

Se preferirem manter o token atual, basta confirmar, e o frontend apenas
passa a descartar a sessão expirada ao iniciar.

### Critérios de aceite (se aprovado)

- [ ] `refresh` emite novo access token e novo refresh token.
- [ ] Refresh token antigo, após uso, retorna `401`.
- [ ] `logout` revoga o refresh token.

## 4. Inconsistência na documentação de `docs/frontend`

Os exemplos de `03-buscar-dispositivo-por-id.md` e
`04-recuperacao-de-senha.md` usam caminhos sem o prefixo `/api`
(ex.: `/dispositivos/{id}`, `/auth/forgot-password`). A API real é
`/api/...`, conforme o OpenAPI em `/docs/openapi.json`. Sugestão: ajustar os
exemplos para evitar que quem integrar copie o caminho errado.

## 5. Observação para o ambiente de produção

O rate limit é em memória e o `request.ip` pode ser o IP do proxy. Antes de
produção, configurar `trustProxy` e, se houver mais de uma réplica, um store
compartilhado (ex.: Redis). Já está descrito no doc 04.
