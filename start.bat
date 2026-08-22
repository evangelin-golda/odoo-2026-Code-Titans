@echo off
title Dayflow HRMS - Project Launcher

echo =======================================================
echo          Dayflow HRMS - Application Startup
echo =======================================================
echo.

:: 1. Navigate to project root directory
cd /d "%~dp0"

:: 2. Check Node.js installation
echo [*] Checking Node.js runtime...
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo [OK] Node.js is ready: %NODE_VERSION%

:: 3. Check npm installation
call npm -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed or not found in PATH.
    echo.
    pause
    exit /b 1
)

:: 4. Check / Setup environment variables (.env.local)
if not exist ".env.local" (
    if exist ".env.example" (
        echo [*] .env.local not found. Creating from .env.example...
        copy /y ".env.example" ".env.local" >nul
        echo [OK] Created .env.local successfully.
    ) else (
        echo [WARN] Neither .env.local nor .env.example was found.
    )
) else (
    echo [OK] Environment configuration .env.local detected.
)

:: 5. Check dependencies (node_modules)
if not exist "node_modules" (
    echo [*] node_modules not found. Installing dependencies...
    echo [*] Running 'npm install' - please wait...
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] npm install failed. Please inspect the errors above.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
) else (
    echo [OK] Dependencies node_modules verified.
)

:: 6. Launch Server
echo.
echo =======================================================
echo  Starting Dayflow HRMS on http://localhost:3000
echo  Press Ctrl+C in this window to stop the server.
echo =======================================================
echo.

:: Open default browser to the web app
start "" "http://localhost:3000"

:: Start Next.js development server
call npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Application exited with error.
    pause
)
