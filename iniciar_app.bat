@echo off
title Mundial 2026 - Servidor
color 0A

echo ===================================================
echo      MUNDIAL 2026 - GESTOR DE TORNEIO
echo ===================================================
echo.

echo [1/4] A procurar atualizacoes no GitHub...
git pull origin main

echo.
echo [2/4] A instalar dependencias...
call npm install

echo.
echo [3/4] A compilar a aplicacao...
call npm run build

echo.
echo [4/4] A iniciar o servidor...
echo.
echo Aceda a aplicacao no browser em: http://localhost:3000
echo.
echo Para fechar o servidor, feche esta janela ou pressione Ctrl+C.
echo ===================================================

set NODE_ENV=production
call npm run start

pause
