@echo off
echo ==========================================
echo      PORTFOLIO BACKEND SERVER SETUP
echo ==========================================
echo.
echo [1/2] Installing dependencies...
call npm install
echo.
echo [2/2] Starting server...
echo.
echo Server is running! Keep this window OPEN.
echo Go to your website and try the contact form now.
echo.
node server.js
pause
