# API Routes — Backend

Fonte oficial das rotas do backend. Snapshot obtido em 2026-10-22 a partir de
`http://localhost:3333/docs/openapi.json` (OpenAPI 3.0.0 gerado pelo Fastify
Swagger). A interface interativa fica em `http://localhost:3333/docs/`.

Quando o backend mudar, atualize este arquivo consultando novamente o JSON:

```bash
curl -sS http://localhost:3333/docs/openapi.json
```

## Configuração

- Base URL: `http://localhost:3333`
- Prefixo de todas as rotas de negócio: `/api`
- No frontend, use `VITE_API_URL`; não hardcode a URL.
- Formato: JSON (`Content-Type: application/json`)
- Todas as rotas com autenticação exigem:
  `Authorization: Bearer <token>`
- O token é um JWT com validade de **3 horas**, retornado por login/registro.
- Todos os IDs são UUID.
- Datas são ISO 8601 (`date-time`), por exemplo `2026-10-22T18:00:00.000Z`.

## Autenticação e erros

Rotas sem autenticação:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/leituras-sensores` (uso exclusivo do gateway)

Erros de aplicação usam o envelope:

```json
{ "erro": "mensagem" }
```

Status documentados/observados:

| Status | Uso                                                         |
| ------ | ----------------------------------------------------------- |
| `400`  | Validação de payload/params falhou (Fastify/Zod)            |
| `401`  | Credenciais inválidas ou token ausente/inválido             |
| `404`  | Recurso não encontrado                                      |
| `409`  | Conflito de domínio (e-mail cadastrado, vínculos, etc.)     |
| `422`  | Leitura de sensor inválida                                  |
| `500`  | Erro interno do servidor                                    |

Não existem endpoints de refresh token, logout no servidor, recuperação de senha
ou redefinição de senha por código. As telas de “Esqueci senha” e “Código de
verificação” da referência visual não têm backend correspondente ainda.

## Resumo por caso de uso

| Tela/uso                         | Endpoint principal                                      |
| -------------------------------- | ------------------------------------------------------- |
| Criar conta                      | `POST /api/auth/register`                               |
| Login                            | `POST /api/auth/login`                                  |
| Dashboard geral                  | `GET /api/dashboard`                                    |
| Listar galpões                   | `GET /api/galpoes`                                      |
| Criar galpão                     | `POST /api/galpoes`                                     |
| Detalhe do galpão                | `GET /api/galpoes/{id}`                                 |
| Editar galpão                    | `PUT /api/galpoes/{id}`                                 |
| Excluir galpão                   | `DELETE /api/galpoes/{id}`                              |
| Status de luminosidade do galpão | `GET /api/galpoes/{id}/status`                          |
| Criar lote                       | `POST /api/galpoes/{galpaoId}/lotes`                    |
| Listar lotes do galpão           | `GET /api/galpoes/{galpaoId}/lotes`                     |
| Editar lote                      | `PUT /api/lotes/{id}`                                   |
| Encerrar lote                    | `PATCH /api/lotes/{id}/encerrar`                        |
| Criar dispositivo                | `POST /api/galpoes/{galpaoId}/dispositivos`             |
| Listar dispositivos do galpão    | `GET /api/galpoes/{galpaoId}/dispositivos`              |
| Editar dispositivo               | `PUT /api/dispositivos/{id}`                            |
| Excluir dispositivo              | `DELETE /api/dispositivos/{id}`                         |
| Histórico de leituras            | `GET /api/dispositivos/{dispositivosId}/leituras`       |
| Enviar leituras (gateway)        | `POST /api/leituras-sensores`                           |
| Alterar nome                     | `PATCH /api/usuarios/nome`                              |
| Alterar senha                    | `PATCH /api/usuarios/senha`                             |
| Excluir conta                    | `DELETE /api/usuarios`                                  |

## Auth

### `POST /api/auth/register`

Cria usuário e já retorna token.

```json
{
  "nome": "Maria Silva",
  "email": "maria@exemplo.com",
  "senha": "segredo123",
  "confirmarSenha": "segredo123"
}
```

Regras: `nome` mínimo 1, `email` válido, `senha` mínimo 6, `confirmarSenha`
mínimo 1. Resposta `201`:

```json
{
  "usuario": { "id": "uuid", "nome": "Maria Silva", "email": "maria@exemplo.com" },
  "token": "jwt"
}
```

Erros: `409` e-mail já cadastrado; `500`.

### `POST /api/auth/login`

```json
{ "email": "maria@exemplo.com", "senha": "segredo123" }
```

O backend normaliza o e-mail para minúsculas. Resposta `200` tem o mesmo formato
do registro. Erros: `401` credenciais inválidas; `500`.

## Dashboard

### `GET /api/dashboard`

Requer autenticação. Retorna indicadores de todos os galpões do usuário:

```json
{
  "totalGalpoes": 2,
  "totalLotesAtivos": 1,
  "totalDispositivos": 4,
  "totalAdequados": 3,
  "galpoes": [
    {
      "galpaoId": "uuid",
      "galpaoNome": "Galpão 1",
      "loteAtivo": {
        "id": "uuid",
        "quantidade": 1200,
        "dataInicio": "2026-10-01T00:00:00.000Z",
        "status": "ATIVO",
        "fase": "string calculada pelo backend"
      },
      "dispositivos": [
        {
          "id": "uuid",
          "nome": "Sensor 1",
          "ultimaLeitura": {
            "valor": 42,
            "criadoEm": "2026-10-22T18:00:00.000Z"
          },
          "statusLuminosidade": "string calculada pelo backend"
        }
      ]
    }
  ]
}
```

`loteAtivo` e `ultimaLeitura` podem ser `null`.

## Galpões

### `POST /api/galpoes`

```json
{ "nome": "Galpão 1", "capacidade": 1500 }
```

`nome` mínimo 1; `capacidade` inteiro maior que 0. Resposta `201`:

```json
{
  "id": "uuid",
  "nome": "Galpão 1",
  "capacidade": 1500,
  "criadoEm": "2026-10-22T18:00:00.000Z",
  "atualizadoEm": "2026-10-22T18:00:00.000Z"
}
```

### `GET /api/galpoes?pagina=1&porPagina=10`

`pagina` inicia em 1; `porPagina` vai de 1 a 100 (padrão 10).

```json
{
  "galpoes": [
    {
      "id": "uuid",
      "nome": "Galpão 1",
      "capacidade": 1500,
      "criadoEm": "2026-10-22T18:00:00.000Z",
      "atualizadoEm": "2026-10-22T18:00:00.000Z",
      "_count": { "lotes": 2, "dispositivos": 4 }
    }
  ],
  "total": 1,
  "pagina": 1,
  "porPagina": 10
}
```

### `GET /api/galpoes/{id}`

Retorna o galpão com `lotes` e `dispositivos` completos. Erro `404`.

### `PUT /api/galpoes/{id}`

Corpo com campos opcionais:

```json
{ "nome": "Galpão Norte", "capacidade": 1800 }
```

Erros: `404`; `409` (por exemplo, capacidade incompatível com lote ativo).

### `DELETE /api/galpoes/{id}`

Resposta `204`. Erros: `404`; `409` quando o galpão possui vínculos.

### `GET /api/galpoes/{id}/status`

Status atual de luminosidade do galpão:

```json
{
  "galpaoId": "uuid",
  "galpaoNome": "Galpão 1",
  "loteAtivo": {
    "id": "uuid",
    "quantidade": 1200,
    "dataInicio": "2026-10-01T00:00:00.000Z",
    "status": "ATIVO",
    "fase": "string calculada pelo backend"
  },
  "dispositivos": [
    {
      "id": "uuid",
      "nome": "Sensor 1",
      "ultimaLeitura": { "valor": 42, "criadoEm": "2026-10-22T18:00:00.000Z" },
      "statusLuminosidade": "string calculada pelo backend"
    }
  ]
}
```

## Lotes

Um galpão só pode ter um lote ativo por vez; criar outro retorna `409`.

### `POST /api/galpoes/{galpaoId}/lotes`

```json
{ "quantidade": 1200, "dataInicio": "2026-10-01T00:00:00.000Z" }
```

`quantidade` inteiro maior que 0. `dataInicio` não pode estar no futuro.
Resposta `201`:

```json
{
  "id": "uuid",
  "quantidade": 1200,
  "dataInicio": "2026-10-01T00:00:00.000Z",
  "status": "ATIVO",
  "galpoesId": "uuid",
  "criadoEm": "2026-10-22T18:00:00.000Z",
  "atualizadoEm": "2026-10-22T18:00:00.000Z"
}
```

Erros: `409` quando já existe lote ativo.

### `GET /api/galpoes/{galpaoId}/lotes`

Lista lotes com `fase` calculada:

```json
[
  {
    "id": "uuid",
    "quantidade": 1200,
    "dataInicio": "2026-10-01T00:00:00.000Z",
    "status": "ATIVO",
    "fase": "string calculada pelo backend",
    "galpoesId": "uuid",
    "criadoEm": "2026-10-22T18:00:00.000Z",
    "atualizadoEm": "2026-10-22T18:00:00.000Z"
  }
]
```

### `PUT /api/lotes/{id}`

Campos opcionais: `quantidade` (inteiro > 0) e `dataInicio` (ISO). Resposta `200`
com o lote atualizado.

### `PATCH /api/lotes/{id}/encerrar`

Sem corpo. Encerra o lote, definindo `status` como `DESATIVADO`. Resposta `200`
com o lote atualizado.

Não existem `GET /api/lotes/{id}` nem `DELETE /api/lotes/{id}`.

## Dispositivos

### `POST /api/galpoes/{galpaoId}/dispositivos`

```json
{ "nome": "Sensor 1", "modelo": "LDR-01" }
```

Resposta `201`:

```json
{
  "id": "uuid",
  "nome": "Sensor 1",
  "modelo": "LDR-01",
  "status": "ATIVO",
  "galpoesId": "uuid",
  "criadoEm": "2026-10-22T18:00:00.000Z",
  "atualizadoEm": "2026-10-22T18:00:00.000Z"
}
```

Erro `404` quando o galpão não existe.

### `GET /api/galpoes/{galpaoId}/dispositivos`

Retorna um array de dispositivos no mesmo formato acima. Erro `404`.

### `PUT /api/dispositivos/{id}`

Campos opcionais:

```json
{
  "nome": "Sensor 1",
  "modelo": "LDR-02",
  "status": "ATIVO"
}
```

`status`: `ATIVO` ou `DESATIVADO`. Resposta `200`; erro `404`.

### `DELETE /api/dispositivos/{id}`

Resposta `204`; erro `404`.

### `GET /api/dispositivos/{dispositivosId}/leituras?pagina=1&porPagina=20`

`porPagina` vai de 1 a 100 (padrão 20).

```json
{
  "leituras": [
    {
      "id": "uuid",
      "valorLuminosidade": 42,
      "criadoEm": "2026-10-22T18:00:00.000Z"
    }
  ],
  "total": 1,
  "pagina": 1,
  "porPagina": 20
}
```

## Leituras de sensores (gateway)

### `POST /api/leituras-sensores`

Rota pública, destinada ao gateway. O corpo é um **array**:

```json
[
  { "luminosidade": 42, "dispositivosId": "uuid" },
  { "luminosidade": 38, "dispositivosId": "uuid" }
]
```

`luminosidade` inteiro entre 0 e 100. Resposta `201`:

```json
{ "recebidas": 2 }
```

Erro `422` para leitura inválida.

## Usuários

### `PATCH /api/usuarios/nome`

```json
{ "nome": "Novo nome" }
```

Resposta `200` com `{ id, nome, email }`.

### `PATCH /api/usuarios/senha`

```json
{ "senhaAntiga": "segredo123", "senhaNova": "novoSegredo123" }
```

`senhaNova` mínimo 6. Resposta `200` com `{ id, nome, email }`. Erro de senha
antiga inválida deve ser tratado como falha de validação/negócio.

### `DELETE /api/usuarios`

Exclui a própria conta. Resposta `204`.

## Tipos TypeScript sugeridos

```ts
export type StatusRegistro = "ATIVO" | "DESATIVADO"

