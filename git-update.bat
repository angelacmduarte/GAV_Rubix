@echo off
REM Script batch para atualizar o repositório Git
REM Uso: git-update.bat "Mensagem do commit"

setlocal

if "%1"=="" (
    set MENSAGEM=Atualização do projeto
) else (
    set MENSAGEM=%1
)

echo ========================================
echo   Atualizando repositório Git
echo ========================================
echo.

REM Verificar se estamos em um repositório Git
if not exist .git (
    echo ERRO: Este diretório não é um repositório Git!
    exit /b 1
)

REM Verificar status
echo Verificando status do repositório...
git status --short
if %ERRORLEVEL% NEQ 0 (
    echo Nenhuma alteração para commitar.
    exit /b 0
)

echo.
echo Adicionando arquivos ao staging...
git add .
if %ERRORLEVEL% NEQ 0 (
    echo ERRO ao adicionar arquivos!
    exit /b 1
)

echo Arquivos adicionados com sucesso!
echo.

REM Fazer commit
echo Fazendo commit com mensagem: '%MENSAGEM%'
git commit -m "%MENSAGEM%"
if %ERRORLEVEL% NEQ 0 (
    echo ERRO ao fazer commit!
    exit /b 1
)

echo Commit realizado com sucesso!
echo.

REM Fazer push
echo Enviando alterações para o repositório remoto...
git push
if %ERRORLEVEL% NEQ 0 (
    echo ERRO ao fazer push!
    echo Verifique sua conexão e credenciais do GitHub.
    exit /b 1
)

echo.
echo ========================================
echo   Atualização concluída com sucesso!
echo ========================================

endlocal

