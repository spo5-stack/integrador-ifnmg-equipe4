# Modificações necessárias no backend

Este diretório reúne as lacunas de regra de negócio e de contrato identificadas
durante a implementação das telas da task 03 no frontend. **Nenhuma alteração foi
aplicada ao backend nesta entrega**; cada arquivo descreve uma mudança pequena,
com passos de implementação, critérios de aceite e impacto no frontend.

## Resumo

| #   | Mudança                                                       | Prioridade | Status   | Impacto no frontend                                                            |
| --- | ------------------------------------------------------------- | ---------- | -------- | ------------------------------------------------------------------------------ |
| 01  | Validar quantidade do lote contra a capacidade na criação     | Alta       | Pendente | O frontend já bloqueia, mas a API ainda aceita quantidade acima da capacidade  |
| 02  | Validar quantidade do lote contra a capacidade na atualização | Média      | Pendente | Fecha o bypass via `PUT /api/lotes/{id}`                                       |
| 03  | Adicionar `GET /api/dispositivos/{id}`                        | Média      | Pendente | Remove a busca sequencial em todos os galpões ao abrir a edição por URL direta |

## Arquivos

- [01 — Validar capacidade ao criar lote](01-validate-lote-capacity-on-create.md)
- [02 — Validar capacidade ao atualizar lote](02-validate-lote-capacity-on-update.md)
- [03 — Adicionar busca de dispositivo por ID](03-add-get-device-by-id.md)

## Ordem sugerida de implementação

1. Mudança **01** primeiro, porque fecha a regra principal e já introduz a classe
   de erro e o mapeamento HTTP reutilizados pela mudança **02**.
2. Mudança **02** em seguida, para que o mesmo invariante não possa ser
   contornado pela atualização do lote.
3. Mudança **03** por último, pois é uma melhoria de contrato e não bloqueia as
   telas atuais.

## Proposta de commits

Seguindo o padrão do repositório (`tipo: descrição` em inglês, minúscula, no
imperativo e sem ponto final), os commits podem ser divididos assim:

### 1. Documentação

```text
docs: document backend capacity and device lookup changes
```

Arquivos:

- `frontend/docs/api-routes.md`
- `frontend/docs/backend-changes/README.md`
- `frontend/docs/backend-changes/01-validate-lote-capacity-on-create.md`
- `frontend/docs/backend-changes/02-validate-lote-capacity-on-update.md`
- `frontend/docs/backend-changes/03-add-get-device-by-id.md`

> Os caminhos acima são relativos à raiz do monorepo.

### 2. Capacidade na criação do lote

```text
feat: validate lote quantity against galpao capacity
```

Arquivos esperados:

- `backend/src/services/errors/quantidade-excede-capacidade.error.ts` (novo)
- `backend/src/services/lote.service.ts`
- `backend/src/controllers/lote.controller.ts`
- `backend/src/routes/lote.routes.ts`

### 3. Capacidade na atualização do lote

```text
feat: validate lote capacity on update
```

Arquivos esperados:

- `backend/src/models/lote.model.ts`
- `backend/src/services/lote.service.ts`
- `backend/src/controllers/lote.controller.ts`
- `backend/src/routes/lote.routes.ts`

### 4. Busca individual de dispositivo

```text
feat: add get device by id endpoint
```

Arquivos esperados:

- `backend/src/services/dispositivo.service.ts`
- `backend/src/controllers/dispositivo.controller.ts`
- `backend/src/routes/dispositivo.routes.ts`

## Observações

- Os três commits de código devem deixar o backend compilando e funcional de
  forma independente.
- Não inclua `node_modules`, `dist`, arquivos `.env` ou artefatos gerados.
- Não faça push sem autorização explícita.
- O frontend atual não depende dessas mudanças para funcionar: ele valida a
  capacidade localmente e usa um fallback para localizar o dispositivo pela
  listagem do galpão. As mudanças são necessárias para garantir o invariante no
  servidor e simplificar o contrato.
