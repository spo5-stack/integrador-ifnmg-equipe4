---
trigger: always_on
description: "Arquitetura frontend simplificada com pages, components, services e interfaces."
---

# Arquitetura simplificada no frontend

O projeto deve utilizar uma arquitetura simples, organizada e de fácil manutenção, separando páginas, componentes visuais, serviços de comunicação com a API e interfaces TypeScript.

O objetivo é evitar componentes muito grandes, duplicação de código e mistura de responsabilidades, sem adicionar camadas desnecessárias.

## Estrutura de pastas

```text
src/
├── pages/              # Páginas da aplicação
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── galpoes/
│   │   ├── GalpoesPage.tsx
│   │   ├── GalpaoDetalhePage.tsx
│   │   ├── CriarGalpaoPage.tsx
│   │   └── EditarGalpaoPage.tsx
│   ├── lotes/
│   │   └── CadastrarLotePage.tsx
│   ├── dispositivos/
│   │   ├── CriarDispositivoPage.tsx
│   │   ├── EditarDispositivoPage.tsx
│   │   └── DispositivoLeiturasPage.tsx
│   └── ...
│
├── components/         # Componentes reutilizáveis
│   ├── login/
│   │   ├── LoginForm.tsx
│   │   └── ...
│   ├── galpoes/
│   │   ├── GalpaoForm.tsx
│   │   ├── GalpoesTable.tsx
│   │   └── galpaoSchema.ts
│   ├── lotes/
│   │   ├── CadastrarLoteForm.tsx
│   │   └── loteSchema.ts
│   ├── dispositivos/
│   │   ├── DispositivoForm.tsx
│   │   └── dispositivoSchema.ts
│   └── ui/             # Componentes compartilhados, incluindo shadcn/ui
│
├── hooks/              # Hooks de dados por funcionalidade (React Query)
│   ├── useDashboard.ts
│   ├── useGalpoes.ts
│   ├── useGalpaoDetalhe.ts
│   ├── useCadastrarLote.ts
│   ├── useCriarDispositivo.ts
│   ├── useEditarDispositivo.ts
│   └── useDispositivoLeituras.ts
│
├── services/           # Comunicação com API e regras de acesso aos dados
│   ├── api.ts          # Configuração compartilhada do Axios
│   ├── authService.ts  # Serviços de autenticação
│   ├── galpaoService.ts
│   ├── loteService.ts
│   ├── dispositivoService.ts
│   └── ...
│
├── interfaces/         # Interfaces e tipos TypeScript
│   ├── auth.ts
│   ├── dashboard.ts
│   ├── galpao.ts
│   ├── lote.ts
│   ├── dispositivo.ts
│   └── ...
│
├── lib/                # Funções utilitárias compartilhadas
└── ...
```

A estrutura acima é uma referência. Crie arquivos e pastas adicionais somente quando forem necessários.

## Responsabilidades

### 1. Pages

- A pasta `pages/` contém as páginas completas da aplicação.
- Cada página deve representar uma rota ou tela, como `LoginPage.tsx`, `DashboardPage.tsx` ou `UsuariosPage.tsx`.
- Agrupe as páginas por domínio em subpastas de `pages/` quando houver mais de uma tela do mesmo assunto, como `pages/auth/`, `pages/galpoes/`, `pages/lotes/`, `pages/dispositivos/`, `pages/leituras/` e `pages/usuarios/`.
- Utilize nomes de pasta em minúsculas, sem acentos e no plural quando representarem um domínio, como `galpoes` e `dispositivos`.
- Uma página isolada pode ficar diretamente em `pages/`; quando surgir outra página do mesmo domínio, mova ambas para a subpasta correspondente.
- As páginas são responsáveis por organizar os componentes necessários para montar a tela.
- Podem controlar o estado específico da página quando isso for simples.
- Quando a lógica crescer, extraia-a para funções ou hooks específicos, sem criar camadas obrigatórias.
- Evite colocar toda a implementação visual e toda a lógica de negócio em uma única página.

### 2. Components

- A pasta `components/` contém os componentes visuais da aplicação.
- Componentes específicos de uma funcionalidade devem ficar em subpastas, como `components/login/LoginForm.tsx`.
- Componentes compartilhados entre diferentes funcionalidades devem ficar diretamente em `components/` ou na pasta apropriada, como `components/ui/`.
- Utilize props para receber dados e callbacks.
- Componentes de formulário podem controlar seus próprios campos e estados locais.
- Evite duplicar componentes com a mesma finalidade.
- Não realize chamadas HTTP diretamente nos componentes visuais. Utilize os serviços da pasta `services/`.

