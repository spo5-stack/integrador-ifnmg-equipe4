# AGENTS.md

Frontend package for the IoT data-visualization project. It is a standalone npm package inside a larger repo (`backend/`, `gateway/`, `arduino/`). Run all commands from this `frontend/` directory.

Stack: Vite 8, React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui (`base-nova` style).

Detailed project rules live in `.agent/rules/` (global, TypeScript, React, shadcn, axios, MVC, commits). Read the relevant rule before changing code.

## Commands

- `npm install` — uses `package-lock.json` (npm, not pnpm/yarn)
- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build`; this is the reliable full typecheck
- `npm run lint` — ESLint (`dist/` ignored)
- `npm run format` — Prettier for all `*.ts`/`*.tsx`
- `npm run typecheck` — **only checks the empty solution tsconfig** (`files: []`), so it passes without checking source. Use `npx tsc -p tsconfig.app.json --noEmit` or `npm run build` instead.
- No test runner, router, API client, or backend integration is configured yet; do not assume they exist.

## Structure and wiring

- `src/main.tsx` mounts React in `StrictMode`, wraps `App` in `ThemeProvider`, and imports `src/index.css`.
- `@/*` maps to `src/*` in both Vite and `tsconfig.app.json`. Keep both aliases in sync if changed.
- UI primitives live in `src/components/ui/`. Add shadcn components with `npx shadcn@latest add <name>`; `components.json` defines the `base-nova` style with `rsc: false`.
- This shadcn style uses `@base-ui/react` primitives, not Radix. Follow `src/components/ui/button.tsx` as the reference.
- `src/components/theme-provider.tsx` owns theme persistence and a global `d` key shortcut that toggles dark mode outside editable fields. Be careful adding other global keyboard handlers.
- `src/index.css` is the Tailwind v4 source of truth: CSS-first `@theme`, semantic color tokens, and `.dark` overrides. There is no `tailwind.config.*`; add design tokens here.

## Conventions / gotchas

- Prettier: no semicolons, double quotes, 80 columns, `trailingComma: es5`; Tailwind classes are auto-sorted inside `cn()` and `cva()`. Run `npm run format`.
- `cn` comes from the `cn` package and is re-exported by `src/lib/utils.ts`; both `@/lib/utils` and `"cn"` imports exist (shadcn-generated files may use either).
- TypeScript is strict with `verbatimModuleSyntax` and `erasableSyntaxOnly`: use `import type` for type-only imports and avoid enums/namespaces and other non-erasable syntax. Unused locals/parameters fail the build.
