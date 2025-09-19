@echo off
echo 🏗️  Building Equity Tax for Production...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

echo [INFO] Node.js version: 
node --version
echo [INFO] npm version: 
npm --version

REM Clean previous builds
echo [INFO] Cleaning previous builds...
if exist build rmdir /s /q build
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist node_modules rmdir /s /q node_modules

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)

REM Install backend dependencies
echo [INFO] Installing backend dependencies...
cd backend
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Create production environment file
echo [INFO] Creating production environment configuration...
echo REACT_APP_API_URL=/api > .env.production
echo REACT_APP_ENVIRONMENT=production >> .env.production
echo REACT_APP_DEBUG=false >> .env.production

REM Build frontend
echo [INFO] Building frontend for production...
npm run build
if errorlevel 1 (
    echo [ERROR] Frontend build failed
    exit /b 1
)

REM Verify build
if exist build (
    echo [SUCCESS] Frontend build completed successfully
) else (
    echo [ERROR] Frontend build failed
    exit /b 1
)

REM Create production package
echo [INFO] Creating production package...
if exist dist rmdir /s /q dist
mkdir dist
xcopy /e /i build dist\frontend
xcopy /e /i backend dist\backend
copy docker-compose.yml dist\
copy Dockerfile.frontend dist\
copy nginx.conf dist\
copy deploy.sh dist\
copy README.md dist\

REM Create production package.json for backend
echo { > dist\backend\package.json
echo   "name": "equity-tax-backend", >> dist\backend\package.json
echo   "version": "1.0.0", >> dist\backend\package.json
echo   "description": "Backend API for Equity Tax Management System", >> dist\backend\package.json
echo   "main": "server.js", >> dist\backend\package.json
echo   "scripts": { >> dist\backend\package.json
echo     "start": "node server.js", >> dist\backend\package.json
echo     "dev": "nodemon server.js" >> dist\backend\package.json
echo   }, >> dist\backend\package.json
echo   "dependencies": { >> dist\backend\package.json
echo     "express": "^4.18.2", >> dist\backend\package.json
echo     "cors": "^2.8.5", >> dist\backend\package.json
echo     "helmet": "^7.0.0", >> dist\backend\package.json
echo     "morgan": "^1.10.0", >> dist\backend\package.json
echo     "dotenv": "^16.3.1", >> dist\backend\package.json
echo     "bcryptjs": "^2.4.3", >> dist\backend\package.json
echo     "jsonwebtoken": "^9.0.2", >> dist\backend\package.json
echo     "mongoose": "^7.5.0", >> dist\backend\package.json
echo     "multer": "^1.4.5-lts.1", >> dist\backend\package.json
echo     "express-rate-limit": "^6.10.0", >> dist\backend\package.json
echo     "express-validator": "^7.0.1", >> dist\backend\package.json
echo     "nodemailer": "^6.9.4", >> dist\backend\package.json
echo     "stripe": "^13.5.0", >> dist\backend\package.json
echo     "compression": "^1.7.4", >> dist\backend\package.json
echo     "express-mongo-sanitize": "^2.2.0", >> dist\backend\package.json
echo     "xss-clean": "^0.1.4", >> dist\backend\package.json
echo     "hpp": "^0.2.3" >> dist\backend\package.json
echo   } >> dist\backend\package.json
echo } >> dist\backend\package.json

echo [SUCCESS] Production build completed successfully!
echo.
echo 📦 Build Summary:
echo   Frontend: Built successfully
echo   Backend: Ready for deployment
echo   Total Package: Created in 'dist' folder
echo.
echo 🚀 Deployment Options:
echo   1. Docker Compose: cd dist && docker-compose up -d
echo   2. Manual deployment: Follow DEPLOYMENT.md in dist folder
echo.
echo 📋 Next Steps:
echo   1. Copy the 'dist' folder to your production server
echo   2. Configure environment variables
echo   3. Run the deployment script
echo   4. Access your application at http://localhost:3000
echo.

pause
