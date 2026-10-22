---
trigger: always_on
description: "Arquitetura MVC inspirada em React: separação entre model, controller e view por feature."
---

# Arquitetura MVC no frontend

React não é um framework MVC, mas o projeto adota uma separação inspirada em MVC para evitar componentes gordos e mistura de responsabilidades.

## Estrutura por feature

```text
src/
  features/
    <feature>/
      model/        # tipos, DTOs, regras de negócio e serviços/axios
      controller/   # hooks que orquestram estado, efeitos e ações
      view/         # componentes de apresentação
  components/       # UI compartilhada, incluindo ui/ do shadcn
  services/         # axios compartilhado e integrações transversais
  lib/              # utilitários puros compartilhados
```

## Responsabilidades

- **Model**: tipos de domínio, contratos de API, chamadas axios, validações e transformações de dados. Não importa React, componentes ou hooks.
- **Controller**: custom hooks (por exemplo, `useUsuariosController`) que mantêm estado da tela, disparam chamadas do model, controlam loading/erro e expõem ações e dados para a view.
- **View**: componentes de apresentação que recebem props e renderizam JSX. Não fazem HTTP, não conhecem detalhes do backend e não concentram regra de negócio.
- **Page/composição**: conecta controller e view. Pode cuidar de layout e composição, mas não deve duplicar lógica de dados.

## Regras de dependência

- O fluxo permitido é `view -> controller -> model`.
- Model não pode importar de view nem de controller.
- View não pode importar axios nem serviços de dados diretamente.
- Controllers podem usar React e hooks; models devem ser TypeScript puro e testáveis sem DOM.
- Evite dependências circulares entre features. Compartilhe apenas o que for realmente transversal em `src/components`, `src/lib` ou `src/services`.
- Uma feature não deve importar arquivos internos de outra feature. Se precisar, promova o código para uma camada compartilhada.

## Estado e dados

- O controller é a fonte de estado da feature. Evite espalhar o mesmo estado em vários componentes.
- Use estado global/contexto apenas para dados realmente globais (tema, sessão). Dados de uma feature ficam na própria feature.
- Não duplique dados do servidor em vários modelos. Defina um model/serviço por recurso.
- Tratamento de loading, erro e vazio pertence ao controller e é exposto para a view.
- Se um componente começar a buscar dados, transformar dados e renderizar uma tela inteira, divida imediatamente em model + controller + view.
