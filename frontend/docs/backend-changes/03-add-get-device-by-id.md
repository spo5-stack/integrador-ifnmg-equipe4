# 03 — Adicionar busca de dispositivo por ID

- **Prioridade:** média
- **Status:** pendente
- **Endpoint proposto:** `GET /api/dispositivos/{id}`
- **Origem:** formulário de edição de dispositivo da task 03

## Problema atual

O backend não possui `GET /api/dispositivos/{id}`. Para abrir a edição de um
dispositivo com os dados atuais, o frontend usa duas estratégias:

1. `location.state.dispositivo`, enviado pelo detalhe do galpão;
2. fallback que lista os galpões e, para cada um, chama
   `GET /api/galpoes/{galpaoId}/dispositivos` até encontrar o ID.

O fallback funciona, mas faz várias requisições sequenciais, depende da primeira
página de galpões e não é adequado para um acesso direto pela URL ou para volumes
maiores de dados.

Evidências no backend:

- `src/routes/dispositivo.routes.ts` expõe listagem por galpão, criação,
  atualização e exclusão, mas não busca individual.
- `src/models/dispositivo.model.ts` já possui `buscarDispositivoPorId`, usado hoje
  apenas para verificar propriedade antes de atualizar/excluir.

## Mudança proposta

Adicionar uma rota autenticada que retorna um dispositivo do usuário logado:

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

Erros:

- `400`: `id` não é UUID válido.
- `404`: dispositivo inexistente ou pertencente a outro usuário.
- `500`: erro interno.

## Implementação

### 1. Service

Arquivo: `backend/src/services/dispositivo.service.ts`

```ts
import {
	buscarDispositivoPorId,
	// demais imports existentes
} from '../models/dispositivo.model.js'

export async function buscarDispositivoService(
	id: string,
	usuarioId: string,
) {
	const dispositivo = await buscarDispositivoPorId(id)

	if (!dispositivo || dispositivo.galpao.usuarioId !== usuarioId) {
		throw new RecursoNaoEncontradoError()
	}

	const { galpao, ...dados } = dispositivo
	return dados
}
```

O `buscarDispositivoPorId` atual já inclui `galpao.usuarioId`, então não é
necessário alterar o model. Confirme apenas que a resposta não vaza a relação
`galpao` nem dados internos.

### 2. Controller

Arquivo: `backend/src/controllers/dispositivo.controller.ts`

```ts
import {
	buscarDispositivoService,
	// demais imports existentes
} from '../services/dispositivo.service.js'

export async function buscarDispositivoController(
	request: FastifyRequest<{ Params: IdParams }>,
	reply: FastifyReply,
) {
	try {
		const dispositivo = await buscarDispositivoService(
			request.params.id,
			request.user.sub,
		)
		return reply.send(dispositivo)
	} catch (erro) {
		if (erro instanceof RecursoNaoEncontradoError) {
			return reply.status(404).send({ erro: erro.message })
		}
		request.log.error(erro)
		return reply.status(500).send({ erro: 'Erro interno do servidor' })
	}
}
```

### 3. Rota

Arquivo: `backend/src/routes/dispositivo.routes.ts`

```ts
app.route({
	method: 'GET',
	url: '/dispositivos/:id',
	schema: {
		tags: ['dispositivos'],
		summary: 'Buscar dispositivo por ID',
		params: z.object({ id: z.uuid() }),
		response: {
			200: dispositivoResponse,
			404: erroResponse,
		},
		security: [{ bearerAuth: [] }],
	},
	onRequest: [app.authenticate],
	handler: buscarDispositivoController,
})
```

Declarar a rota no mesmo plugin, mantendo o agrupamento atual. O prefixo
`/dispositivos/:id` não conflita com `/galpoes/:galpaoId/dispositivos`.

## Impacto no frontend

Depois que o endpoint existir, o fallback de `useEditarDispositivoForm` pode ser
substituído por uma chamada direta:

1. adicionar `obterDispositivo(id)` em
   `src/features/dispositivos/model/dispositivo.service.ts`;
2. manter `location.state.dispositivo` como caminho rápido;
3. se não houver state, chamar `GET /api/dispositivos/{id}` em vez de varrer os
   galpões;
4. em `404`, exibir o estado “Dispositivo não encontrado” já existente.

O restante do formulário e o `PUT /api/dispositivos/{id}` continuam iguais.

## Critérios de aceite

- [ ] Buscar um dispositivo do próprio usuário retorna `200` com o mesmo shape
      dos demais endpoints de dispositivo.
- [ ] Buscar um dispositivo de outro usuário retorna `404`.
- [ ] ID inexistente retorna `404`.
- [ ] ID fora do formato UUID retorna `400` pela validação Zod.
- [ ] A rota exige `Bearer` token.
- [ ] O OpenAPI em `/docs` exibe a nova rota.
- [ ] A resposta não inclui a relação interna `galpao` com `usuarioId`.

## Riscos e observações

- A mudança não é necessária para as telas atuais funcionarem, por isso a
  prioridade média. Ela elimina o custo N+1 e o limite prático de 100 galpões do
  fallback.
- Não crie uma rota `GET /api/dispositivos` sem filtro de galpão nesta mudança;
  isso ampliaria o escopo e exigiria paginação própria.
