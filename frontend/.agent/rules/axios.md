---
trigger: model_decision
description: "Use ao implementar requisições HTTP, React Query, cliente de API, serviço de dados ou integração com o backend."
---

# HTTP com axios e React Query

- Consulte `docs/api-routes.md` antes de criar chamadas, DTOs ou models. A fonte viva é `http://localhost:3333/docs/openapi.json`.
- Toda comunicação HTTP deve usar `axios`. Nunca use `fetch`, `XMLHttpRequest` ou wrappers que troquem o cliente.
- Se `axios` ainda não estiver instalado, rode `npm install axios` antes de implementar a primeira chamada.
- Crie uma instância única em `src/services/api.ts` com `baseURL`, timeout e interceptors compartilhados. Não use `axios` global diretamente.
- A URL base deve vir de `import.meta.env.VITE_API_URL`. Nunca hardcode host, porta ou URL de produção no código.
- Chamadas HTTP ficam em `src/services/<recurso>Service.ts`, nunca dentro de componentes visuais.
- Páginas e hooks consomem os serviços e repassam os dados aos componentes por props. Não importe axios em componentes.
- Tipar request e response com DTOs. Use `api.get<T>()`, `api.post<T>()` etc. e evite `any` ou casts inseguros.
- Interceptors devem tratar autenticação e normalização de erros sem engolir falhas. Propague erros tipados para a página ou hook que consumir o serviço.
- Trate erros com `AxiosError` ou um erro normalizado da aplicação; não use `catch` vazio.
- Use `AbortController`/`signal` para cancelar requisições quando a query mudar ou o componente desmontar. O React Query fornece `signal` no `queryFn`.
- Não coloque tokens, senhas ou chaves em código-fonte, logs ou variáveis `VITE_` que não sejam públicas por definição.
- Não armazene dados sensíveis em `localStorage` sem requisito explícito de segurança.

## React Query (TanStack Query)

- Use `@tanstack/react-query` para estado de servidor: `useQuery` para leitura e `useMutation` para escrita.
- Não use `useEffect` + `useState` para buscar dados ou controlar cache. Use React Query para loading, erro, cache, refetch, paginação e invalidação.
- Crie um `QueryClient` compartilhado e registre o `QueryClientProvider` no nível da aplicação. Não crie um `QueryClient` por componente.
- As funções de serviço devem conter as chamadas axios e ser usadas em `queryFn`/`mutationFn`.
- Use query keys estáveis e hierárquicas; invalide as queries afetadas após mutations.
- Use `enabled` para queries condicionais; não chame hooks condicionalmente.
- Configure `staleTime`, `gcTime` e `retry` de forma consciente. Não use retry indiscriminado em mutations.
- Trate erros com o estado de erro do React Query e propague mensagens normalizadas; não use `catch` vazio.
