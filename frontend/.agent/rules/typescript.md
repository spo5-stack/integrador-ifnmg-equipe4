---
trigger: glob
globs: "**/*.ts, **/*.tsx"
description: "Regras de TypeScript para tipos, imports, APIs e segurança de tipos."
---

# TypeScript

- Mantenha `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` e `erasableSyntaxOnly` habilitados.
- Use `import type` para imports que existem apenas em tempo de tipo.
- Não use `enum`, `namespace` ou parameter properties: não são apagáveis e violam `erasableSyntaxOnly`. Prefira unions de strings, objetos `as const` e funções.
- Evite `any`. Use `unknown`, narrowing, unions e generics. Se `any` for inevitável, isole e justifique.
- Tipar props com `type NomeProps = { ... }` ou `interface NomeProps`; não use `React.FC`.
- Use os tipos de evento do React (`React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`, etc.).
- Em respostas de API, tipar o DTO e usar generics do axios (`api.get<Usuario[]>`) em vez de cast cego.
- Seja explícito nas fronteiras (props, retornos de hooks, respostas externas) e deixe a inferência trabalhar em valores locais óbvios.
- Não use non-null assertion (`!`) para esconder dados ausentes. Trate `null`/`undefined` com narrowing ou valores padrão.
- Prefira `satisfies` para validar objetos de configuração sem perder a inferência.
