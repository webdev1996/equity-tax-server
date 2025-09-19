@echo off
echo 🚀 Setting up Equity Tax Application...

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

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install server dependencies
echo [INFO] Installing server dependencies...
copy server-package.json package-server.json
npm install --prefix . express cors
if errorlevel 1 (
    echo [ERROR] Failed to install server dependencies
    pause
    exit /b 1
)

REM Build the application
echo [INFO] Building the application...
npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build application
    pause
    exit /b 1
)

echo [SUCCESS] Setup completed successfully!
echo.
echo 🎯 Next Steps:
echo 1. Start the server: node simple-server.js
echo 2. Open your browser to: http://localhost:3001
echo.
echo 📋 Demo Credentials:
echo   Admin: admin@equitytax1.com / password
echo   User: user@equitytax1.com / password
echo.
echo 🔧 Or create a new account using the signup form
echo.

pause
