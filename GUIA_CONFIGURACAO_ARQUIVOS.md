# 📋 Guia: Como Configurar Arquivos no Admin Console

## 🎯 Onde Inserir os Caminhos dos Arquivos

### Passo a Passo:

1. **Acesse o Admin Console**
   - No menu lateral, clique em "Admin Console"
   - Ou acesse diretamente: `http://localhost:3000/admin`

2. **Localize o Card "Trabalho Híbrido"**
   - Na seção "Configuração de Temas"
   - Você verá um card com o título "Trabalho Híbrido"

3. **Expanda a Seção "Configuração de Arquivos"**
   - No card, há um accordion (seção expansível) chamado:
     - **"📁 Configuração de Arquivos"**
   - Clique para expandir
   - Se faltam arquivos, aparecerá um aviso amarelo: "⚠ Faltam X arquivo(s)"

4. **Adicione os Arquivos**
   - Dentro do accordion expandido, você verá:
     - **Arquivos já configurados** (se houver)
     - **Formulário para adicionar novo arquivo**
   - No formulário, preencha:
     - **URL do Arquivo SharePoint**: Cole a URL completa do arquivo Excel
     - **Nome do Arquivo** (opcional): Dê um nome descritivo
   - Clique em **"Adicionar Arquivo"**

5. **Confirmação**
   - Após adicionar, o sistema:
     - Lê o arquivo automaticamente
     - Mostra quantas abas e linhas foram detectadas
     - Exibe um alerta de sucesso

### Para "Trabalho Híbrido":
- **São necessários 2 arquivos Excel**
- O sistema mostrará um aviso até que ambos estejam configurados
- Você pode adicionar os 2 arquivos um após o outro

### Exemplo de URL do SharePoint:
```
https://exemplo.sharepoint.com/sites/NomeDoSite/Shared%20Documents/arquivo.xlsx
```

---

## 🔍 Visualização no Sistema

```
Admin Console
├── Status Cards (topo)
└── Configuração de Temas
    └── Card: Trabalho Híbrido
        ├── Botões: [Testar] [Publicar] [Ver Histórico]
        └── 📁 Configuração de Arquivos (ACCORDION - CLIQUE AQUI!)
            ├── Arquivos Configurados (se houver)
            └── Formulário para Adicionar
                ├── Campo: URL do SharePoint
                ├── Campo: Nome (opcional)
                └── Botão: [Adicionar Arquivo]
```

---

## ⚠️ Importante

- O accordion **"Configuração de Arquivos"** pode estar **fechado por padrão**
- Você precisa **clicar nele** para expandir e ver o formulário
- Para "Trabalho Híbrido", o accordion ficará com fundo amarelo se faltarem arquivos

