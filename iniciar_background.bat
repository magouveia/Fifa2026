@echo off
title Mundial 2026 - Servidor Background
color 0B

echo ===================================================
echo      MUNDIAL 2026 - MODO BACKGROUND
echo ===================================================
echo.

echo [1/4] A procurar atualizacoes no GitHub...
git pull origin main

echo.
echo [2/4] A instalar dependencias e PM2...
call npm install
call npm install -g pm2

echo.
echo [3/4] A compilar a aplicacao...
call npm run build

echo.
echo [4/4] A iniciar o servidor em background...
set NODE_ENV=production
set PORT=3008

:: Parar a versao antiga se existir, para nao dar erro de porta
call pm2 stop mundial2026 2>nul
call pm2 delete mundial2026 2>nul

:: Iniciar nova versao
call pm2 start npm --name "mundial2026" -- run start

echo.
echo ===================================================
echo SUCESSO! A APLICACAO ESTA A CORRER EM BACKGROUND!
echo ===================================================
echo.
echo Pode fechar esta janela preta a vontade.
echo A aplicacao vai continuar ligada e acessivel em:
echo http://localhost:3008
echo.
echo Para parar a aplicacao no futuro, abra a linha de comandos e escreva:
echo pm2 stop mundial2026
echo.
echo A abrir o browser automaticamente...
start http://localhost:3008
echo.
pause
