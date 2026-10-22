# 02 — Validar capacidade ao atualizar lote

- **Prioridade:** média
- **Status:** pendente
- **Endpoint:** `PUT /api/lotes/{id}`
- **Depende de:** [01 — Validar capacidade ao criar lote](01-validate-lote-capacity-on-create.md)

## Problema atual

A rota `PUT /api/lotes/{id}` aceita `quantidade` opcional e o service apenas
verifica se o lote pertence ao usuário e se `dataInicio` não é futura. Não há
comparação com a capacidade do galpão.

Evidências no backend:

- `src/routes/lote.routes.ts`: `quantidade` é `z.number().int().positive().optional()`.
- `src/services/lote.service.ts`, em `atualizarLoteService`, envia a quantidade
  diretamente para `atualizarLote`.
- `buscarLotePorId` inclui apenas `galpao.usuarioId`, sem `capacidade`.

Sem essa validação, a correção da criação do lote pode ser contornada chamando o
endpoint de atualização.

## Regra proposta

Quando a quantidade for enviada, ela deve respeitar a capacidade do galpão do
lote.

```text
quantidade <= capacidade do galpão
```

Para lotes `ATIVO`, rejeitar quantidade maior com `400`. Para lotes
`DESATIVADO`, manter a atualização permitida: o lote já foi encerrado e a
capacidade atual do galpão pode ser menor que a quantidade histórica, já que o
backend permite reduzir a capacidade quando não há lote ativo.

Caso o produto decida que lotes encerrados também devem respeitar a capacidade
atual, basta remover a condição de status indicada abaixo.

## Implementação

### 1. Retornar a capacidade em `buscarLotePorId`

Arquivo: `backend/src/models/lote.model.ts`

```ts
export async function buscarLotePorId(id: string) {
	return prisma.lotes.findUnique({
		where: { id },
		include: {
			galpao: {
				select: {
					usuarioId: true,
					capacidade: true,
				},
			},
		},
	})
}
```

### 2. Validar no service

Arquivo: `backend/src/services/lote.service.ts`

```ts
import { QuantidadeExcedeCapacidadeError } from './errors/quantidade-excede-capacidade.error.js'

// dentro de atualizarLoteService, após validar a propriedade do lote
if (
	lote.status === 'ATIVO' &&
	dados.quantidade !== undefined &&
	dados.quantidade > lote.galpao.capacidade
) {
	throw new QuantidadeExcedeCapacidadeError(lote.galpao.capacidade)
}
```

A classe de erro é a mesma da mudança 01.

### 3. Mapear o erro no controller

Arquivo: `backend/src/controllers/lote.controller.ts`, no `catch` de
`atualizarLoteController`:

```ts
if (erro instanceof QuantidadeExcedeCapacidadeError) {
	return reply.status(400).send({ erro: erro.message })
}
```

### 4. Documentar `400` na rota

Arquivo: `backend/src/routes/lote.routes.ts`, em `PUT /lotes/:id`:

```ts
response: {
	200: /* schema existente */,
	400: z.object({ erro: z.string() }),
	404: z.object({ erro: z.string() }),
}
```

## Exemplo de contrato

```http
PUT /api/lotes/8c2a...
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantidade": 5000
}
```

Em um galpão com capacidade 1200 e lote ativo:

```http
HTTP/1.1 400 Bad Request

{
  "erro": "A quantidade não pode exceder a capacidade do galpão (1200 aves)"
}
```

## Critérios de aceite

- [ ] Atualizar apenas `dataInicio` não aplica a validação de quantidade.
- [ ] Lote ativo com `quantidade` igual à capacidade é atualizado com `200`.
- [ ] Lote ativo com `quantidade` maior que a capacidade retorna `400`.
- [ ] Lote de outro usuário continua retornando `404`.
- [ ] Data futura continua retornando `400`.
- [ ] OpenAPI documenta a resposta `400` da atualização.
- [ ] O frontend atual não é impactado (não existe tela de edição de lote).

## Riscos e observações

- O frontend da task 03 não edita lotes. Esta mudança protege o contrato para
  qualquer cliente que use `PUT /api/lotes/{id}`.
- Se a capacidade do galpão for alterada entre a leitura e a atualização, a
  validação usa o valor lido no momento da requisição. O risco de concorrência é
  o mesmo já existente nas demais validações de domínio.
