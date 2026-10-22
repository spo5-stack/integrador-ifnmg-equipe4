# 01 — Validar capacidade ao criar lote

- **Prioridade:** alta
- **Status:** pendente
- **Endpoint:** `POST /api/galpoes/{galpaoId}/lotes`
- **Origem:** regra identificada durante a implementação de `CadastrarLoteView`

## Problema atual

A rota aceita `quantidade` inteira positiva e `dataInicio` não futura, mas não
compara a quantidade com a capacidade do galpão.

Evidências no backend:

- `src/routes/lote.routes.ts` valida apenas `quantidade > 0` e o formato da data.
- `src/services/lote.service.ts`, em `criarLoteService`, valida existência do
  galpão, data futura e lote ativo, mas não a capacidade.
- `buscarGalpaoPorId` já retorna `capacidade`, então o dado está disponível sem
  consulta extra.

Consequência: uma chamada direta à API consegue criar um lote com mais aves do
que o galpão comporta. O frontend bloqueia esse caso, mas a regra precisa ser
garantida no servidor.

## Regra proposta

Manter as validações atuais e adicionar:

| Condição                          | Resultado                                            |
| --------------------------------- | ---------------------------------------------------- |
| `quantidade <= galpao.capacidade` | permitido                                            |
| `quantidade > galpao.capacidade`  | rejeitado com `400` e mensagem de capacidade         |
| `quantidade == galpao.capacidade` | permitido (a capacidade é o limite, não o excedente) |

Ordem das checagens em `criarLoteService`:

1. Galpão existe e pertence ao usuário autenticado (`404`).
2. `dataInicio` não está no futuro (`400`).
3. Não existe lote ativo no galpão (`409`).
4. Quantidade não excede a capacidade (`400`).

A checagem de lote ativo vem antes para preservar o `409` já documentado e
esperado pelo frontend.

## Implementação

### 1. Criar a classe de erro

Arquivo: `backend/src/services/errors/quantidade-excede-capacidade.error.ts`

```ts
export class QuantidadeExcedeCapacidadeError extends Error {
	constructor(capacidade: number) {
		super(
			`A quantidade não pode exceder a capacidade do galpão (${capacidade} aves)`,
		)
	}
}
```

### 2. Validar no service

Arquivo: `backend/src/services/lote.service.ts`

```ts
import { QuantidadeExcedeCapacidadeError } from './errors/quantidade-excede-capacidade.error.js'

// dentro de criarLoteService, depois da checagem de lote ativo
if (dados.quantidade > galpao.capacidade) {
	throw new QuantidadeExcedeCapacidadeError(galpao.capacidade)
}
```

### 3. Mapear o erro para HTTP no controller

Arquivo: `backend/src/controllers/lote.controller.ts`

```ts
import { QuantidadeExcedeCapacidadeError } from '../services/errors/quantidade-excede-capacidade.error.js'

// dentro do catch de criarLoteController
if (erro instanceof QuantidadeExcedeCapacidadeError) {
	return reply.status(400).send({ erro: erro.message })
}
```

### 4. Documentar a resposta no OpenAPI

Arquivo: `backend/src/routes/lote.routes.ts`, na resposta de
`POST /galpoes/:galpaoId/lotes`:

```ts
response: {
	201: /* schema existente */,
	400: z.object({ erro: z.string() }),
	404: z.object({ erro: z.string() }),
	409: z.object({ erro: z.string() }),
}
```

Adicionar `400` e `404` também documenta erros que o controller já retorna.

## Exemplo de contrato

Requisição:

```http
POST /api/galpoes/5f0c.../lotes
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantidade": 1201,
  "dataInicio": "2026-10-01T00:00:00.000Z"
}
```

Resposta com galpão de capacidade 1200:

```http
HTTP/1.1 400 Bad Request

{
  "erro": "A quantidade não pode exceder a capacidade do galpão (1200 aves)"
}
```

## Critérios de aceite

- [ ] `quantidade` igual à capacidade retorna `201`.
- [ ] `quantidade` maior que a capacidade retorna `400` com a mensagem proposta.
- [ ] A validação usa a capacidade do galpão informado na rota, nunca um valor do
      cliente.
- [ ] Galpão de outro usuário continua retornando `404`.
- [ ] Lote ativo continua retornando `409`.
- [ ] O OpenAPI em `/docs` exibe a resposta `400` para a rota.
- [ ] O frontend continua exibindo a mensagem retornada pelo backend.

## Riscos e observações

- A checagem no service não é atômica. Duas requisições simultâneas podem passar
  pela contagem de lote ativo e pela capacidade antes de qualquer inserção. Esse
  risco já existe hoje para a regra de lote único; uma solução definitiva exige
  transação/constraint no banco e deve ser tratada em uma mudança separada.
- Não altere o limite de capacidade no cadastro de galpão; ele já exige inteiro
  positivo.
- O frontend valida a capacidade em `validarLote` e trata `400` com a mensagem do
  backend. Nenhuma alteração no frontend é necessária para consumir esta mudança.