### 3. Services

- A pasta `services/` centraliza a comunicação com a API e outras integrações externas.
- Utilize `services/api.ts` para configurar a instância compartilhada do Axios, incluindo URL base e configurações comuns.
- Crie serviços por funcionalidade ou recurso, como `authService.ts`, `usuarioService.ts` e `produtoService.ts`.
- Cada serviço deve concentrar as funções responsáveis por acessar os endpoints correspondentes.
- Não duplique configurações de Axios em diferentes arquivos.
- Os serviços devem retornar dados tipados e propagar erros para que a camada responsável pela interface possa tratá-los.
- Não coloque elementos JSX ou componentes React nos serviços.
- Não coloque tokens, senhas ou outras credenciais diretamente no código-fonte.

### 4. Interfaces

- A pasta `interfaces/` contém interfaces, tipos e contratos utilizados no projeto.
- Organize os arquivos por domínio ou funcionalidade, como `auth.ts`, `usuario.ts` e `produto.ts`.
- Defina os formatos dos dados enviados e recebidos pela API.
- Crie interfaces para requisições, respostas e entidades quando necessário.
- Reutilize as interfaces existentes em vez de declarar os mesmos formatos repetidamente.
- Utilize `type` quando for mais adequado do que `interface`.
- Evite utilizar `any` quando for possível definir um tipo explícito.
- Não coloque chamadas HTTP ou lógica de interface nesses arquivos.

### 5. Lib

- A pasta `lib/` deve conter funções utilitárias genéricas e reutilizáveis.
- Utilize-a para funções puras que não pertencem exclusivamente a uma página ou serviço específico.
- Não utilize essa pasta como destino genérico para qualquer código sem organização.

### 6. Hooks de dados

- Hooks que buscam dados de uma funcionalidade ficam em `src/hooks/use<Nome>.ts` ou próximos da página que os utiliza.
- Use React Query (`useQuery`/`useMutation`) para estado de servidor, nunca `useEffect` + `useState` para buscar dados.
- O hook consome os serviços de `src/services/` e devolve dados, `isLoading`, erro normalizado e uma função de recarregar.
- Não duplique a mesma query em vários lugares; reutilize o hook ou a mesma query key.

## Regras de dependência

O fluxo recomendado é:

`Pages → Components → Services → API`

As interfaces podem ser importadas pelas páginas, componentes e serviços, conforme a necessidade.

Regras obrigatórias:

- Componentes não devem importar serviços para executar requisições HTTP diretamente.
- Páginas ou hooks podem chamar os serviços e repassar os resultados aos componentes por props.
- Serviços não devem importar páginas ou componentes React.
- Interfaces não devem depender de componentes, páginas ou serviços.
- Hooks de dados podem importar serviços e interfaces, mas não devem importar componentes visuais.
- Evite dependências circulares.
- Não crie uma pasta ou camada adicional sem uma necessidade real.
- Evite importar arquivos internos de outras funcionalidades quando uma abstração compartilhada for mais apropriada.
- Ao migrar uma tela, mova tipos para `src/interfaces/` e chamadas HTTP para `src/services/`; a pasta `src/features/` foi removida e não deve voltar.

## Estado e tratamento de erros

- Utilize `useState` e outros hooks do React quando necessário.
- Mantenha o estado próximo de onde ele é utilizado.
- Não crie estado global para dados usados apenas em uma página.
- Estado de servidor (dados vindos da API) deve usar React Query; estado local é para UI.
- Estados de carregamento, sucesso e erro devem ser tratados pela página ou por um hook quando houver necessidade de compartilhar a lógica.
- Os componentes devem receber as informações necessárias para exibir carregamento, mensagens de erro e resultados vazios.
- Evite duplicar dados retornados pela API sem necessidade.

## Padrões de código

- Utilize TypeScript e tipagem explícita.
- Siga os padrões de nomenclatura já existentes no projeto.
- Utilize nomes descritivos para arquivos, funções, variáveis e interfaces.
- Componentes React devem utilizar PascalCase, como `LoginForm.tsx`.
- Serviços devem utilizar uma nomenclatura consistente, como `authService.ts`.
- Mantenha funções pequenas e com responsabilidades claras.
- Reaproveite os componentes existentes, incluindo os componentes do shadcn/ui.
- Não adicione bibliotecas, abstrações ou padrões arquiteturais sem necessidade.

