# Gateway — Ponte entre Arduino e Backend

Ponte que recebe as leituras de luminosidade do Arduino via porta Serial e envia imediatamente para o backend via HTTP.

**Stack:** Node.js + SerialPort + Zod 4 + TypeScript

---

## Visão Geral

```
Arduino (LDR) → Serial → Gateway → HTTP POST → Backend (Fastify)
                 JSON +\n    1 leitura      [{"luminosidade":71,"dispositivosId":"uuid"}]
```

## Pré-requisitos

- Node.js 24
- Arduino com sensor LDR conectado via USB
- Backend rodando (para onde as leituras serão enviadas)

---

## Começando

### 1. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com as configurações corretas:

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `PORTA_SERIAL` | Não | `/dev/ttyACM0` | Porta serial do Arduino |
| `VELOCIDADE_SERIAL` | Não | `9600` | Baud rate da comunicação serial |
| `DISPOSITIVOS_ID` | **Sim** | — | UUID do dispositivo cadastrado no backend |
| `URL_BACKEND` | Não | `http://localhost:3333/api/leituras-sensores` | Endpoint de leituras |

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o gateway

```bash
npm run start:gateway
```

---

## Sobre o DISPOSITIVOS_ID

O `DISPOSITIVOS_ID` é o UUID que identifica este gateway no backend. Ele é **único por dispositivo físico** (Arduino + LDR) e deve ser cadastrado primeiro no backend.

### Passo a passo para obter o UUID

1. Faça login no backend (`POST /api/auth/login`)
2. Cadastre um dispositivo em um galpão:

```bash
POST /api/galpoes/:galpaoId/dispositivos
Authorization: Bearer <token>

{
  "nome": "Sensor LDR Galpão A"
}
```

3. O backend retorna o UUID do dispositivo criado:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "Sensor LDR Galpão A",
  "status": "ATIVO"
}
```

4. Copie o `id` retornado e cole no `.env` do gateway como `DISPOSITIVOS_ID`.

### O que acontece se o UUID for inválido?

Quando o gateway envia uma leitura com um UUID que não existe ou está `DESATIVADO`, o backend retorna **HTTP 422**. O gateway então:

- Fecha a porta serial
- Exibe a mensagem: `Dispositivo {uuid} inválido ou desativado. Encerrando...`
- Encerra o processo (`exit 1`)

Isso é proposital — um UUID errado no `.env` é um **erro de configuração permanente** e não vai se resolver sozinho.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run start:gateway` | Inicia o gateway com hot-reload |

---

## Comportamento

### Reconexão serial

Se o cabo USB cair ou o Arduino for desconectado:

- Tenta reconectar a cada 5s
- Incrementa 5s a cada falha até o teto de 60s
- Ao conectar, volta para 5s

### Tratamento de erros

| Resposta HTTP | Ação |
|---|---|
| **201** | Leitura enviada com sucesso |
| **422** | Dispositivo inválido — encerra o processo |
| **5xx** | Erro de servidor — descarta a leitura e aguarda a próxima |
| **Network error** | Backend offline — descarta a leitura e aguarda a próxima |
