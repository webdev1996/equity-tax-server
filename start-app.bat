@echo off
echo 🚀 Starting Equity Tax Application...

REM Add Node.js to PATH
set PATH=%PATH%;C:\Program Files\nodejs

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version: 
node --version

REM Start the simple server
echo [INFO] Starting server...
start "Equity Tax Server" cmd /k "node simple-server.js"

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Start the React app
echo [INFO] Starting React application...
start "Equity Tax App" cmd /k "npm start"

echo [SUCCESS] Application is starting!
echo.
echo 🌐 Your application will be available at:
echo   Frontend: http://localhost:3000
echo   Backend: http://localhost:3001
echo.
echo 📋 Demo Credentials:
echo   Admin: admin@equitytax1.com / password
echo   User: user@equitytax1.com / password
echo.
echo 🔧 Or create a new account using the signup form
echo.

pause
