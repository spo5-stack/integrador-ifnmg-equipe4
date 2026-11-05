# 04 — Recuperação e redefinição de senha

- **Status:** implementado
- **Data:** 02/11/2026
- **Endpoints novos:**
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/verify-reset-code`
  - `POST /api/auth/reset-password`
- **Origem:** telas “Esqueci minha senha” (task 04) e “Verificar código” /
  “Redefinir senha” (task 05)

## O que mudou no backend

Foi implementado o fluxo completo de recuperação de senha por e-mail:

1. o usuário informa o e-mail e recebe um código de 6 dígitos;
2. o usuário informa o código e recebe um token temporário de redefinição;
3. o usuário informa a nova senha usando esse token.

Arquivos criados:

- `src/models/recuperacao-senha.model.ts` — schemas Zod e acesso ao banco
- `src/shared/mail/mailer.ts` — envio via Nodemailer (Gmail/SMTP)
- `src/shared/utils/rate-limit.ts` — limitador em memória
- `src/services/errors/muitas-solicitacoes.error.ts`
- `src/services/errors/codigo-recuperacao-invalido.error.ts`
- `src/services/errors/tentativas-recuperacao-excedidas.error.ts`
- `src/services/errors/token-redefinicao-invalido.error.ts`
- `prisma/migrations/20261102180000_add_password_recovery_and_token_version/migration.sql`

Arquivos alterados:

- `prisma/schema.prisma` — novo model `CodigoRecuperacaoSenha` e coluna
  `usuarios.token_version`
- `src/services/auth.service.ts` — regras de negócio da recuperação
- `src/controllers/auth.controller.ts` — novos controllers e mapeamento de erros
- `src/routes/auth.routes.ts` — rotas públicas e documentação OpenAPI
- `src/models/auth.model.ts` — `tokenVersion` no usuário interno
- `src/app.ts` — `authenticate` valida a versão do token contra o banco
- `src/@types/fastify-jwt.d.ts` — claim `ver` no payload do JWT
- `src/env/index.ts` e `.env.example` — variáveis de SMTP

## Como o fluxo funciona

```text
POST /auth/forgot-password
        │  gera código de 6 dígitos (hash argon2, validade 10 min)
        │  invalida códigos anteriores
        ▼
   e-mail com o código
        │
POST /auth/verify-reset-code
        │  valida o código (máx. 5 tentativas)
        │  gera resetToken opaco (32 bytes, hash SHA-256, validade 10 min)
        ▼
   { resetToken, expiraEm: 600 }
        │
POST /auth/reset-password
        │  consome o token (uso único)
        │  troca a senha (argon2)
        │  invalida códigos e sessões antigas
        ▼
   { mensagem: "Senha redefinida com sucesso." }
```

O `resetToken` é opaco (não é JWT), tem uso único e só serve para
`/auth/reset-password`. Ele **não** autentica o usuário nas demais rotas.

## 1. Solicitar código

```http
POST /api/auth/forgot-password
Content-Type: application/json

{ "email": "maria@exemplo.com" }
```

Resposta `200` **sempre genérica**, exista ou não o e-mail:

```json
{ "mensagem": "Se o e-mail estiver cadastrado, enviaremos um código." }
```

| Status | Situação |
| ------ | -------- |
| `200`  | Solicitação aceita (resposta genérica) |
| `400`  | E-mail com formato inválido (validação Zod) |
| `429`  | Limite de solicitações excedido |
| `500`  | Erro interno |

A resposta é idêntica para e-mail cadastrado e não cadastrado. O envio do e-mail
acontece em background para que o tempo de resposta também não revele a
existência da conta.

## 2. Verificar código

```http
POST /api/auth/verify-reset-code
Content-Type: application/json

