---
trigger: model_decision
description: "Use ao implementar qualquer requisição HTTP, cliente de API, serviço de dados ou integração com o backend."
---

# HTTP com axios

- Consulte `docs/api-routes.md` antes de criar chamadas, DTOs ou models. A fonte viva é `http://localhost:3333/docs/openapi.json`.
- Toda comunicação HTTP deve usar `axios`. Nunca use `fetch`, `XMLHttpRequest` ou wrappers que troquem o cliente.
- Se `axios` ainda não estiver instalado, rode `npm install axios` antes de implementar a primeira chamada.
- Crie uma instância única em `src/services/api.ts` com `baseURL`, timeout e interceptors compartilhados. Não use `axios` global diretamente.
- A URL base deve vir de `import.meta.env.VITE_API_URL`. Nunca hardcode host, porta ou URL de produção no código.
- Chamadas de uma feature ficam no model/serviço da feature (`src/features/<feature>/model/`), nunca dentro de componentes de view.
- Componentes acessam dados por hooks/controllers. Não importe axios em arquivos de view.
- Tipar request e response com DTOs. Use `api.get<T>()`, `api.post<T>()` etc. e evite `any` ou casts inseguros.
- Interceptors devem tratar autenticação e normalização de erros sem engolir falhas. Propague erros tipados para o controller.
- Trate erros com `AxiosError` ou um erro normalizado da aplicação; não use `catch` vazio.
- Use `AbortController` e cleanup para cancelar requisições ao desmontar componentes ou trocar parâmetros.
- Não coloque tokens, senhas ou chaves em código-fonte, logs ou variáveis `VITE_` que não sejam públicas por definição.
- Não armazene dados sensíveis em `localStorage` sem requisito explícito de segurança.
