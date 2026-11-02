# Backend — Monitoramento de Luminosidade para Galpões Avícolas

API REST do sistema de monitoramento de luminosidade em galpões de criação de aves.

**Stack:** Fastify 5 + Prisma 7 + MySQL + Zod 4 + TypeScript 6 + dayjs + argon2 + Nodemailer

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
| `CORS_ORIGIN` | Não | `http://localhost:5173` | Origem permitida pelo CORS |
| `SMTP_HOST` | Não* | — | Servidor SMTP para recuperação de senha |
| `SMTP_PORT` | Não | `587` | Porta SMTP |
| `SMTP_SECURE` | Não | `false` | `true` para TLS direto (porta 465) |
| `SMTP_USER` | Não* | — | Usuário SMTP (e-mail) |
| `SMTP_PASS` | Não* | — | Senha de app SMTP |
| `MAIL_FROM` | Não | `SMTP_USER` | Remetente exibido no e-mail |

\* Obrigatórias apenas para enviar e-mails de recuperação. Sem elas, em
`development`, o código é impresso no log do servidor. Veja
[`docs/configuracao-email-recuperacao-senha.md`](docs/configuracao-email-recuperacao-senha.md).

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

### Recuperação de senha

O fluxo usa e-mail (Nodemailer/SMTP) e possui três rotas públicas:

```text
POST /api/auth/forgot-password   → envia código de 6 dígitos
POST /api/auth/verify-reset-code → valida o código e devolve resetToken
POST /api/auth/reset-password    → troca a senha e invalida sessões antigas
```

Configuração de e-mail e solução de problemas:
[`docs/configuracao-email-recuperacao-senha.md`](docs/configuracao-email-recuperacao-senha.md).

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
│   ├── mail/mailer.ts     # Envio de e-mail (Nodemailer/SMTP)
│   └── utils/
│       ├── fase.ts        # calcularFase() — fase da ave
│       └── rate-limit.ts  # Rate limit em memória
├── models/                # Acesso ao banco + schemas Zod
│   ├── auth.model.ts
│   ├── dispositivo.model.ts
│   ├── galpao.model.ts
│   ├── leitura-sensor.model.ts
│   ├── lote.model.ts
│   ├── recuperacao-senha.model.ts
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
| POST | `/api/auth/forgot-password` | Solicitar código de recuperação de senha |
| POST | `/api/auth/verify-reset-code` | Verificar código e obter resetToken |
| POST | `/api/auth/reset-password` | Redefinir senha com resetToken |
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
| GET | `/api/dispositivos/:id` | Buscar dispositivo por ID |
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
