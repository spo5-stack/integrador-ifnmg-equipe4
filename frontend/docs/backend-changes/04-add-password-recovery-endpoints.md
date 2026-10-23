# 04 — Endpoints de recuperação e redefinição de senha

- **Prioridade:** alta
- **Status:** pendente
- **Endpoints propostos:** `POST /api/auth/forgot-password`,
  `POST /api/auth/verify-reset-code`, `POST /api/auth/reset-password`
- **Origem:** telas “Esqueci minha senha” (task 04) e “Verificar código” /
  “Redefinir senha” (task 05)

## Problema atual

O backend não possui nenhum fluxo de recuperação de senha. As telas da referência
visual (`EsqueciSenha.html`, `CodigoVerificacao.html`, `SenhaNova.html`) não têm
contrapartida na API:

- não existe endpoint para solicitar o envio de um código por e-mail;
- não existe endpoint para validar o código;
- não existe endpoint para trocar a senha usando o código.

Unicamente `PATCH /api/usuarios/senha` existe, mas exige `senhaAntiga` e,
portanto, só serve para usuários já autenticados (tela de Perfil, task 04).

Enquanto os endpoints não existirem, o frontend mantém as três telas como
**UI-only**: a tela “Esqueci minha senha” simula o envio com `setTimeout` e exibe
o aviso “Recuperação por e-mail ainda não está disponível neste sistema.”; a tela
de verificação de código usa um código de demonstração fixo (`123456`) e a tela
de redefinição apenas simula o sucesso. Nenhuma requisição HTTP é feita.

Evidências no backend:

- `src/routes/auth.routes.ts` expõe apenas `register` e `login`.
- Não há model de código de recuperação nem serviço de e-mail no projeto.
- `docs/api-routes.md` registra explicitamente que não existem endpoints de
  recuperação/redefinição de senha.

## Mudança proposta

### 1. Solicitar código

```http
POST /api/auth/forgot-password
Content-Type: application/json

{ "email": "maria@exemplo.com" }
```

Resposta `200` **sempre genérica**, independentemente de o e-mail existir:

```json
{ "mensagem": "Se o e-mail estiver cadastrado, enviaremos um código." }
```

Erros: `400` (e-mail inválido), `500`.

### 2. Verificar código

```http
POST /api/auth/verify-reset-code
Content-Type: application/json

{ "email": "maria@exemplo.com", "codigo": "123456" }
```

Resposta `200` com um token de redefinição de curta duração:

```json
{ "resetToken": "jwt-ou-opaque-token", "expiraEm": 600 }
```

Erros:

- `400`: payload inválido (código fora do formato de 6 dígitos);
- `401`/`403`: código incorreto ou expirado;
- `429`: limite de tentativas excedido;
- `500`.

### 3. Redefinir senha

```http
POST /api/auth/reset-password
Content-Type: application/json

{ "resetToken": "jwt-ou-opaque-token", "senha": "novoSegredo123" }
```

Resposta `200`:

```json
{ "mensagem": "Senha redefinida com sucesso." }
```

Erros: `400` (senha fora das regras), `401`/`403` (token inválido/expirado),
`500`.

Alternativa aceitável, caso o time prefira evitar um `resetToken` intermediário:
`POST /api/auth/reset-password` recebendo `{ email, codigo, senha }` de uma vez.
Nesse caso, o passo 2 vira apenas uma checagem opcional de UX.

## Segurança

- Nunca revelar se o e-mail existe: `forgot-password` responde `200` genérico e
  mensagem neutra.
- Código numérico de 6 dígitos, com expiração curta (5–10 minutos) e uso único.
- Limitar tentativas de verificação e frequência de reenvio (rate limit por
  e-mail e por IP); responder `429` quando excedido.
- Guardar apenas o hash do código, nunca o valor em texto puro.
- Invalidar códigos anteriores ao emitir um novo.
- No `reset-password`, aplicar as mesmas regras de senha do registro
  (mínimo 6 no backend) e invalidar todas as sessões/tokens existentes do usuário
  após a troca.
- Não retornar token de sessão em `reset-password`; o usuário deve fazer login.

## Implementação

### Persistência

Criar um model de código de recuperação (ex.:
`backend/src/models/reset-code.model.ts`) com:

- `id`, `usuarioId`, `codigoHash`, `expiraEm`, `tentativas`, `usadoEm`,
  `criadoEm`;
- índice por `usuarioId` e por expiração, para limpeza periódica.

### Camadas

1. `auth.service.ts`: `solicitarRecuperacaoService`,
   `verificarCodigoService`, `redefinirSenhaService`.
2. `auth.controller.ts`: controllers correspondentes, traduzindo os erros de
   domínio para `400`/`401`/`403`/`429`/`500`.
3. `auth.routes.ts`: as três rotas acima, todas **públicas** (sem
   `app.authenticate`) e com schemas Zod, seguindo o padrão de `register` e
   `login`.
4. Serviço de envio de e-mail (novo): responsável por montar e enviar a mensagem
   com o código. Pode ser um stub logado em ambiente de desenvolvimento.

Todas as rotas devem aparecer no OpenAPI em `/docs`.

## Impacto no frontend

Depois que os endpoints existirem:

1. **Task 04 — Esqueci minha senha** (`components/senha/EsqueciSenhaForm.tsx`):
   - remover a simulação com `setTimeout` e o aviso “Recuperação por e-mail ainda
     não está disponível neste sistema.”;
   - criar `solicitarRecuperacao(email)` em `authService.ts`;
   - em sucesso, navegar para `/esqueci-senha/codigo` levando o e-mail via
     `location.state`;
   - tratar `400` e falhas de rede.
2. **Task 05 — Verificar código**
   (`components/senha/CodigoVerificacaoForm.tsx`):
   - remover `CODIGO_DEMO` e o aviso de demonstração;
   - criar `verificarCodigo({ email, codigo })` em `authService.ts`;
   - guardar `resetToken` e navegar para `/esqueci-senha/redefinir`;
   - tratar `401`/`403` (código incorreto/expirado) e `429` (limite excedido).
3. **Task 05 — Redefinir senha**
   (`components/senha/RedefinirSenhaForm.tsx`):
   - remover a simulação e o aviso;
   - criar `redefinirSenha({ resetToken, senha })` em `authService.ts`;
   - em sucesso, redirecionar para `/login` com mensagem de sucesso.

Os `// TODO(task recuperação)` deixados no código marcam exatamente esses pontos.

## Critérios de aceite

- [ ] `POST /api/auth/forgot-password` responde `200` genérico para e-mail
      cadastrado e não cadastrado, sem vazar existência.
- [ ] Código de 6 dígitos é gerado, armazenado com hash e expira em até 10
      minutos.
- [ ] `POST /api/auth/verify-reset-code` retorna token de redefinição para código
      válido e `401`/`403` para código incorreto/expirado.
- [ ] Reenvios e tentativas são limitados, retornando `429` quando excedido.
- [ ] `POST /api/auth/reset-password` troca a senha, invalida o código e as
      sessões antigas, e não retorna token de sessão.
- [ ] As três rotas são públicas e aparecem em `/docs`.
- [ ] Nenhuma resposta revela se um e-mail está cadastrado.

## Riscos e observações

- Depende de um provedor de e-mail; em desenvolvimento, o envio pode ser um stub
  com o código impresso no log — nunca registrado em produção.
- Sem rate limit, o fluxo vira vetor de força bruta do código; o `429` não é
  opcional.
- A decisão de invalidar sessões existentes após a troca de senha afeta o
  comportamento de “Lembrar de mim” no frontend: o usuário precisará logar de
  novo em todos os dispositivos.