{ "email": "maria@exemplo.com", "codigo": "123456" }
```

Resposta `200`:

```json
{
  "resetToken": "a1b2c3...64-caracteres-hexadecimais",
  "expiraEm": 600
}
```

`expiraEm` é o tempo restante em **segundos** (600 = 10 minutos).

| Status | Situação |
| ------ | -------- |
| `200`  | Código válido; token de redefinição emitido |
| `400`  | E-mail inválido ou código fora do formato de 6 dígitos |
| `401`  | Código incorreto ou expirado |
| `429`  | Limite de tentativas excedido |
| `500`  | Erro interno |

Mensagens:

- código incorreto/expirado: `"Código inválido ou expirado"`
- tentativas esgotadas: `"Muitas tentativas. Solicite um novo código."`

Após 5 tentativas incorretas, o código é bloqueado e o usuário precisa solicitar
um novo. Verificar o mesmo código com sucesso mais de uma vez emite um novo
`resetToken` e invalida o anterior.

## 3. Redefinir senha

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "resetToken": "a1b2c3...",
  "senha": "novoSegredo123"
}
```

Resposta `200`:

```json
{ "mensagem": "Senha redefinida com sucesso." }
```

| Status | Situação |
| ------ | -------- |
| `200`  | Senha alterada |
| `400`  | Token ausente ou senha com menos de 6 caracteres |
| `401`  | Token inválido, expirado ou já utilizado |
| `429`  | Limite de tentativas excedido |
| `500`  | Erro interno |

Mensagem de token inválido: `"Token de redefinição inválido ou expirado"`.

**A resposta não inclui token de sessão.** O usuário deve voltar para o login e
entrar com a nova senha.

## Regras de segurança

### Código

- 6 dígitos numéricos gerados com `crypto.randomInt`.
- Armazenado apenas como hash argon2; o valor em texto puro nunca é persistido.
- Validade de 10 minutos.
- Uso único: é consumido no `reset-password`.
- Uma nova solicitação invalida todos os códigos ativos anteriores do usuário.
- Máximo de 5 tentativas de verificação por código.

### Token de redefinição

- 32 bytes aleatórios (`crypto.randomBytes`), representados em hexadecimal.
- Armazenado apenas como hash SHA-256.
- Validade de 10 minutos.
- Uso único: o consumo é feito em transação com `usadoEm IS NULL`.
- Uma nova verificação de código sobrescreve o token anterior.

### Rate limits

Os limites são em memória e reiniciam quando o servidor reinicia.

| Fluxo | Chave | Limite |
| ----- | ----- | ------ |
| `forgot-password` | e-mail | 1 por minuto |
| `forgot-password` | e-mail | 5 por hora |
| `forgot-password` | IP | 10 por minuto |
| `verify-reset-code` | IP | 20 por minuto |
| `verify-reset-code` | código/e-mail | 5 tentativas incorretas |
| `reset-password` | IP | 10 por 15 minutos |

Ao exceder, a API responde `429` com `{ "erro": "..." }`.

### Invalidação de sessões

O `reset-password` incrementa `usuarios.token_version`. Todo JWT de acesso passa a
carregar a claim `ver`, e o hook `authenticate` compara esse valor com o banco.
Depois de uma redefinição, **todos os tokens de acesso emitidos antes da troca
passam a responder `401`**, em todos os dispositivos. O usuário precisa logar
novamente.

Esse comportamento afeta o “Lembrar de mim”: sessões antigas não são preservadas.

## Impacto no frontend

### Task 04 — Esqueci minha senha

Em `components/senha/EsqueciSenhaForm.tsx`:

1. Remover a simulação com `setTimeout` e o aviso “Recuperação por e-mail ainda
   não está disponível neste sistema.”.
2. Adicionar o serviço:

```ts
export async function solicitarRecuperacao(email: string) {
  const { data } = await api.post<{ mensagem: string }>(
    '/auth/forgot-password',
    { email },
  )
  return data
}
```

3. Em sucesso, navegar para `/esqueci-senha/codigo` levando o e-mail em
   `location.state`.
4. Tratar `400` (e-mail inválido) e `429` (muitas solicitações).

Mesmo que o e-mail não exista, a resposta é `200`. A tela deve seguir para a
próxima etapa normalmente.

### Task 05 — Verificar código

Em `components/senha/CodigoVerificacaoForm.tsx`:

