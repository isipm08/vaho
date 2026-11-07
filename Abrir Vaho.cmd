@echo off
setlocal
cd /d "%~dp0"
echo.
echo Abre http://127.0.0.1:8002/ en el computador.
echo Deja esta ventana abierta mientras uses Vaho.
echo.
node server.js
echo.
echo El servidor se detuvo. Revisa el mensaje anterior.
pause

