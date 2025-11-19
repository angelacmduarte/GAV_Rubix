# Script para atualizar o repositório Git
# Uso: .\git-update.ps1 "Mensagem do commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$mensagem = "Atualização do projeto"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Atualizando repositório Git" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos em um repositório Git
if (-not (Test-Path .git)) {
    Write-Host "ERRO: Este diretório não é um repositório Git!" -ForegroundColor Red
    exit 1
}

# Verificar status
Write-Host "Verificando status do repositório..." -ForegroundColor Yellow
$status = git status --porcelain

if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "Nenhuma alteração para commitar." -ForegroundColor Green
    exit 0
}

Write-Host ""
Write-Host "Alterações encontradas:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Adicionar arquivos
Write-Host "Adicionando arquivos ao staging..." -ForegroundColor Yellow
git add .

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao adicionar arquivos!" -ForegroundColor Red
    exit 1
}

Write-Host "Arquivos adicionados com sucesso!" -ForegroundColor Green
Write-Host ""

# Fazer commit
Write-Host "Fazendo commit com mensagem: '$mensagem'" -ForegroundColor Yellow
git commit -m $mensagem

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao fazer commit!" -ForegroundColor Red
    exit 1
}

Write-Host "Commit realizado com sucesso!" -ForegroundColor Green
Write-Host ""

# Fazer push
Write-Host "Enviando alterações para o repositório remoto..." -ForegroundColor Yellow
git push

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO ao fazer push!" -ForegroundColor Red
    Write-Host "Verifique sua conexão e credenciais do GitHub." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Atualização concluída com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

