# Raw Idea — Admin Console

## Context
- Produto: Plataforma de gestão à vista GAV Rubix.
- Roadmap: Prioridade atual é o item 3 — Admin Console.
- Objetivo imediato: criar uma “tela geral” que permita configurar fontes (links SharePoint), parâmetros e botões globais.

## Requisitos já conhecidos
1. **Seções de configuração por relatório/tema** (Trabalho Híbrido, Health Check, 1-1s, Feedbacks etc.).
2. **Cadastro de links SharePoint** que alimentam cada painel.
3. **Botão de atualização manual** acessível também fora da área admin (última atualização deve ficar próxima ao botão).
4. **Atualização automática diária às 07h**, acionada pelo próprio sistema.
5. **Sem autenticação complexa** nesta fase (mas deve prever futura integração AAD).
6. **Aplicação da paleta “Guia de Cores 2025”** enviada no PDF (`Files/Guia de Cores 2025 (2).pdf`) — cores principais:
   - Azul marinho #000066
   - Azul violeta #3038D5
   - Azul teal #0D9FB5
   - Azul claro #40E6F2
   - Amarelo #FAA919
   - Laranja #FC6D3A
   - Cinza claro #E5E5E5 / #F4F4F4
   - Preto profundo #010B0C

## Escopo a detalhar no spec
- UX geral do Console (layout, navegação, cards por relatório, campos obrigatórios).
- Modelo de dados para armazenar links e metadados de cada relatório.
- Ações administrativas (teste de conexão, salvar rascunho, publicar/propagar para dashboards).
- Governança do botão de atualização (permissões, logs, indicadores de status).
- Tratamento para variáveis adicionais (ex.: filtros por tribo, ordem das telas GAV).

> Este documento captura a descrição original fornecida pelo usuário antes da fase de requirements research.


