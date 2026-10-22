# Style Guide — Granja Inteligente

Fonte visual oficial do frontend. A referência HTML está em
`/home/hugo/Documentos/front-base-desing` e serve para criar as tarefas de UI do
projeto. A implementação é feita com React 19, Tailwind CSS 4 e shadcn/ui; não
copie o HTML/CSS do protótipo diretamente para o app.

Os nomes dos tokens do shadcn em `src/index.css` são preservados. A paleta da
referência foi aplicada aos valores existentes (`--background`, `--primary`,
`--secondary`, etc.), sem renomear variáveis.

## Direção visual

- Produto: painel operacional de monitoramento de luminosidade em granjas.
- Aparência: clara, limpa e técnica, com sidebar azul-marinho e cards brancos.
- Cores de apoio: verde para estados positivos/ativos, azul claro para
  superfícies de destaque, vermelho para erro e amarelo para atenção.
- Densidade média, bordas sutis, raios de 8–12 px e sombra suave.
- Tipografia: Manrope para títulos e Inter para corpo, labels e tabelas.

## Paleta de referência

### Núcleo da interface

| Papel na referência      | Hex       | Token shadcn              |
| ------------------------ | --------- | ------------------------- |
| `primary-container`      | `#001b44` | `--primary`, `--sidebar`  |
| `on-primary`             | `#ffffff` | `--primary-foreground`    |
| `secondary-container`    | `#99f2bd` | `--secondary`             |
| `on-secondary-container` | `#0a7147` | `--secondary-foreground`  |
| `background`             | `#f9f9ff` | `--background`            |
| `on-background`          | `#181c24` | `--foreground`            |
| `surface-container-lowest` | `#ffffff` | `--card`, `--popover`   |
| `surface-container-low`  | `#f0f3ff` | `--muted`                 |
| `primary-fixed`          | `#d8e2ff` | `--accent`                |
| `on-primary-fixed`       | `#001a42` | `--accent-foreground`     |
| `on-surface-variant`     | `#44474f` | `--muted-foreground`      |
| `outline-variant`        | `#c5c6d0` | `--border`, `--input`     |
| `surface-tint`           | `#495e8a` | `--ring`                  |
| `error`                  | `#ba1a1a` | `--destructive`           |
| `primary-fixed`          | `#d8e2ff` | `--sidebar-primary`       |
| `on-primary-fixed`       | `#001a42` | `--sidebar-primary-foreground` |
| `primary-fixed-dim`      | `#b1c6f9` | `--sidebar-ring`          |

### Paleta completa da referência

| Família   | Papel                       | Hex       |
| --------- | --------------------------- | --------- |
| Primary   | `primary`                   | `#00020a` |
| Primary   | `on-primary`                | `#ffffff` |
| Primary   | `primary-container`         | `#001b44` |
| Primary   | `on-primary-container`      | `#7084b3` |
| Primary   | `primary-fixed`             | `#d8e2ff` |
| Primary   | `primary-fixed-dim`         | `#b1c6f9` |
| Primary   | `on-primary-fixed`          | `#001a42` |
| Primary   | `on-primary-fixed-variant`  | `#314671` |
| Primary   | `inverse-primary`           | `#b1c6f9` |
| Secondary | `secondary`                 | `#006d43` |
| Secondary | `on-secondary`              | `#ffffff` |
| Secondary | `secondary-container`       | `#99f2bd` |
| Secondary | `on-secondary-container`    | `#0a7147` |
| Secondary | `secondary-fixed`           | `#9cf5c0` |
| Secondary | `secondary-fixed-dim`       | `#80d8a5` |
| Secondary | `on-secondary-fixed`        | `#002111` |
| Secondary | `on-secondary-fixed-variant` | `#005231` |
| Tertiary  | `tertiary`                  | `#040200` |
| Tertiary  | `on-tertiary`               | `#ffffff` |
| Tertiary  | `tertiary-container`        | `#271b00` |
| Tertiary  | `on-tertiary-container`     | `#a97e00` |
| Tertiary  | `tertiary-fixed`            | `#ffdfa0` |
| Tertiary  | `tertiary-fixed-dim`        | `#fbbc00` |
| Tertiary  | `on-tertiary-fixed`         | `#261a00` |
| Tertiary  | `on-tertiary-fixed-variant` | `#5c4300` |
| Error     | `error`                     | `#ba1a1a` |
| Error     | `on-error`                  | `#ffffff` |
| Error     | `error-container`           | `#ffdad6` |
| Error     | `on-error-container`        | `#93000a` |
| Surface   | `background`                | `#f9f9ff` |
| Surface   | `on-background`             | `#181c24` |
| Surface   | `surface`                   | `#f9f9ff` |
| Surface   | `on-surface`                | `#181c24` |
| Surface   | `surface-dim`               | `#d7dae5` |
| Surface   | `surface-bright`            | `#f9f9ff` |
| Surface   | `surface-container-lowest`  | `#ffffff` |
| Surface   | `surface-container-low`     | `#f0f3ff` |
| Surface   | `surface-container`         | `#ebedf9` |
| Surface   | `surface-container-high`    | `#e5e8f3` |
| Surface   | `surface-container-highest` | `#dfe2ed` |
| Surface   | `surface-variant`           | `#dfe2ed` |
| Surface   | `on-surface-variant`        | `#44474f` |
| Surface   | `inverse-surface`           | `#2c3039` |
| Surface   | `inverse-on-surface`        | `#edf0fc` |
| Surface   | `surface-tint`              | `#495e8a` |
| Outline   | `outline`                   | `#75777f` |
| Outline   | `outline-variant`           | `#c5c6d0` |

