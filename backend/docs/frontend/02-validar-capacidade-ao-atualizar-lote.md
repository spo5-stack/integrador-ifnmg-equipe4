# 02 — Validar capacidade ao atualizar lote

- **Status:** implementado
- **Data:** 02/11/2026
- **Endpoint:** `PUT /api/lotes/{id}`
- **Depende de:** 01 — Validar capacidade ao criar lote

## O que mudou no backend

A atualização de lote agora valida a quantidade contra a capacidade do galpão
quando o lote está `ATIVO`. Isso fecha o contorno da regra implementada na
criação: antes, era possível criar um lote dentro da capacidade e depois
aumentá-lo acima do limite via `PUT`.

Arquivos alterados:

- `src/models/lote.model.ts` — `buscarLotePorId` passou a retornar
  `galpao.capacidade`
- `src/services/lote.service.ts` — validação em `atualizarLoteService`
- `src/controllers/lote.controller.ts` — mapeamento do erro para `400`
- `src/routes/lote.routes.ts` — documentação de `400` e `404` no OpenAPI

Não houve alteração de schema nem migration. A classe de erro
`QuantidadeExcedeCapacidadeError` é a mesma da mudança 01.

## Regra aplicada

Quando `quantidade` é enviada no corpo:

| Situação do lote | Quantidade enviada         | Resultado                        |
| ---------------- | -------------------------- | -------------------------------- |
| `ATIVO`          | `<= galpao.capacidade`     | atualização permitida (`200`)    |
| `ATIVO`          | `> galpao.capacidade`      | rejeitada com `400`              |
| `DESATIVADO`     | qualquer valor positivo    | atualização permitida (`200`)    |
| qualquer         | campo `quantidade` ausente | sem validação de capacidade      |

Lotes encerrados (`DESATIVADO`) não são validados porque a capacidade do galpão
pode ter sido reduzida depois do encerramento, e a quantidade ali é histórica.

## Ordem das checagens em `atualizarLoteService`

1. Lote existe e pertence ao usuário autenticado → senão `404`
2. Se o lote está `ATIVO` e `quantidade` foi enviada, compara com a capacidade
   do galpão → senão `400`
3. `dataInicio`, quando enviada, não pode estar no futuro → senão `400`
4. Atualização é persistida → `200`

Atualizar apenas `dataInicio` (sem `quantidade`) não dispara a validação de
capacidade.

## Contrato da resposta de erro

Mensagem retornada:

```text
A quantidade não pode exceder a capacidade do galpão (N aves)
```

Exemplo com galpão de capacidade `1200` e lote `ATIVO`:

```http
PUT /api/lotes/8c2a...
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantidade": 5000
}
```

```http
HTTP/1.1 400 Bad Request

{
  "erro": "A quantidade não pode exceder a capacidade do galpão (1200 aves)"
}
```

## OpenAPI

A rota `PUT /api/lotes/{id}` agora documenta:

- `200` — lote atualizado
- `400` — data de início futura ou quantidade acima da capacidade
- `404` — lote não encontrado ou de outro usuário

## Impacto no frontend

**Nenhuma alteração obrigatória.** O frontend atual não possui tela de edição de
lote; a mudança protege o contrato para qualquer cliente que use
`PUT /api/lotes/{id}`.

Se uma tela de edição for criada futuramente:

- Enviar apenas os campos alterados; omitir `quantidade` evita a validação.
- Exibir `response.data.erro` em respostas `400`.
- Considerar a precedência: `404` (propriedade) → `400` (capacidade) →
  `400` (data futura).
- Para lotes `DESATIVADO`, a API aceita quantidade acima da capacidade atual.

## Critérios de aceite

- [x] Atualizar apenas `dataInicio` não aplica a validação de quantidade.
- [x] Lote ativo com `quantidade` igual à capacidade é atualizado com `200`.
- [x] Lote ativo com `quantidade` maior que a capacidade retorna `400`.
- [x] Lote de outro usuário continua retornando `404`.
- [x] Data futura continua retornando `400`.
- [x] OpenAPI documenta a resposta `400` da atualização.
- [x] O frontend atual não é impactado.

## Observação sobre concorrência

A validação usa a capacidade lida no momento da requisição. Se a capacidade do
galpão mudar entre a leitura e a atualização, o risco é o mesmo já existente nas
demais validações de domínio; não há transação nem constraint de banco para esse
invariante.
