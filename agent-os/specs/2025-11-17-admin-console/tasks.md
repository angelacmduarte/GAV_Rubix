# Task Breakdown: Admin Console

## Overview
Total Tasks: 16

## Task List

### Data & Persistence Layer

#### Task Group 1: Config Schemas & Migrations
**Dependencies:** None

- [x] 1.0 Finalizar camada de dados
  - [x] 1.1 Escrever 2-4 testes focados para modelos de configuração (validação de URLs, estados rascunho/publicado)
  - [x] 1.2 Criar modelos e migrations (`themes`, `data_sources`, `ingestion_runs`, `test_runs`)
    - Campos principais: nome, descrição, status, ordem, timestamps
    - `data_sources` aceita múltiplos links por tema + metadados (tipo, owner futuro, caminho completo)
  - [x] 1.3 Definir relacionamentos e índices (FKs, unique por tema+ordem, índices em timestamps)
  - [x] 1.4 Seeds/base fixtures para temas iniciais (Trabalho Híbrido com 2 fontes, Health Check, 1-1, Feedbacks)
  - [x] 1.5 Executar somente os testes de 1.1 e validar migrations

**Acceptance Criteria:**
- Modelos salvam/validam dados obrigatórios e múltiplas fontes por tema
- Migrations aplicadas sem erro
- Relacionamentos e índices conferem

### Backend Services & APIs

#### Task Group 2: Config API & SharePoint Connector
**Dependencies:** Task Group 1

- [x] 2.0 Completar camada API/serviços
  - [x] 2.1 Escrever 2-6 testes focados para endpoints (criar/atualizar temas, adicionar fonte, consultar logs)
  - [x] 2.2 Implementar endpoints REST (Flask) para CRUD de temas e fontes + histórico de execuções
  - [x] 2.3 Construir serviço SharePoint (download dos arquivos, leitura de abas/linhas, captura de metadata)
  - [x] 2.4 Registrar logs de ingestão e testes (persistir em `ingestion_runs`, `test_runs`, expor filtros por intervalo)
  - [x] 2.5 Implementar rotina automática 07h + bloqueio de execuções concorrentes
  - [x] 2.6 Garantir que respostas contenham status e contagens para alimentar UI
  - [x] 2.7 Rodar apenas os testes criados em 2.1

**Acceptance Criteria:**
- Endpoints CRUD retornam JSON consistente e validam entradas
- Serviço SharePoint lista abas/linhas e armazena data/caminho
- Agendamento diário roda e respeita locks
- Logs expostos via API

#### Task Group 3: Test Harness & Playwright Bridge
**Dependencies:** Task Group 2

- [x] 3.0 Habilitar fluxo "Testar antes de publicar"
  - [x] 3.1 Escrever 2-4 testes focados cobrindo triggers de Playwright e registro de status
  - [x] 3.2 Criar endpoint/serviço que invoca MCP Playwright com parâmetros do tema e coleta resultado/duração
  - [x] 3.3 Implementar prompt para confirmação de teste manual (flag no backend + log)
  - [x] 3.4 Atualizar estados do tema conforme resultado (rascunho → aguardando testes → publicado)
  - [x] 3.5 Executar somente os testes definidos em 3.1

**Acceptance Criteria:**
- API rejeita publicação sem testes aprovados
- Logs armazenam duração, executor e status (auto/manual)
- UI recebe estados corretos

### Frontend Admin Console

#### Task Group 4: Base Layout & Shared Controls
**Dependencies:** Task Group 2

- [x] 4.0 Estruturar layout principal
  - [x] 4.1 Escrever 2-4 testes focados (renderização do layout, botão atualizar reutilizável)
  - [x] 4.2 Criar shell "Admin Console" (breadcrumb, header, cartões de status globais)
  - [x] 4.3 Implementar componente compartilhado de botão "Atualizar agora" (estado idle/running/success/fail, timestamp)
  - [x] 4.4 Consumir endpoints de status (execução 07h, alertas recentes)
  - [x] 4.5 Garantir responsividade básica e visual clean usando paleta oficial
  - [x] 4.6 Rodar apenas os testes de 4.1

**Acceptance Criteria:**
- Layout segue guia clean, com cards globais funcionalmente conectados
- Botão de atualização funciona e exibe timestamp
- Componentes passam testes básicos

#### Task Group 5: Theme Cards & Forms
**Dependencies:** Task Group 4

- [x] 5.0 Construir cards configuráveis por tema
  - [x] 5.1 Escrever 2-6 testes focados (adicionar fonte, feedback após leitura, fluxo testar/publicar)
  - [x] 5.2 Criar formulário dinâmico para múltiplos links (validação URL, ordenação, remoção)
  - [x] 5.3 Integrar feedback de leitura (abas, linhas, data alteração, caminho completo)
  - [x] 5.4 Adicionar controles Testar/Publicar/Salvar + indicador de estado
  - [x] 5.5 Mostrar histórico/alertas por tema (accordion ou modal)
  - [x] 5.6 Respeitar paleta (cards claros, cores vibrantes apenas para CTAs/alerts, usar cores enterprise para dados consolidados)
  - [x] 5.7 Executar somente os testes definidos em 5.1

**Acceptance Criteria:**
- Usuário consegue adicionar múltiplos links, ver validações e salvar rascunho/publicar
- Logs de ingestão/testes aparecem por tema
- UI mantém aparência clean e responsiva

### Observabilidade & Finalização

#### Task Group 6: Telemetria, Logs e QA Final
**Dependencies:** Task Groups 1-5

- [x] 6.0 Consolidar monitoramento e completar QA dirigido
  - [x] 6.1 Escrever até 6 testes adicionais cobrindo fluxo ponta a ponta (API + UI) conforme lacunas críticas
  - [x] 6.2 Implementar dashboard interno de logs (filtro por período, export CSV simples)
  - [x] 6.3 Validar bloqueio de execuções simultâneas e mensagens de alerta
  - [x] 6.4 Revisar acessibilidade/contraste conforme padrões (WCAG AA)
  - [x] 6.5 Executar apenas os testes definidos em 6.1 + smoke manual orientado

**Acceptance Criteria:**
- Logs acessíveis via UI e exportáveis
- Fluxos críticos testados ponta a ponta
- Políticas de atualização (auto/manual) respeitam bloqueios e exibem status corretos

## Execution Order
1. Task Group 1 — modelos e migrations
2. Task Group 2 — APIs e conectores
3. Task Group 3 — fluxo de testes/publicação
4. Task Group 4 — layout base + botões globais
5. Task Group 5 — cards por tema
6. Task Group 6 — telemetria e QA final