Exceções encontradas no protótipo: `#f4f6fa` nas telas de login (usar
`bg-muted`, `#f0f3ff`, como equivalente mais próximo) e cores pontuais
`#98ff98`, `#2563eb` e `#ff0000` (não fazem parte do sistema; não reutilizar).

### Cores de gráficos

| Token       | Hex       | Origem                    |
| ----------- | --------- | ------------------------- |
| `--chart-1` | `#001b44` | `primary-container`       |
| `--chart-2` | `#006d43` | `secondary`               |
| `--chart-3` | `#fbbc00` | `tertiary-fixed-dim`      |
| `--chart-4` | `#495e8a` | `surface-tint`            |
| `--chart-5` | `#a97e00` | `on-tertiary-container`   |

### Modo escuro

A referência é somente clara. O modo escuro em `src/index.css` é uma extensão
derivada dos papéis inversos da própria paleta:

- fundo `#181c24`, texto `#f9f9ff`, cards `#2c3039`;
- ação primária `#b1c6f9` com texto `#001a42`;
- superfícies de apoio `#314671` e `#2c3039`;
- sidebar `#00020a`.

Não criar outra paleta escura sem atualizar este guia.

## Tipografia

| Estilo        | Fonte   | Tamanho | Peso | Uso                                  |
| ------------- | ------- | ------- | ---- | ------------------------------------ |
| `display-lg`  | Manrope | 72 px   | 800  | Números/destaques de dashboard       |
| `headline-md` | Manrope | 30 px   | 800  | Título de página                     |
| `title-sm`    | Manrope | 18 px   | 800  | Título de card/seção                 |
| `body-md`     | Inter   | 14 px   | 400  | Texto corrido, tabelas e formulários |
| `label-caps`  | Inter   | 10 px   | 700  | Labels em caixa alta, com `tracking` |

- Títulos e navegação usam `font-heading` (Manrope).
- Corpo, inputs, labels e tabelas usam `font-sans` (Inter).
- `label-caps` deve ser uppercase com `tracking-widest` ou `tracking-[0.1em]`.
- Evite novos tamanhos fora da escala; use os utilitários `text-*` existentes.

## Layout e espaçamento

- Sidebar desktop: `16rem` fixa à esquerda.
- Header mobile: `4rem`.
- Conteúdo: `max-w-7xl`, padding de `2rem` no desktop.
- Gutter entre blocos: `1.5rem`; stacks internos: `1rem` e `0.5rem`.
- Grid de indicadores: 1 coluna no mobile e 4 no desktop.
- Layout principal: sidebar fixa + `main` com `md:ml-64`.
- Em mobile, a navegação vira top bar com blur e borda inferior.

## Raios, bordas e elevação

- Botões e inputs: raio de 8 px (`rounded-lg`).
- Cards e modais: raio de 12 px (`rounded-xl`).
- Cards: fundo branco, borda `1px` em `--border` e sombra
  `0 1px 3px rgb(0 0 0 / 0.05)`.
- Hover de botões primários: sombra mais forte. `active`: leve `scale(0.98)`.
- Não usar sombras pesadas ou gradientes fora dos já presentes na referência.

## Componentes

### Botões

