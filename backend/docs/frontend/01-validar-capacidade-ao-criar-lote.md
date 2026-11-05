# 01 — Validar capacidade ao criar lote

- **Status:** implementado
- **Data:** 02/11/2026
- **Endpoint:** `POST /api/galpoes/{galpaoId}/lotes`
- **Origem:** regra identificada durante a implementação de `CadastrarLoteView`

## O que mudou no backend

A criação de lote agora valida a quantidade informada contra a capacidade do
galpão. Antes, a API aceitava `quantidade` maior que `galpao.capacidade` quando
chamada diretamente.

Arquivos alterados:

- `src/services/errors/quantidade-excede-capacidade.error.ts` (novo)
- `src/services/lote.service.ts`
- `src/controllers/lote.controller.ts`
- `src/routes/lote.routes.ts`

Não houve alteração de schema nem migration.

## Regra aplicada

A validação usa sempre a capacidade do galpão buscado no banco, nunca um valor
enviado pelo cliente.

| Condição                          | Resultado                                    |
| --------------------------------- | -------------------------------------------- |
| `quantidade <= galpao.capacidade` | permitido                                    |
| `quantidade == galpao.capacidade` | permitido (a capacidade é o limite)          |
| `quantidade > galpao.capacidade`  | rejeitado com `400` e mensagem de capacidade |

Ordem das checagens em `criarLoteService` (a primeira que falhar define a
resposta):

1. Galpão não existe ou pertence a outro usuário → `404`
2. `dataInicio` está no futuro → `400`
3. Já existe lote ativo no galpão → `409`
4. Quantidade excede a capacidade → `400`

> A checagem de lote ativo continua antes da capacidade para preservar o `409`
> já esperado pelo frontend.

## Contrato da resposta de erro

Mensagem retornada:

```text
A quantidade não pode exceder a capacidade do galpão (N aves)
```

Exemplo com galpão de capacidade `1200`:

```http
POST /api/galpoes/5f0c.../lotes
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantidade": 1201,
  "dataInicio": "2026-10-01T00:00:00.000Z"
}
```

```http
HTTP/1.1 400 Bad Request

{
  "erro": "A quantidade não pode exceder a capacidade do galpão (1200 aves)"
}
```

## OpenAPI

A rota `POST /api/galpoes/{galpaoId}/lotes` agora documenta as respostas:

- `201` — lote criado
- `400` — data de início futura ou quantidade acima da capacidade
- `404` — galpão não encontrado ou de outro usuário
- `409` — já existe lote ativo

Os erros usam o envelope `{ "erro": "mensagem" }`.

## Impacto no frontend

**Nenhuma alteração obrigatória.** O frontend já valida a capacidade localmente
em `validarLote` e já trata `400` exibindo a mensagem do backend.

Recomendações para refletir a mudança:

- Continuar exibindo `response.data.erro` em respostas `400`, sem substituir
  pela mensagem genérica de validação local.
- Manter a validação local como feedback imediato; o backend agora é a fonte de
  verdade.
- Se a tela tiver tratamento específico por status, considerar a precedência
  acima (`404` → `400` data → `409` lote ativo → `400` capacidade).

## Critérios de aceite

- [x] `quantidade` igual à capacidade retorna `201`.
- [x] `quantidade` maior que a capacidade retorna `400` com a mensagem proposta.
- [x] A validação usa a capacidade do galpão informado na rota.
- [x] Galpão de outro usuário continua retornando `404`.
- [x] Lote ativo continua retornando `409`.
- [x] O OpenAPI em `/docs` exibe a resposta `400` para a rota.
- [x] O frontend não precisa de alteração para consumir a mudança.

## Observação sobre concorrência

A checagem não é atômica: duas requisições simultâneas podem passar pela
contagem de lote ativo e pela validação de capacidade antes de qualquer
inserção. Esse risco já existia para a regra de lote único; uma solução
definitiva exige transação ou constraint no banco e deve ser tratada em uma
mudança separada.
