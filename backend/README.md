# Backend — Monitoramento de Luminosidade para Galpões Avícolas

API REST do sistema de monitoramento de luminosidade em galpões de criação de aves.

**Stack:** Fastify 5 + Prisma 7 + MySQL + Zod 4 + TypeScript 6 + dayjs + argon2

---

## Pré-requisitos

- Node.js 24
- Docker (para o MySQL)
- npm

---

## Começando

### 1. Suba o MySQL

```bash
docker compose up -d
```

Isso cria um container MySQL 8.0 com as credenciais:

| Variável | Valor |
|---|---|
| Database | `integrador` |
| Usuário | `app` |
| Senha | `app` |
| Porta | `3306` |

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` se necessário. As variáveis disponíveis:

| Variável | Obrigatória | Default | Descrição |
|---|---|---|---|
| `PORT` | Não | `3333` | Porta do servidor |
| `NODE_ENV` | Não | `development` | Ambiente (`development`, `test`, `production`) |
| `API_URL` | Não | `http://localhost:3333` | URL base para documentação Swagger |
| `DATABASE_URL` | **Sim** | — | URL de conexão MySQL |
| `JWT_SECRET` | **Sim** | — | Chave secreta para tokens JWT |

### 3. Instale as dependências

```bash
npm install
```

### 4. Gere o Prisma Client

```bash
npx prisma generate
```

### 5. Execute as migrations

```bash
npx prisma migrate dev
```

### 6. Inicie o servidor

```bash
npm run dev
```

O servidor estará em `http://localhost:3333`.

---

## Documentação da API

Acesse a interface interativa:

| URL | Descrição |
|---|---|
| `http://localhost:3333/docs` | Documentação Scalar (recomendada) |


Todas as rotas autenticadas exigem o header `Authorization: Bearer <token>`.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor com hot-reload |
| `npx prisma migrate dev` | Executa migrations pendentes |
| `npx prisma generate` | Gera o Prisma Client |
| `npx prisma studio` | Abre o Prisma Studio (interface gráfica do banco) |

---

## Estrutura do projeto

```
src/
├── app.ts                 # Setup Fastify, JWT, Swagger, rotas
├── server.ts              # Entry point
├── env/index.ts           # Validação de variáveis de ambiente (Zod)
├── shared/
│   ├── database/prisma.ts # Instância do PrismaClient
│   └── utils/fase.ts      # calcularFase() — cálculo dinâmico da fase da ave
├── models/                # Acesso ao banco + schemas Zod
│   ├── auth.model.ts
│   ├── dispositivo.model.ts
│   ├── galpao.model.ts
│   ├── leitura-sensor.model.ts
│   ├── lote.model.ts
│   └── usuario.model.ts
├── services/              # Regras de negócio
│   ├── auth.service.ts
│   ├── dispositivo.service.ts
│   ├── galpao.service.ts
│   ├── leitura-sensor.service.ts
│   ├── lote.service.ts
│   ├── monitoramento.service.ts
│   ├── usuario.service.ts
│   └── errors/            # Classes de erro (1 por arquivo)
├── controllers/           # Handlers HTTP
│   ├── auth.controller.ts
│   ├── dispositivo.controller.ts
│   ├── galpao.controller.ts
│   ├── leituras-sensor.controller.ts
│   ├── lote.controller.ts
│   ├── monitoramento.controller.ts
│   └── usuario.controller.ts
└── routes/                # Definição de rotas
    ├── auth.routes.ts
    ├── dispositivo.routes.ts
    ├── galpao.routes.ts
    ├── leituras-sensor.routes.ts
    ├── lote.routes.ts
    ├── monitoramento.routes.ts
    └── usuario.routes.ts
```

---

## Endpoints

### Públicos
| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register` | Cadastrar usuário |
| POST | `/api/auth/login` | Fazer login |
| POST | `/api/leituras-sensores` | Gateway envia leituras |

### Autenticados (Bearer Token)
| Método | Rota | Descrição |
|---|---|---|
| PATCH | `/api/usuarios/nome` | Alterar nome |
| PATCH | `/api/usuarios/senha` | Alterar senha |
| DELETE | `/api/usuarios` | Excluir conta |
| POST | `/api/galpoes` | Criar galpão |
| GET | `/api/galpoes` | Listar galpões |
| GET | `/api/galpoes/:id` | Detalhe do galpão |
| PUT | `/api/galpoes/:id` | Editar galpão |
| DELETE | `/api/galpoes/:id` | Excluir galpão |
| POST | `/api/galpoes/:galpaoId/lotes` | Criar lote |
| GET | `/api/galpoes/:galpaoId/lotes` | Listar lotes |
| PUT | `/api/lotes/:id` | Editar lote |
| PATCH | `/api/lotes/:id/encerrar` | Encerrar lote |
| POST | `/api/galpoes/:galpaoId/dispositivos` | Cadastrar dispositivo |
| GET | `/api/galpoes/:galpaoId/dispositivos` | Listar dispositivos |
| PUT | `/api/dispositivos/:id` | Editar dispositivo |
| DELETE | `/api/dispositivos/:id` | Remover dispositivo |
| GET | `/api/dispositivos/:dispositivosId/leituras` | Histórico de leituras |
| GET | `/api/galpoes/:id/status` | Status do galpão |
| GET | `/api/dashboard` | Dashboard geral |

---

## Comandos úteis

```bash
# Parar o container MySQL
docker compose down

# Limpar o banco e recriar do zero
docker compose down -v
docker compose up -d
npx prisma migrate dev

# Abrir o banco no navegador
npx prisma studio

# Verificar lint
npx biome check src/
```
