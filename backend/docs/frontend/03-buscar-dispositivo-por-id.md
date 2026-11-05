# 03 — Buscar dispositivo por ID

- **Status:** implementado
- **Data:** 02/11/2026
- **Endpoint novo:** `GET /api/dispositivos/{id}`
- **Origem:** formulário de edição de dispositivo da task 03

## O que mudou no backend

Foi adicionada uma rota autenticada para buscar um dispositivo individualmente,
sem precisar varrer os galpões. A rota reutiliza `buscarDispositivoPorId`, que já
incluía a relação necessária para validar a propriedade, e remove essa relação
interna da resposta.

Arquivos alterados:

- `src/services/dispositivo.service.ts` — novo `buscarDispositivoService`
- `src/controllers/dispositivo.controller.ts` — novo
  `buscarDispositivoController`
- `src/routes/dispositivo.routes.ts` — nova rota `GET /dispositivos/:id`

Não houve alteração de model, schema ou migration.

## Contrato

```http
GET /api/dispositivos/{id}
Authorization: Bearer <token>
```

Resposta `200`:

```json
{
  "id": "uuid",
  "nome": "Sensor LDR 01",
  "modelo": "LDR-5528",
  "status": "ATIVO",
  "galpoesId": "uuid",
  "criadoEm": "2026-10-22T18:00:00.000Z",
  "atualizadoEm": "2026-10-22T18:00:00.000Z"
}
```

O shape é o mesmo dos endpoints de criação, listagem e atualização de
dispositivo. A relação interna `galpao` (com `usuarioId`) **não** é retornada.

### Erros

| Status | Situação                                          |
| ------ | ------------------------------------------------- |
| `400`  | `id` fora do formato UUID (validação Zod)         |
| `401`  | Token ausente ou inválido                         |
| `404`  | Dispositivo inexistente ou de outro usuário       |
| `500`  | Erro interno                                      |

## Impacto no frontend

O endpoint permite remover o fallback N+1 do formulário de edição de
dispositivo. Sugestão de fluxo:

1. Manter `location.state.dispositivo` como caminho rápido.
2. Se não houver state, chamar `GET /api/dispositivos/{id}` em vez de listar
   galpões e dispositivos.
3. Em `404`, exibir o estado “Dispositivo não encontrado” já existente.
4. O restante do formulário e o `PUT /api/dispositivos/{id}` continuam iguais.

Exemplo de serviço no frontend:

```ts
export async function obterDispositivo(id: string): Promise<Dispositivo> {
  const { data } = await api.get<Dispositivo>(`/dispositivos/${id}`)
  return data
}
```

## OpenAPI

A rota aparece em `/docs` com:

- `200` — dispositivo encontrado
- `404` — dispositivo não encontrado

## Critérios de aceite

- [x] Buscar um dispositivo do próprio usuário retorna `200` com o mesmo shape
      dos demais endpoints.
- [x] Buscar um dispositivo de outro usuário retorna `404`.
- [x] ID inexistente retorna `404`.
- [x] ID fora do formato UUID retorna `400` pela validação Zod.
- [x] A rota exige `Bearer` token.
- [x] O OpenAPI em `/docs` exibe a nova rota.
- [x] A resposta não inclui a relação interna `galpao` com `usuarioId`.

## Observação

Não foi criada uma rota `GET /api/dispositivos` sem filtro de galpão. Isso
ampliaria o escopo e exigiria paginação própria.
