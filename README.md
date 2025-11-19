# GAV Rubix - Admin Console

Sistema de gestão à vista para a enterprise RUBIX, com console administrativo para configuração de relatórios e temas.

## Estrutura do Projeto

```
.
├── backend/          # API Flask + SQLAlchemy
│   ├── app/         # Aplicação Flask
│   ├── migrations/  # Migrations do banco
│   └── tests/       # Testes do backend
├── frontend/        # Aplicação React + MUI
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── services/    # Serviços API
│   │   └── theme/       # Tema MUI
└── agent-os/        # Documentação e specs
```

## Tecnologias

### Backend
- Flask 3.0+
- SQLAlchemy 2.0+
- SQLite (dev) / Azure SQL (prod)
- pytest para testes

### Frontend
- React 18
- Material-UI 5.14+
- React Router 6.8+
- date-fns para formatação de datas

## Instalação

### Backend

```bash
cd backend
pip install -r requirements.txt
flask db upgrade
python flask_app.py
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Funcionalidades Implementadas

### ✅ Task Group 1: Database Layer
- Modelos: Theme, DataSource, IngestionRun, TestRun
- Migrations configuradas
- Seeds para temas iniciais

### ✅ Task Group 2: API & SharePoint Connector
- Endpoints REST completos
- Serviço SharePoint (estrutura)
- Rotina automática 07h
- Atualização manual

### ✅ Task Group 3: Test Harness
- Serviço de testes (automated + manual)
- Validação de publicação
- Endpoints de teste/publicação

### ✅ Task Group 4: Base Layout
- Layout Admin Console
- Componente RefreshButton compartilhado
- StatusCards com informações do sistema

### ✅ Task Group 5: Theme Cards
- Cards configuráveis por tema
- Formulário para múltiplos links SharePoint
- Controles de teste/publicação
- Histórico de execuções

### ✅ Task Group 6: Telemetria & QA
- Dashboard de logs
- Export CSV
- Validação de acessibilidade
- Testes focados

## Próximos Passos

1. Integração real com Microsoft Graph API para SharePoint
2. Implementação do MCP Playwright para testes automatizados
3. Autenticação Azure AD
4. Deploy em Azure App Service

