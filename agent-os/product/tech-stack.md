# Tech Stack — GAV Rubix

## Backend
- **Framework:** Flask 3.0+
- **Linguagem:** Python 3.11.5
- **ORM/Migrations:** SQLAlchemy 2.0+ + Flask-Migrate (Alembic)
- **Autenticação (futura):** Azure Active Directory (planejado)
- **Integrações:** Conectores para SharePoint/OneDrive via Microsoft Graph API; scripts agendados para ingestão diária às 07h.

## Frontend Web
- **Framework:** React (CRA react-scripts 5+)
- **Linguagem:** TypeScript/JavaScript ES2022
- **UI:** Material UI 5.14+, @emotion para estilização
- **Roteamento:** React Router DOM 6.8+
- **Formulários/Validação:** React Hook Form + Yup 1.3+
- **Datas:** date-fns 4.1+
- **Gerenciamento de Estado:** Context API + hooks específicos por módulo (Redux opcional em fases futuras)

## Mobile / Displays
- **Stack Opcional:** Flutter + Dart (para companion app ou dashboards mobile, conforme padrão global)
- **Build:** Android (.apk) / iOS (.ipa) usando pipelines Azure DevOps se necessário.

## Banco de Dados & Storage
- **Dev:** SQLite 3+
- **Prod:** Azure SQL Database (SQL Server)
- **Cache/Queue (opcional):** Azure Storage Queue ou Redis gerenciado para pré-processar atualizações.

## DevOps & Infra
- **Hospedagem:** Azure App Service (frontend + backend), Azure Blob Storage para assets.
- **CI/CD:** GitHub Actions ou Azure DevOps com testes (pytest/Jest) antes do deploy.
- **Monitoramento:** Azure Application Insights + Azure Monitor.
- **Logs:** Centralizados em Azure Log Analytics.
- **Atualização Agendada:** Azure Functions/Logic Apps ou cron container disparando ingestão diária às 07h.

## Qualidade
- **Testes Backend:** pytest
- **Testes Frontend:** Jest + Testing Library
- **Linting:** ESLint (React) e Flake8/Black (Python)

## Segurança & Acesso
- **Controle Inicial:** Escopos por perfil (Gestor vs Time) definidos via configuração interna.
- **Autenticação/SSO:** Incorporar AAD antes de GA; até lá, whitelists ou login simplificado para Admin.
- **Proteção Dados:** Variáveis sensíveis em Azure Key Vault; comunicação HTTPS obrigatória.