1. Remover `CODIGO_DEMO` e o aviso de demonstração.
2. Adicionar o serviço:

```ts
export async function verificarCodigo(dados: {
  email: string
  codigo: string
}) {
  const { data } = await api.post<{
    resetToken: string
    expiraEm: number
  }>('/auth/verify-reset-code', dados)
  return data
}
```

3. Guardar `resetToken` e navegar para `/esqueci-senha/redefinir`.
4. Tratar:
   - `400`: código fora do formato de 6 dígitos;
   - `401`: código incorreto ou expirado;
   - `429`: muitas tentativas — orientar a solicitar um novo código.

### Task 05 — Redefinir senha

Em `components/senha/RedefinirSenhaForm.tsx`:

1. Remover a simulação e o aviso.
2. Adicionar o serviço:

```ts
export async function redefinirSenha(dados: {
  resetToken: string
  senha: string
}) {
  const { data } = await api.post<{ mensagem: string }>(
    '/auth/reset-password',
    dados,
  )
  return data
}
```

3. Em sucesso, redirecionar para `/login` com mensagem de sucesso.
4. Tratar `400` (senha curta) e `401` (token expirado/usado). Em `401`, sugerir
   reiniciar o fluxo em `/esqueci-senha`.

Os `// TODO(task recuperação)` existentes marcam exatamente esses pontos.

### Armazenamento do `resetToken`

Como o token é de curta duração e uso único, o frontend pode mantê-lo apenas no
estado da navegação (`location.state` ou contexto). Evite persistir em
`localStorage`; se a página for recarregada e o token se perder, o usuário deve
recomeçar o fluxo.

## OpenAPI

As três rotas são **públicas** (sem `Bearer`) e aparecem em `/docs`:

- `POST /api/auth/forgot-password` — `200`, `429`
- `POST /api/auth/verify-reset-code` — `200`, `401`, `429`
- `POST /api/auth/reset-password` — `200`, `401`, `429`

## Configuração de e-mail

Para enviar e-mails de verdade é necessário configurar SMTP (Gmail). O passo a
passo está em:

```text
docs/configuracao-email-recuperacao-senha.md
```

Sem SMTP configurado, em `development` o código é impresso no log do servidor:

```text
[recuperacao-senha] Código para maria@exemplo.com: 123456
```

Em `production`, a ausência de SMTP faz o envio falhar (o erro é registrado no
log) e nenhum código é exposto.

## Critérios de aceite

- [x] `POST /api/auth/forgot-password` responde `200` genérico para e-mail
      cadastrado e não cadastrado, sem vazar existência.
- [x] Código de 6 dígitos é gerado, armazenado com hash e expira em 10 minutos.
- [x] `POST /api/auth/verify-reset-code` retorna token de redefinição para código
      válido e `401` para código incorreto/expirado.
- [x] Reenvios e tentativas são limitados, retornando `429` quando excedido.
- [x] `POST /api/auth/reset-password` troca a senha, invalida o código e as
      sessões antigas, e não retorna token de sessão.
- [x] As três rotas são públicas e aparecem em `/docs`.
- [x] Nenhuma resposta revela se um e-mail está cadastrado.

## Riscos e observações

- O rate limit é em memória: não é compartilhado entre múltiplas instâncias e
  zera ao reiniciar. Para produção com mais de uma réplica, trocar por um store
  compartilhado (ex.: Redis).
- Os limites por IP usam `request.ip`. Se a API ficar atrás de um proxy reverso,
  configure `trustProxy` no Fastify para que o IP real do cliente seja usado; sem
  isso, todos os clientes podem compartilhar o mesmo limite.
- O envio do e-mail depende de um provedor externo. Gmail tem limites diários de
  envio; para volume maior, usar um serviço transacional.
- A invalidação de sessões é intencional. Usuários logados em outros
  dispositivos serão deslogados após uma redefinição de senha.
- O `PATCH /api/usuarios/senha` (usuário autenticado) continua funcionando e
  **não** invalida as demais sessões; apenas o fluxo de recuperação incrementa
  `token_version`.
