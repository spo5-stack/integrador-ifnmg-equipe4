<div align="center">
<b>Tecnologia em Análise e Desenvolvimento de Sistemas
<br />
Práticas Profissionais Integradoras I e II</b>
<br />
Prof. Me. Luiz Filipe Carreiro Salazar
<br />
Prof. Me. Felipe Túlio de Castro
</div>
---

# Enunciado do Projeto Integrador 2026

## Objetivos
- Preparar os discentes para situações que envolvam o desenvolvimento de soluções tecnológicas sem o controle do ambiente acadêmico;
- Estimular a independência na construção de conhecimentos técnicos e comportamentais;
- Desenvolver habilidades que envolvam a comunicação oral e escrita de produtos/negócios desenvolvidos.

## Benefícios
O principal benefício é permitir que os(as) acadêmicos(as) possam colocar em prática os conceitos de desenvolvimento de software em uma demanda real. Além disso, vocês terão uma experiência de trabalho em equipe.

## Contexto

O projeto funcionará em estrutura de hackathon, que é um tipo de competição que reúne pessoas para desenvolverem a melhor solução para uma determinada temática. Em outras palavras, o projeto integrador consiste na elaboração de um sistema computacional para qualquer plataforma (embarcado, desktop, web ou mobile) com foco em uma temática única e específica, definida pelos docentes das disciplinas. Para o ano de 2026, o tema definido é **IoT + Visualização de Dados**.

Neste projeto integrador, os dados utilizados pela plataforma desktop, web ou mobile serão coletados por meio de sensores físicos conectados a uma placa Arduino Mega 2560. Para conectarmos as aplicações, adotaremos uma arquitetura utilizada em alguns ambientes industriais, conhecida como *Edge + Gateway*. 

O Arduino será responsável exclusivamente pela aquisição de dados dos sensores, atuando como um dispositivo de borda (*edge device*). Os dados coletados serão enviados por meio de comunicação serial via USB para um computador. O computador, por sua vez, executará um software intermediário (*gateway*), cuja função será ler os dados recebidos pela porta serial e enviá-los para uma aplicação desktop/web/mobile por meio de uma API REST. O backend da aplicação será responsável pelo armazenamento, tratamento e disponibilização dos dados, enquanto o frontend deverá apresentar essas informações em forma de dashboards, gráficos e indicadores.

## Requisitos obrigatórios

- O sistema embarcado deve ser capaz de coletar dados de algum sensor/atuador e enviar esses dados para a porta serial USB;
- O gateway no computador deve ser capaz de coletar esses dados na porta USB e alimentar o backend da aplicação;
- Na aplicação desktop/web/mobile:
  - o usuário deve ser capaz de criar um cadastro e editar seus dados;
  - deve ter um controle de sessão – ou equivalente – com possibilidade de login e logout por parte do usuário;
  - deve ter ao menos 1 recurso com o CRUD completo;
  - deve ter ao menos 1 recurso de sumarização de dados funcionando (dashboard);

## Equipes

- A formação das equipes é responsabilidade dos estudantes. 
- Este trabalho pode ser desenvolvido sozinho, em dupla, em trio, em quarteto ou quinteto (no máximo). 
  - Os casos excepcionais serão decididos pelos docentes da disciplina.
- Todos os estudantes que estiverem matriculados na disciplina Práticas Profissionais Integradoras I deverão participar desta atividade para fins de avaliação.
  - Aqueles que estiverem matriculados apenas em outras disciplinas que farão uso do projeto integrador como instrumento de avaliação também deverão participar desta atividade.
  - Caso as outras disciplinas do semestre não usem o projeto integrador como instrumento avaliativo, ou caso os docentes ofereçam uma avaliação substitutiva para o integrador, o estudante não precisa fazer esta atividade.

### Divisão das funções

Os membros das equipes serão distribuídos em funções que emulam os cargos em um cenário real. A saber:

