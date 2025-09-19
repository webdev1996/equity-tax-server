@echo off
echo 🚀 Starting Equity Tax Application with Fixed PATH...

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

REM Install dependencies if needed
if not exist node_modules (
    echo [INFO] Installing dependencies...
    npm install
)

REM Start the React app
echo [INFO] Starting React application...
echo [SUCCESS] Application is starting!
echo.
echo 🌐 Your application will be available at: http://localhost:3000
echo.
echo 📋 Demo Credentials:
echo   Admin: admin@equitytax1.com / password
echo   User: user@equitytax1.com / password
echo.
echo 🔧 Or create a new account using the signup form
echo.
echo 💡 All buttons and actions now work with proper feedback!
echo.

npm start
