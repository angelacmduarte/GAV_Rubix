# Specification: Admin Console

## Goal
Centralizar a configuração dos relatórios/temas do GAV Rubix em uma única tela administrativa, garantindo governança das fontes SharePoint, botões de atualização automática/manual e validações antes da publicação das mudanças.

## User Stories
- Como gestor responsável, quero configurar links e parâmetros de cada relatório em um único painel para manter os dashboards sempre atualizados.
- Como membro do time, quero acionar a atualização manual e ver o horário da última sincronização para ter confiança nos dados exibidos.
- Como responsável por governança, quero validar e publicar alterações apenas após testes automatizados/manual confirmados para preservar a qualidade das informações.

## Specific Requirements

**Unified Admin Layout**
- Página única responsiva, organizada em cards/seções por tema (Trabalho Híbrido, Health Check, 1-1, Feedbacks e futuros).
- Cabeçalho global com KPIs de execução (status da rotina das 07h, alertas recentes, total de temas configurados).
- Grid deve suportar expansão/reordenação de seções sem exigir navegação adicional.
- Breadcrumb simples “GAV Rubix / Admin Console” para indicar contexto.

**Theme Configuration Cards**
- Cada card mostra: nome do tema, descrição curta, status atual (“Publicado” ou “Rascunho”), último editor e horário da última ingestão.
- Campos editáveis: lista dinâmica de links SharePoint (mínimo um; Trabalho Híbrido inicia com dois inputs).
- Botões por card: “Testar”, “Publicar”, “Salvar rascunho”, “Ver histórico”.
- Campos reservados para futuros parâmetros devem aparecer colapsados/“Em breve” para manter layout limpo.

**SharePoint Connector Experience**
- Ao adicionar/editar link, validar formato (URL https) e opcionalmente nomear a fonte.
- Após salvar um link, executar leitura rápida: listar abas detectadas + quantidade de linhas por aba, data da última alteração e caminho completo.
- Mostrar alerta persistente no card com resultado da leitura; permitir download do log em CSV/JSON.
- Suportar múltiplos arquivos por tema (UI com botão “Adicionar origem”).

**Data Refresh Controls**
- Botão “Atualizar agora” presente no topo do Admin e replicado como componente reutilizável em outras sessões (menu gestores e GAV).
- Estado do botão: normal, executando (spinner + desabilitado), sucesso/falha (toast + registro).
- Última atualização exibida ao lado do botão no formato `dd/mm/aaaa; hh:mm`, referenciando a origem (automática vs manual + usuário).
- Evitar execuções concorrentes: bloquear novo disparo até finalizar ou permitir fila com aviso “execução em andamento”.

**Publication Workflow & QA**
- Fluxo: editar → testar (MCP Playwright) → prompt perguntando se deseja teste manual → publicar.
- Painel “Testes” por card com logs dos últimos testes, incluindo duração e resultado.
- Se testes falharem, impedir publicação e destacar mensagem com instruções de correção.
- Estados por card: “Rascunho”, “Aguardando testes”, “Aprovado para publicação”, “Publicado”. Histórico deve registrar data e usuário.

**Status & Telemetry**
- Cards no topo: “Rotina 07h” (último run, duração, próximo agendamento), “Alertas”, “Atualizações manuais recentes”.
- Por tema: tabela/accordion com registros das últimas execuções (timestamp, gatilho, linhas importadas, mudanças detectadas).
- Mostrar contagem de linhas e abas após cada ingestão; se divergirem muito do histórico, sinalizar alerta.

**Palette & Visual Cleanliness**
- Fundo predominante #F4F4F4/#FFFFFF; cards com bordas #E5E5E5 e títulos em #000066.
- Cores vibrantes (#3038D5, #0D9FB5, #FAA919, #FC6D3A) reservadas para CTAs, badges de status e alertas críticos, mantendo visual clean.
- Elementos referentes a dados consolidados da enterprise podem usar o gradiente Rubix (`#009AEC`, `#052A9E`, `#7E5CE6`) em ícones ou highlights sutis.
- Garantir contraste AA para texto principal; usar #010B0C ou #000000 em textos sobre fundos claros.

**Extensibility & Security Prep**
- Arquitetura dos cards deve suportar registro dinâmico de novos temas via schema/metadata.
- Prever interface para integração futura com Azure AD (placeholder para “Acesso restrito em breve”).
- Logs de atualização devem ser armazenados no backend (SQLite/Azure SQL) com API para consulta paginada.
- Componentes React devem seguir padrões de `agent-os/standards/frontend/components.md` (responsabilidade única, props controladas).

## Visual Design

**`planning/visuals/Guia de Cores 2025.pdf`**
- Conjunto principal de azuis (#000066, #3038D5, #0D9FB5, #40E6F2) para fundos, títulos e estados informativos.
- Tons de destaque (#FAA919, #FC6D3A) para alertas e CTAs críticos; usar com baixo preenchimento para evitar poluição visual.
- Cinzas #E5E5E5 e #F4F4F4 para cards/bordas, mantendo a interface clean e com alto contraste.
- Paleta enterprise Rubix (#009AEC, #052A9E, #7E5CE6, #0BDA5E, #E6441C, #FC2275) disponível para representar dados consolidados quando necessário.

## Existing Code to Leverage

**`agent-os/standards/tech-stack.md`**
- Define uso de React + MUI 5 + React Router; cards e grids podem reaproveitar componentes MUI padrão.
- Backend padrão Flask + SQLAlchemy fornece APIs REST para persistir configurações e logs.
- Diretrizes de infraestrutura (Azure App Service, Azure SQL) orientam orquestração da rotina das 07h e logs centralizados.

**`agent-os/standards/frontend/components.md`**
- Orienta design de componentes com responsabilidade única, favorecendo reutilização do botão “Atualizar” e dos cards configuráveis.
- Reforça composições simples e props explícitas, úteis para construir o layout modular sem duplicação.

## Out of Scope
- Implementar autenticação/SSO via Azure AD (apenas planejamento futuro).
- Construir dashboards de gestores ou GAV (somente expõem o botão compartilhado).
- Criar motores de ingestão complexos ou ETLs além da leitura de arquivos SharePoint configurados.
- Automação de testes além do gatilho Playwright + prompt manual descrito.
- Suporte mobile nativo/Flutter — somente a console web.
- Exportação avançada de históricos (CSV básico já suficiente).
- Customização visual fora da paleta aprovada (temas dark, gradientes extras).


