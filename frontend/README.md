# Frontend - Integrador IFNMG Equipe 4

Aplicação web para visualização e gerenciamento de dados IoT de galpões avícolas. Desenvolvida com Vite 8, React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui e TanStack Query.

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| [Vite](https://vitejs.dev/) | 8.x | Bundler e servidor de desenvolvimento |
| [React](https://react.dev/) | 19.x | Biblioteca UI |
| [TypeScript](https://www.typescriptlang.org/) | 6.x | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Estilização (CSS-first com `@theme`) |
| [shadcn/ui](https://ui.shadcn.com/) | base-nova | Componentes UI (baseados em `@base-ui/react`) |
| [React Router DOM](https://reactrouter.com/) | 7.x | Roteamento |
| [TanStack Query](https://tanstack.com/query) | 5.x | Cache, sincronização e atualizações em tempo real |
| [React Hook Form](https://react-hook-form.com/) | 7.x | Formulários |
| [Zod](https://zod.dev/) | 4.x | Validação de schemas |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP |
| [Day.js](https://day.js.org/) | 1.x | Formatação de datas/horas |

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) (usar `package-lock.json`)
- Backend rodando na porta `3333` (ou configurar a URL da API)

## Instalação e execução

### 1) Instalar dependências

```bash
npm install
```

### 2) Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `frontend/` (baseado em `.env.example`, caso exista):

```env
VITE_API_URL=http://localhost:3333/api
```

> O cliente HTTP está em `src/services/api.ts`. Caso não seja definida, a aplicação usa o valor padrão configurado lá.

### 3) Rodar em desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173` (porta padrão do Vite).

### 4) Build para produção

```bash
npm run build
```

Esse comando executa `tsc -b && vite build`. É o modo mais confiável para validação completa de tipos.

### 5) Preview do build

```bash
npm run preview
```

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento Vite |
| `npm run build` | Verificação de tipos + build de produção |
| `npm run preview` | Servidor local para testar o build gerado |
| `npm run lint` | Executa ESLint (ignora `dist/`) |
| `npm run format` | Formata arquivos `*.ts` e `*.tsx` com Prettier |
| `npm run typecheck` | Roda `tsc` com `tsconfig` vazio (não valida o código fonte). Prefira `npx tsc -p tsconfig.app.json --noEmit` ou `npm run build` |

## Estrutura de pastas

```text
src/
├── App.tsx                # Configuração de rotas, QueryClient, AuthProvider
├── main.tsx               # Ponto de entrada
├── index.css              # Tailwind v4 CSS-first + tokens semânticos
├── components/            # Componentes reutilizáveis
│   ├── ui/                # Componentes shadcn/ui (@base-ui/react)
│   ├── layout/            # Layout da aplicação (Sidebar/AppShell)
│   └── feedback/          # Banners/erros de requisição
├── config/
│   └── realtime.ts        # Intervalo centralizado para atualizações em tempo real
├── contexts/
│   └── AuthContext.tsx    # Estado de autenticação/sessão
├── hooks/                 # Hooks customizados (TanStack Query)
├── interfaces/            # Tipagens TypeScript (DTOs/interfaces)
├── lib/                   # Utilitários (cn, datas, etc.)
├── pages/                 # Telas por domínio
│   ├── auth/              # Login, Cadastro, Recuperação de senha, Perfil
│   ├── dashboard/         # Dashboard principal
│   ├── galpoes/           # Galpões, detalhes, lotes, dispositivos
│   ├── lotes/             # Cadastro de lote
│   └── dispositivos/      # Cadastro/edição/leituras de dispositivos
├── routes/                # Definição de rotas
└── services/              # Chamadas HTTP (axios)
```

## Como funciona

### Autenticação

- Rotas públicas: `/login`, `/cadastro`, `/recuperar-senha`
- Rotas privadas: protegidas pelo `AuthContext`. Ao acessar `/`, o app verifica a sessão.
- O cliente HTTP (`src/services/api.ts`) adiciona o token nas requisições e trata erros de autenticação.

### Roteamento

As rotas ficam em `src/routes/` e são montadas em `App.tsx`. Exemplos principais:

- `/` - Dashboard
- `/galpoes` - Lista de galpões
- `/galpoes/novo` - Cadastro de galpão
- `/galpoes/:id` - Detalhes do galpão (atualiza em tempo real)
- `/galpoes/:id/editar` - Edição de galpão
- `/galpoes/:id/lotes/novo` - Cadastro de lote
- `/galpoes/:id/dispositivos/novo` - Cadastro de dispositivo
- `/dispositivos/:id/editar` - Edição de dispositivo
- `/dispositivos/:id/leituras` - Histórico de leituras
- `/perfil` - Perfil e configurações

### Dados em tempo real

O app atualiza automaticamente dados críticos a cada 10 segundos. O intervalo é centralizado em `src/config/realtime.ts`:

```ts
export const REALTIME_REFRESH_INTERVAL_MS = 10_000 // 10 segundos
```

Atualmente aplicado em:

- `useDashboard` - Indicadores e galpões recentes
- `useGalpaoDetalhe` - Dados completos do galpão (lotes e dispositivos)
- `useGalpaoStatus` - Status de luminosidade dos dispositivos por galpão

Para alterar o intervalo globalmente, basta modificar esse valor.

### Monitoramento de luminosidade

Na página de detalhes do galpão (`src/pages/galpoes/GalpaoDetalhePage.tsx`):

- **Faixa ideal por fase**: definida pelo backend (INICIAL 70-100%, CRESCIMENTO 50-70%, PRODUÇÃO 30-50%). O frontend exibe apenas para referência.
- **Situação por dispositivo**: cálculo feito pelo backend via `GET /api/galpoes/{id}/status` (campo `statusLuminosidade`: `ADEQUADO`, `ABAIXO`, `ACIMA`, `SEM_LEITURA`). Exibida em card separado próximo à faixa ideal.
- **Leituras**: histórico disponível em `/dispositivos/:id/leituras`.

### Estilo e tema

- **CSS-first**: `src/index.css` define tokens semânticos e tema claro/escuro (`.dark`)
- **Tema**: `src/components/theme-provider.tsx` persiste preferência. Atalho `d` alterna tema fora de campos editáveis
- **shadcn/ui**: componentes em `src/components/ui/`. Adicionar com `npx shadcn@latest add <name>`
- **Aliases**: `@/*` mapeia para `src/*` (Vite + tsconfig.app.json). Sempre manter sincronizados

### Convenções importantes

- **Prettier**: sem ponto e vírgula, aspas duplas, 80 colunas, `trailingComma: es5`. Classes Tailwind são ordenadas automaticamente em `cn()` e `cva()`. Rode `npm run format`
- **TypeScript estrito**: `verbatimModuleSyntax` e `erasableSyntaxOnly`. Use `import type` para imports apenas de tipos. Não usar `enum`, `namespace`, etc.
- **Imports**: `cn` vem de `cn` package e é re-exportado por `src/lib/utils.ts` (existem importações `@/lib/utils` e `"cn"`)
- **Build**: `npm run typecheck` só verifica tsconfig vazio. Para verificação real use `npx tsc -p tsconfig.app.json --noEmit` ou `npm run build`

## Documentação relacionada

- `docs/api-routes.md` - Rotas da API e integrações
- `docs/style-guide.md` - Guia de estilo (fonte visual)
- `.agent/rules/` - Regras detalhadas do projeto (TypeScript, React, shadcn, arquitetura, commits)
- `AGENTS.md` - Instruções específicas do frontend

## Troubleshooting

| Problema | Solução |
|---|---|
| Erro de conexão com API | Verifique se o backend está rodando em `http://localhost:3333` e a `VITE_API_URL` no `.env` |
| Tipos desatualizados após mudanças | Rode `npm run build` ou `npx tsc -p tsconfig.app.json --noEmit` |
| Componentes shadcn com conflito de estilo | Siga o padrão de `src/components/ui/button.tsx` (usa `@base-ui/react`, não Radix) |
| Atualizações em tempo real não acontecem | Verifique se a aba está ativa (há `refetchIntervalInBackground: true`, mas dependem da rede) |
| Erro ao adicionar componente shadcn | Use `npx shadcn@latest add <name>` com `components.json` (style `base-nova`) |

## Dica rápida para ligar tudo

```bash
# Frontend
cd frontend
npm install
cp .env.example .env  # se existir
npm run dev
```

> Lembre-se: o backend precisa estar rodando para autenticação, dados e status de luminosidade funcionarem corretamente.