- Product Owner (PO) – 1 pessoa
  - Perfil: organização, comunicação, visão do produto
  - Atribuições e entregáveis mínimos:
    - Coordenar as tarefas (*tasks*) da equipe (registrar no Github Projects)
    - Elaborar e registrar os casos de uso e as regras de negócio (tabela de Requisitos)
    - Contribuir com os demais colegas na modelagem do sistema
    - Conduzir as reuniões semanais (registrar no Github Projects)
    - Elaborar a documentação do sistema 
    - Ser a ponte de diálogo e atualização com os docentes
  - Entregáveis da função:
    - Lançamento de todas as tarefas e documentações da equipe no Github Projects
    - Artigo acadêmico sobre o sistema

- Backend Developer – 2 pessoas
  - Perfil: lógica, dados, APIs
  - Atribuições:
    - Implementar a API REST
    - Modelar, criar e gerenciar o banco de dados em conjunto com o PO
    - Integrar os sistemas (arduino + PC + backend)
    - Garantir as regras de negócio
  - Entregáveis da função (registrados no Github):
    - Os códigos do sistema
    - Modelagem dos dados
    - Documentação dos endpoints, rotas e funções

- Frontend Developer – 1 pessoa
  - Perfil: interface, usabilidade, interação
  - Atribuições:
    - Implementar as telas e dashboards
    - Projetar a interface que irá consumir a API
    - Trabalhar a responsividade e o UX básico do sistema
  - Entregáveis da função (registrados no Github):
    - Telas implementadas
    - Consumo da API
    - Componentização
    - Responsividade básica 
    
- QA / Tester – 1 pessoa
  - Perfil: atenção a detalhes, organização
  - Atribuições:
    - Criar os casos de teste
    - Validar os requisitos
    - Testar as integrações
    - Abrir issues no Git/Github para novas implementações e correções
  - Entregáveis da função (registrados no Github):
    - Registro dos casos de teste
    - Registro de bugs (issues abertas no github)
    
- UX/UI Designer – 1 pessoa (pode ser acumulado)
  - Perfil: design, experiência do usuário
  - Atribuições:
    - Criar os protótipos das telas para o sistema
    - Definir os padrões visuais (guia de estilos)
    - Ajudar o frontend com a experiência do usuário (UX) e a interface do usuário (UI)
  - Entregáveis da função:
    - Protótipos navegáveis das telas
    - Guia de estilos básico

## Entrega 

Para contemplar as entregas previstas de cada função, temos uma lista de entregáveis para cada semestre letivo. A lista deve ser entregue até o dia 29/06/2026 (segunda-feira) para os seguintes e-mails: felipe.castro@ifnmg.edu.br e luiz.salazar@ifnmg.edu.br. O responsável pelo envio dos itens obrigatórios é o PO de cada equipe.


### Para a disciplina de Práticas de Profissionais Integradoras I:

- Modelagem conceitual e lógica do banco de dados;
- Tabela de Requisitos contendo os Requisitos Funcionais (RF) e os Não-Funcionais (RNF);
- Código do backend desenvolvido, usando alguma arquitetura de software (ex: em camadas) e design de software (ex: padrões de projeto);
- Repositório do projeto disponibilizado por meio de um sistema para versionamento de código (ex: Git/Github);
- Códigos do sistema embarcado com Arduino, capaz de enviar dados pela porta serial USB;
- Prótotipos das telas para o sistema de visualização de dados, utilizando design systems e heurísticas de usabilidade;
- Guia de estilo com as definições do design systems.
- Artigo relacionado ao trabalho desenvolvimento do sistema.

### Para a disciplina de Práticas de Profissionais Integradoras II

- Implementação do frontend no sistema de visualização de dados;
- Aplicação de uma linguagem de marcação (HTML5, XHTML etc.) e de uma linguagem de estilos (CSS, XSL etc.) combinada a outras possibilidades de desenvolvimento front-end (Javascript, Typescript, React etc.).
- Modelo de negócio no Canva;
- As devidas atualizações que foram executadas nos entregáveis anteriores.
- Versão final do artigo relacionado ao trabalho desenvolvimento do sistema.

