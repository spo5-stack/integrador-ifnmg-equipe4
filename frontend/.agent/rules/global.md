---
trigger: always_on
description: "Regras globais do frontend: escopo, stack, comandos e convenções que valem para qualquer tarefa."
---

# Regras globais

## Escopo e comandos

- Trabalhe somente dentro de `frontend/` em tarefas de frontend. Não altere `backend/`, `gateway/` ou `arduino/`.
- Execute os comandos a partir de `frontend/`.
- Use npm e `package-lock.json`. Não introduza pnpm ou yarn.
- Verificação padrão: `npm run lint`, `npm run build` e `npm run format`.
- Evite `npm run typecheck`: o `tsconfig.json` raiz tem `files: []` e não valida `src/`. Para checar tipos use `npx tsc -p tsconfig.app.json --noEmit` ou `npm run build`.
- Não existe suíte de testes configurada. Não invente comandos ou padrões de teste.
- Antes de integrar com o backend, consulte `docs/api-routes.md`; a fonte viva é `http://localhost:3333/docs/openapi.json`.

## Stack obrigatória

- Vite 8, React 19, TypeScript 6, Tailwind CSS 4 e shadcn/ui com estilo `base-nova`.
- Primitivos de UI: `@base-ui/react` (não Radix). Ícones: `lucide-react`. HTTP: `axios` (nunca `fetch`), com cliente compartilhado em `src/services/api.ts`. Rotas com `react-router-dom` em `src/routes`.
- Fontes: Inter para corpo/labels e Manrope para títulos. Referência visual em `docs/style-guide.md`.
- O alias `@/*` aponta para `src/*`.

## Convenções do projeto

- Prettier: sem ponto e vírgula, aspas duplas, 80 colunas, `trailingComma: es5`.
- Tailwind é CSS-first: tokens, variantes e overrides ficam em `src/index.css`. Não crie `tailwind.config.*`.
- Use os tokens semânticos do tema (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.) em vez de cores fixas.
- O `ThemeProvider` usa a tecla global `d` para alternar o tema. Não adicione outro handler global que conflite.
- Variáveis de ambiente expostas ao navegador devem começar com `VITE_`. Nunca exponha segredos no frontend.
- Não adicione dependências sem necessidade. Prefira a stack já definida e justifique qualquer exceção.
