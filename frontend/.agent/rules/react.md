---
trigger: glob
globs: "src/**/*.tsx, src/**/*.ts"
description: "Regras de React 19, componentes, hooks, formulários, estado, acessibilidade e organização."
---

# React e componentes

- Use apenas componentes funcionais e function declarations. Não crie componentes de classe.
- Cada componente deve ter uma responsabilidade clara. Se um arquivo mistura busca de dados, regra de negócio e JSX extenso, divida em página/hook, componentes e serviços.
- Componentes devem ser puros no render: não mutar props/estado, não executar efeitos colaterais e não gerar valores aleatórios durante o render.
- Siga as regras dos hooks: chame hooks apenas no topo do componente/hook, nunca em condições, loops ou callbacks.
- Não use `useEffect` para estado derivado. Calcule valores derivados durante o render.
- Use `useEffect` apenas para sincronizar com sistemas externos (rede, eventos, localStorage, timers) e sempre implemente cleanup.
- Mantenha estado local até existir necessidade real de elevar ou compartilhar. Não use estado global para dados que pertencem a uma única feature.
- Não guarde dados derivados em estado. Separe estado do servidor de estado de UI.
- Para listas, use `key` estável e única (`item.id`). Não use índice como key em listas dinâmicas.
- Nomeie handlers como `handleSubmit`, `handleChange` e callbacks de props como `onSubmit`, `onChange`.
- Use nomes claros e completos. Evite abreviações mágicas em componentes, props e hooks.
- Trate sempre os estados de carregamento, erro e vazio em fluxos assíncronos.
- Evite `useMemo`, `useCallback` e `React.memo` por padrão. Só adicione quando houver problema de performance medido ou estabilidade de referência necessária.
- Prefira HTML semântico e acessibilidade nativa (`button`, `label`, `form`, navegação por teclado). Use ARIA apenas quando o elemento nativo não resolver.
- Não use `dangerouslySetInnerHTML` sem sanitização e justificativa explícita.
- Não faça requisições HTTP diretamente em componentes de apresentação. Use hooks/páginas e os serviços de `src/services/`, preferencialmente por meio do React Query.
- Composições específicas de uma funcionalidade ficam em `src/components/<funcionalidade>/`; componentes reutilizáveis e primitivos ficam em `src/components/` e `src/components/ui/`.
- Exporte componentes com export nomeado. O `App` pode manter o default export existente; não crie novos padrões de default export.

## Formulários

- Todo formulário deve usar `react-hook-form`.
- A validação deve ser feita com Zod e integrada ao formulário com `zodResolver` de `@hookform/resolvers/zod`.
- Defina o schema Zod junto da funcionalidade e derive o tipo do formulário com `z.infer<typeof schema>`.
- Use `register` para campos nativos e `Controller` apenas para componentes controlados que não exponham `ref`/eventos compatíveis.
- Use `formState.errors` e `formState.isSubmitting` para erros e estado de envio. Não duplique validações em `useState` ou handlers manuais.
- O envio deve chamar um serviço de `src/services/`; não faça HTTP diretamente no formulário.