export type Usuario = {
  id: string
  nome: string
  email: string
}

export type RespostaAuth = {
  usuario: Usuario
  token: string
}

export type Galpao = {
  id: string
  nome: string
  capacidade: number
  criadoEm: string
  atualizadoEm: string
}

export type GalpaoListItem = Galpao & {
  _count: { lotes: number; dispositivos: number }
}

export type Lote = {
  id: string
  quantidade: number
  dataInicio: string
  status: string
  galpoesId: string
  criadoEm: string
  atualizadoEm: string
}

export type LoteComFase = Lote & { fase: string }

export type Dispositivo = {
  id: string
  nome: string
  modelo: string
  status: StatusRegistro
  galpoesId: string
  criadoEm: string
  atualizadoEm: string
}

export type Leitura = {
  id: string
  valorLuminosidade: number
  criadoEm: string
}

export type LoteResumo = {
  id: string
  quantidade: number
  dataInicio: string
  status: string
  fase: string
}

export type DispositivoStatus = {
  id: string
  nome: string
  ultimaLeitura: { valor: number; criadoEm: string } | null
  statusLuminosidade: string
}

export type GalpaoStatus = {
  galpaoId: string
  galpaoNome: string
  loteAtivo: LoteResumo | null
  dispositivos: DispositivoStatus[]
}