- Primário: `bg-primary text-primary-foreground`, `rounded-lg`, texto em
  Manrope, `font-bold`, padding horizontal de 24 px e vertical de 10 px.
- Secundário/sucesso: `bg-secondary text-secondary-foreground`.
- Outline: `border-border bg-background hover:bg-muted`.
- Perigo: `bg-destructive text-white`.
- Sempre usar `Button` do shadcn e suas variantes antes de criar um botão novo.

### Inputs e formulários

- Campo: `bg-muted border border-input rounded-lg px-4 py-3 text-sm`.
- Focus: `ring-2 ring-ring` e borda transparente.
- Label: `label-caps` em `text-muted-foreground`.
- Erros: `text-destructive` e borda/anel destrutivo.
- Estados de loading, erro e vazio são obrigatórios em fluxos assíncronos.

### Cards e indicadores

- Card padrão: `bg-card text-card-foreground rounded-xl border border-border`.
- Ícone de indicador: tile de 48 px, `rounded-xl`, usando `bg-accent` ou
  `bg-secondary` com o respectivo foreground.
- Rótulo do indicador em `label-caps`; valor em headline/title.
- Ações rápidas: linhas com borda sutil e hover em `bg-muted`.

### Tabelas

- Cabeçalho: `label-caps`, uppercase, `text-muted-foreground`.
- Linhas: `border-b border-border/40`, hover em `bg-muted/50`.
- Ações da linha: ícones `lucide-react` de 16 px, com hover em `bg-muted`.
- Em telas pequenas, manter scroll horizontal.

### Sidebar

- Fundo: `bg-sidebar`, texto `text-sidebar-foreground`.
- Item ativo: `bg-sidebar-accent text-sidebar-accent-foreground`.
- Logo/ícone de marca: `bg-sidebar-primary text-sidebar-primary-foreground`.
- Hover: `bg-sidebar-accent/50`.
- A sidebar deve usar os componentes de sidebar do shadcn quando disponíveis.

### Feedback

- Sucesso: `secondary` (verde claro) com `secondary-foreground`.
- Erro: `destructive` com `bg-destructive/10`.
- Atenção: `chart-3` (`#fbbc00`) como destaque, sem usar como texto principal.
- Toasts: card branco, borda `secondary`, ícone em tile circular verde.

## Ícones

- A referência HTML usa Material Symbols Outlined.
- Na aplicação React, usar `lucide-react`, já configurado no shadcn, com
  equivalentes visuais (dashboard, warehouse, plus, search, edit, trash etc.).
- Tamanhos: 16 px em botões/ações, 20–24 px em navegação e indicadores.

## Acessibilidade

- Usar HTML semântico e componentes acessíveis do shadcn.
- Todo input deve ter label associado.
- Foco visível obrigatório (`ring-2 ring-ring`).
- Não comunicar status apenas por cor; incluir texto ou ícone.
- Garantir contraste de texto sobre `primary`, `secondary` e `destructive`.
- Respeitar navegação por teclado e `prefers-reduced-motion` em animações.

## Regras para criação de tarefas

- Toda tarefa de UI deve ser baseada neste guia e na referência HTML.
- A tarefa deve indicar: tela/feature, estados (loading, erro, vazio, sucesso),
  componentes shadcn necessários e tokens de cor usados.
- Não criar tarefas com cores, fontes, raios ou sombras fora deste guia.
- Não renomear tokens do shadcn em `src/index.css`; alterar apenas os valores.
- Se a referência não cobrir um estado, seguir os padrões deste guia e registrar
  a decisão na tarefa.
- Mudanças de design devem atualizar este guia e os tokens, nunca criar
  variações locais por tela.

## Mapa das telas de referência

| Área         | Arquivos de referência                                                                 |
| ------------ | -------------------------------------------------------------------------------------- |
| Dashboard    | `inicio/index.html`                                                                    |
| Autenticação | `login/Login.html`, `login/CriarConta.html`, `login/EsqueciSenha.html`, `login/SenhaNova.html`, `login/CodigoVerificacao.html` |
| Galpões      | `galpao/galpoes.html`, `galpao/galpao-criar.html`, `galpao/galpao-editar.html`, `galpao/galpao-detalhe.html`, `galpao/cadastraLotes.html` |
| Dispositivos | `dispositivo/dispositivo-criar.html`, `dispositivo/dispositivo-editar.html`, `dispositivo/dispositivo-leituras.html` |
| Perfil       | `perfil/perfil.html`                                                                   |