## Apresentações

As apresentações ocorrerão nos dias 06, 08 e 09/07/2026 (segunda, quarta e quinta), durante os horários das disciplinas de Banco de Dados I e Práticas Profissionais Integradoras I. Cada equipe terá 30 minutos para sua exposição. Em seguida, será aberta a arguição da banca de avaliação.

Durante a exposição, recomenda-se à equipe que comece apresentando a contextualização de seu trabalho (proposta, objetivos, ferramentas etc.). Na segunda parte, passe para a apresentação em tempo real do sistema (demonstração de testes). Por fim, conclua sua apresentação e aguarde a fala dos membros da banca. Após a exposição da equipe, 30 minutos serão disponibilizados para perguntas e considerações da banca.

O cronograma de agendamento será divulgado posteriormente, mas sempre ocorrerá nos horários noturnos. Dito isso, é importante ressaltar que todos os membros da equipe devem apresentar no seminário final e que perguntas podem ser feitas pela banca a qualquer um dos integrantes do grupo.


## Distribuição de pontos

Este projeto valerá 100 pontos dentro da disciplina Práticas Profissionais Integradoras I, sendo a distribuição definida da seguinte forma:

1. O sistema desenvolvido, que se refere aos requisitos obrigatórios e extras implementados, a aplicação de padrões de software e a estruturação em camadas do back-end e front-end: 40 pontos;
2. A documentação técnica do sistema, que se refere à modelagem do sistema e à qualidade da escrita: 30 pontos;
3. A apresentação do sistema, que se refere às habilidades de oratória, apresentação visual e a organização: 30 pontos.

Os elementos serão analisados e avaliados pelos membros das bancas de avaliação. Cada membro avaliará o projeto entre 0 e 100 por cento. A nota final da equipe será a média aritmética simples das notas lançadas pelos membros da banca.

### Barema de avaliação

| Critérios de Avaliação | Pontuação Máxima |
| :--- | :--- |
| **Desenvolvimento do Sistema (40% da avaliação)** | |
| O sistema possui muitas funcionalidades que vão além dos requisitos obrigatórios (extras)? | 10 por cento |
| O código utiliza boas práticas de programação (estrutura em camadas, padrões de código etc.)? | 10 por cento |
| As modelagens do banco de dados e a documentação do sistema estão coerentes com o que foi desenvolvido? | 10 por cento |
| Os conhecimentos técnicos foram aplicados de forma satisfatória durante o semestre (registro via Github)? | 10 por cento |
| | |
| **Documentação (30% da avaliação)** | |
| O artigo apresenta boa ortografia, coesão e coerência, demonstrando claramente as ideias dos autores? | 10 por cento | 
| O texto do artigo apresenta abrangência e profundidade, indicando outras referências científicas sobre o assunto? | 10 por cento |
| Todos os entregáveis exigidos estão presentes no artigo e possuem boa qualidade de resolução da imagem? | 8 por cento |
| O modelo de formatação do documento foi utilizado corretamente para inserção dos elementos textuais e visuais? | 2 por cento |
| | |
| **Apresentação (30% da avaliação)** | |
| Os membros demonstraram domínio do trabalho feito, apresentando clareza e coerência? | 10 por cento |
| A equipe teve boa postura durante a apresentação e utilizou vestimenta condizente com o momento? | 8 por cento |
| Os elementos textuais e audiovisuais (imagens, vídeos etc.) contribuíram para a apresentação? | 5 por cento |
| A equipe controlou bem o tempo de apresentação? | 5 por cento |
| Todos os membros da equipe estavam presentes? | 2 por cento |

## Demais considerações
As questões que não foram esclarecidas neste documento serão analisadas pelos professores e a decisão será divulgada posteriormente. **Boa sorte e que a Força esteja com vocês!**
