---
trigger: model_decision
description: "Use ao criar, alterar ou escolher qualquer componente de interface, formulário, botão, modal, tabela ou outro primitivo visual."
---

# shadcn/ui

- Sempre prefira um componente do shadcn/ui quando ele existir. Não recrie botões, inputs, selects, dialogs, tabelas, badges, cards ou outros primitivos à mão.
- Consulte `docs/style-guide.md` para cores, tipografia, espaçamento e estados antes de montar a interface.
- Antes de criar algo novo, verifique `src/components/ui/` e reutilize o que já existe.
- Para adicionar um componente, use o CLI: `npx shadcn@latest add <nome>`.
- O projeto usa o estilo `base-nova`, com `rsc: false` e primitivos de `@base-ui/react`. Não adicione pacotes Radix nem copie exemplos baseados em Radix.
- Use `lucide-react` para ícones, conforme `components.json`.
- Componentes gerados pelo shadcn ficam em `src/components/ui/`. Evite editá-los, a menos que seja necessário para o design system; prefira compor em volta deles.
- Composições específicas de tela/feature ficam fora de `src/components/ui/`, na pasta da feature.
- Use o helper `cn` (`@/lib/utils` ou pacote `cn`) para combinar classes e preserve a ordenação do Tailwind.
- Estilize com tokens semânticos do tema e variantes (`cva`) em vez de cores e tamanhos soltos.
- Formulários devem usar os primitivos do shadcn com `label`, mensagens de erro e estados de foco acessíveis.
- Se o componente necessário não existir no shadcn, verifique se pode ser composto com primitivos existentes antes de criar um componente customizado.