export type Dashboard = {
  totalGalpoes: number
  totalLotesAtivos: number
  totalDispositivos: number
  totalAdequados: number
  galpoes: GalpaoStatus[]
}

export type ErroApi = { erro: string }
```

## Modificações necessárias no backend

As lacunas abaixo foram identificadas durante a implementação das telas da task
03 no frontend. Elas **ainda não foram aplicadas** ao backend e estão detalhadas
em arquivos próprios:

- [01 — Validar capacidade ao criar lote](backend-changes/01-validate-lote-capacity-on-create.md)
  — alta prioridade; o frontend já bloqueia, mas a API aceita quantidade acima da
  capacidade.
- [02 — Validar capacidade ao atualizar lote](backend-changes/02-validate-lote-capacity-on-update.md)
  — média prioridade; fecha o bypass pelo `PUT /api/lotes/{id}`.
- [03 — Adicionar busca de dispositivo por ID](backend-changes/03-add-get-device-by-id.md)
  — média prioridade; remove a busca sequencial por galpões no fallback da tela
  de edição.

O índice com a proposta de commits está em
[`backend-changes/README.md`](backend-changes/README.md).

## Observações para o frontend

- `fase` e `statusLuminosidade` são strings calculadas pelo backend e não têm
  enum documentado no OpenAPI. Não invente valores; confirme no backend antes de
  criar regras visuais que dependam do texto exato.
- Não há endpoint para listar todos os dispositivos sem informar o galpão.
- Não há endpoint de leitura individual nem de exclusão de leitura.
- Não há endpoint de lote individual nem de exclusão de lote.
- O dashboard já entrega os dados agregados; não recalcule totais no frontend.
- `POST /api/leituras-sensores` não deve ser chamado pela interface; é integração
  do gateway.
