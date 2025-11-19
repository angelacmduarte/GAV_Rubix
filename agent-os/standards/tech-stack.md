# Tech Stack

## Context

Global tech stack defaults for Agent OS projects, overridable in project-specific `.agent-os/product/tech-stack.md`.

## Application Framework
- **API Framework:** Flask 3.0+
- **Language:** Python 3.11.5

## Database
- **Development Database:** SQLite 3+
- **Production Database:** SQL Server (Azure SQL Database)
- **ORM:** SQLAlchemy 2.0+
- **Database Migrations:** Flask-Migrate (Alembic)

## Frontend Stack

### Javascript Framework
- **Framework** React
- **Version** Latest stable
- **Build Tool:** Create React App (react-scripts 5.0+)
- **Package Manager:** npm
- **Node Version:** 22 LTS
- **UI Framework:** Material-UI (MUI) 5.14+
- **Icons:** Material-UI Icons
- **Routing:** React Router DOM 6.8+
- **Validation:** Yup 1.3+
- **Date Handling:** date-fns 4.1+
- **Font Provider:** Google Fonts (via MUI)
- **Python Package Manager:** pip with requirements.txt
- **Python Environment:** Anaconda 3 / conda virtual environments
- **Development OS:** Windows

### Mobile Framework
- **Linguagem de Programação** Dart
- **Framework de UI** Flutter
- **Gerenciamento de Dependências** Pub
- **Comunicação com API** http
- **Cliente HTTP** Dio
- **Armazenamento Local** shared_preferences / sqflite
- **Processo de Compilação e Distribuição** Android: .apk / iOS: .ipa

## Backend Dependencies
- **Express.js** Core web framework
- **cors** Cross-Origin Resource Sharing handling
- **dotenv** Environment variable management
- **jsonwebtoken** JSON Web Token authentication
- **joi (ou class-validator)** Object validation and schema definition (similar to Marshmallow's validation aspects)
- **express-rate-limit** Rate limiting and API throttling
- **mssql (ou tedious)** SQL Server database driver (production)

## Frontend Dependencies
- **@mui/material:** Core Material-UI components
- **@mui/icons-material:** Material-UI icon components
- **@emotion/react & @emotion/styled:** CSS-in-JS styling (MUI dependency)
- **react-router-dom:** Client-side routing
- **yup:** Schema validation
- **date-fns:** Modern date utility library
- **jwt-decode:** JWT token decoding
- **@testing-library/react:** React component testing utilities
- **@testing-library/jest-dom:** Custom Jest matchers

## Development Configuration
- **Development Proxy:** Backend API at http://127.0.0.1:5000
- **Test Runner:** Jest (via react-scripts)
- **Linting:** ESLint (react-app configuration)
- **Browser Support:** Modern browsers (>0.2% usage)
- **Local Database:** SQLite file-based database
- **Python Environment Path:** C:\Users\dtiDIgital\anaconda3
- **Virtual Environment:** venv created via Anaconda Python

## Infrastructure & Deployment (Azure Cloud)
- **Application Hosting:** Azure App Service
- **Hosting Region:** Primary region based on user base
- **Database Hosting:** Azure SQL Database
- **Database Backups:** Azure automated backups and point-in-time restore
- **Asset Storage:** Azure Blob Storage
- **CDN:** Azure CDN
- **Asset Access:** Private with SAS tokens
- **CI/CD Platform:** Azure DevOps / GitHub Actions
- **CI/CD Trigger:** Push to main/staging branches
- **Tests:** Run before deployment (pytest for backend, Jest for frontend)
- **Production Environment:** main branch
- **Staging Environment:** staging branch
- **API-Frontend Communication:** RESTful API with JSON
- **Development Server:** Flask development server (backend) + React development server (frontend)
- **Database Connection:** Environment-based configuration (SQLite for dev, SQL Server for production)
- **Authentication:** Azure Active Directory (optional)
- **Monitoring:** Azure Application Insights
- **Logging:** Azure Monitor