## Exemplo de organização de uma funcionalidade

A funcionalidade de autenticação deve seguir esta organização:

- `pages/auth/LoginPage.tsx`: organiza a página de login.
- `pages/auth/RegisterPage.tsx`: organiza a página de cadastro.
- `components/login/LoginForm.tsx`: renderiza o formulário de login e coleta os dados.
- `components/register/RegisterForm.tsx`: renderiza o formulário de cadastro e coleta os dados.
- `services/authService.ts`: realiza as requisições de login e cadastro à API.
- `services/api.ts`: configura a comunicação HTTP compartilhada.
- `interfaces/auth.ts`: define os tipos dos dados de autenticação e das respostas da API.

A página pode chamar o serviço diretamente ou utilizar um hook específico, caso a lógica cresça. Não é obrigatório criar controllers, models ou hooks para funcionalidades simples.

A funcionalidade de dashboard deve seguir esta organização:

- `pages/dashboard/DashboardPage.tsx`: organiza a página do dashboard.
- `hooks/useDashboard.ts`: busca e deriva os dados do dashboard com React Query.
- `services/dashboardService.ts` e `services/galpaoService.ts`: realizam as requisições à API.
- `interfaces/dashboard.ts` e `interfaces/galpao.ts`: definem os tipos usados pela página.

A funcionalidade de galpões deve seguir esta organização:

- `pages/galpoes/GalpoesPage.tsx`: lista, busca, paginação e exclusão de galpões.
- `pages/galpoes/GalpaoDetalhePage.tsx`: exibe o detalhe com lotes e dispositivos.
- `pages/galpoes/CriarGalpaoPage.tsx` e `pages/galpoes/EditarGalpaoPage.tsx`: cadastro e edição.
- `components/galpoes/GalpaoForm.tsx`: formulário compartilhado com React Hook Form + Zod.
- `components/galpoes/GalpoesTable.tsx`: tabela da listagem.
- `components/galpoes/galpaoSchema.ts`: schema Zod e tipo dos valores do formulário.
- `hooks/useGalpoes.ts` e `hooks/useGalpaoDetalhe.ts`: estado de servidor com React Query.
- `services/galpaoService.ts`: requisições de galpões à API.
- `interfaces/galpao.ts`: tipos de galpões.
- `lib/datas.ts`: formatação e cálculo de datas com dayjs.

A funcionalidade de lotes deve seguir esta organização:

- `pages/lotes/CadastrarLotePage.tsx`: página de cadastro de lote.
- `components/lotes/CadastrarLoteForm.tsx`: formulário com React Hook Form + Zod.
- `components/lotes/loteSchema.ts`: schema Zod, mensagem de capacidade e conversão dos dados.
- `hooks/useCadastrarLote.ts`: lista de galpões e mutação de criação com React Query.
- `services/loteService.ts`: requisições de lotes à API.
- `interfaces/lote.ts`: tipos de lotes.

A funcionalidade de dispositivos deve seguir esta organização:

- `pages/dispositivos/CriarDispositivoPage.tsx`: cadastro de dispositivo, com diálogo do ID gerado.
- `pages/dispositivos/EditarDispositivoPage.tsx`: edição do dispositivo (galpão bloqueado).
- `pages/dispositivos/DispositivoLeiturasPage.tsx`: histórico paginado de leituras.
- `components/dispositivos/DispositivoForm.tsx`: formulário compartilhado (criação e edição) com React Hook Form + Zod.
- `components/dispositivos/dispositivoSchema.ts`: schemas Zod de criação e edição.
- `hooks/useCriarDispositivo.ts`: lista de galpões e mutação de criação com React Query.
- `hooks/useEditarDispositivo.ts`: localiza o dispositivo (via estado da rota ou varrendo galpões) e mutação de edição.
- `hooks/useDispositivoLeituras.ts`: leituras paginadas com React Query.
- `services/dispositivoService.ts`: requisições de dispositivos e leituras à API.
- `interfaces/dispositivo.ts`: tipos de dispositivos e leituras.

## Regra principal

Priorize simplicidade, clareza, reutilização e manutenção.

A arquitetura deve facilitar a localização do código e a separação de responsabilidades, sem transformar tarefas simples em estruturas complexas. Antes de criar novos arquivos ou abstrações, verifique se já existe uma solução adequada no projeto.
