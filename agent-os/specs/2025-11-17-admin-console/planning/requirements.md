# Admin Console — Requirements (Shape Spec)

## 1. Objetivo & Contexto
- Criar a “tela geral” do sistema para configuração dos relatórios/temas (Trabalho Híbrido, Health Check, 1-1s, Feedbacks etc., com possibilidade de adicionar novos).
- Essa tela deve existir dentro do módulo Admin, mas precisa prever botões/indicadores compartilhados com as demais sessões (gestores e GAV Rubix).
- Deve aplicar obrigatoriamente a paleta “Guia de Cores 2025” (`planning/visuals/Guia de Cores 2025.pdf`).

## 2. Layout & Navegação
- Uma única página Admin agrupando várias seções (cards) — cada tema ganha sua própria seção na mesma tela.
- Não há hierarquia nem navegação em abas/wizards; preferir grid responsivo com cards expandíveis conforme novos temas forem adicionados.
- Cada seção deve exibir:
  - Nome do tema.
  - Campos de configuração (links SharePoint, parâmetros futuros).
  - Status do último carregamento / alertas.
  - Ações “Testar conexão” e “Salvar/Publish”.

## 3. Configurações por Tema
- Campos obrigatórios:
  - **Link(s) SharePoint**: mínimo um por tema, mas Trabalho Híbrido exige dois arquivos iniciais. Outros temas podem receber múltiplos links no futuro.
  - Metadados adicionais ficarão “reservados” para fases futuras (ex.: filtros, owners, frequência customizada).
- Ao conectar um arquivo:
  - Ler o arquivo e exibir alerta com abas importadas + quantidade de linhas.
  - Mostrar data da última alteração do arquivo e caminho completo.

## 4. Atualizações de Dados
- **Automática (07h todos os dias)**: rotina interna do sistema dispara, sem depender de agendador externo.
- **Manual (botão)**:
  - O botão deve estar disponível no Admin e também nas demais sessões (gestores / GAV).
  - Qualquer usuário com acesso ao sistema pode acionar.
  - Próximo ao botão, exibir a última atualização em formato `dd/mm/aaaa; hh:mm`.
  - Registrar status/logs visíveis no Admin (ex.: sucesso, falha, tempo de execução).

## 5. Fluxo de Publicação & QA
- Antes de publicar alterações, é obrigatório “Testar”:
  - Executar validação automatizada via MCP Playwright.
  - Perguntar sempre se o usuário deseja executar um teste manual complementar.
- Somente após testes bem-sucedidos, permitir que as novas configurações sejam publicadas e propagadas aos dashboards.
- Considerar estados “Rascunho” e “Publicado” para cada tema.

## 6. Paleta & Identidade
- Usar tons principais da paleta dti (azul marinho #000066, azul violeta #3038D5, azul teal #0D9FB5, azul claro #40E6F2, amarelo #FAA919, laranja #FC6D3A, cinzas #E5E5E5/#F4F4F4 e preto #010B0C).
- Diretriz adicional: manter a interface clean, com fundo predominantemente claro e uso moderado das cores de destaque (sem poluição visual ou excesso de gradientes). Reservar cores vibrantes apenas para CTAs, estados e highlights relevantes.
- Elementos referentes a dados consolidados da enterprise devem usar as cores específicas da enterprise (Rubix) quando aplicável.
- Criar proposta inicial de layout simples (wireframe/Mock) para validação com o usuário.

## 7. Status & Métricas na Tela
- No topo da tela Admin, exibir cartões de status:
  - Resultado da execução automática das 07h (última corrida + health).
  - Alertas recentes (ex.: falha no arquivo X, teste manual pendente).
- Por tema, mostrar:
  - Última ingestão bem-sucedida, horário e usuário que acionou (no caso manual).
  - Quantidade de registros importados e mudanças detectadas.

## 8. Permissões & Segurança (fase atual)
- Não haverá autenticação “pesada” nesta fase; qualquer usuário com acesso ao sistema pode usar o Admin.
- Só precisamos garantir que o botão “Atualizar” não seja disparado múltiplas vezes simultaneamente (usar estado/desabilitar enquanto executa).
- Preparar o layout para futura integração com Azure AD.

## 9. Abertos / Itens para Validação
- Confirmar layout sugerido (wireframe a ser apresentado).
- Definir limites de quantidade de links por tema (UI deve ser flexível).
- Confirmar formato dos alertas/logs (modal vs drawer vs toaster).
- Decidir se o histórico de execuções precisa ser exportável.

## 10. Artefatos
- Paleta oficial: `agent-os/specs/2025-11-17-admin-console/planning/visuals/Guia de Cores 2025.pdf`
- Ainda não foram fornecidos wireframes ou mockups; aguardando validação após proposta inicial.

