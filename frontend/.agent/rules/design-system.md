---
trigger: always_on
description: "Fonte oficial de design, style guide e regras para criar tarefas de UI."
---

# Design system e style guide

- A referência visual oficial do projeto é `/home/hugo/Documentos/front-base-desing`.
- O guia detalhado está em `docs/style-guide.md`. Leia antes de criar ou alterar telas.
- Toda tarefa de UI deve ser criada a partir da style guide e da tela correspondente na referência HTML.
- Cada tarefa deve indicar a tela/feature, os estados (loading, erro, vazio, sucesso), os componentes shadcn necessários e os tokens de cor usados.
- Não inventes cores, fontes, raios, sombras ou novos padrões visuais fora da style guide.
- Não copie o HTML/CSS do protótipo para o app: recrie a interface com React, Tailwind CSS 4 e shadcn/ui.
- Mantenha os nomes dos tokens do shadcn em `src/index.css`. Altere apenas os valores para refletir a paleta da referência.
- Use Manrope para títulos/headings e Inter para corpo, labels e tabelas.
- Use `lucide-react` no app. A referência usa Material Symbols; escolha ícones equivalentes.
- Se a referência não cobrir um estado ou componente, siga os padrões da style guide e registre a decisão na tarefa.
- Mudanças no design devem atualizar a style guide e os tokens; não crie variações locais por tela.
