# Guia de Uso do Git - GAV Rubix

## Scripts de Atualização

Foram criados dois scripts para facilitar as atualizações do repositório:

### 1. Script PowerShell (git-update.ps1)

**Uso:**
```powershell
# Com mensagem personalizada
.\git-update.ps1 "Adicionei nova funcionalidade"

# Com mensagem padrão
.\git-update.ps1
```

### 2. Script Batch (git-update.bat)

**Uso:**
```cmd
# Com mensagem personalizada
git-update.bat "Adicionei nova funcionalidade"

# Com mensagem padrão
git-update.bat
```

## O que os scripts fazem:

1. ✅ Verificam se há alterações
2. ✅ Adicionam todos os arquivos modificados
3. ✅ Fazem commit com a mensagem fornecida
4. ✅ Enviam as alterações para o GitHub

## Comandos Git Manuais

Se preferir fazer manualmente:

```bash
# Ver status das alterações
git status

# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Sua mensagem aqui"

# Enviar para o GitHub
git push
```

## Dicas

- Use mensagens de commit descritivas
- Faça commits frequentes
- Sempre verifique o status antes de commitar
- Em caso de erro, verifique sua conexão com o GitHub

