# Dayflow HRMS - Windows PowerShell Startup Script
# Checks dependencies, installs node_modules if needed, and launches next dev

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   Dayflow HRMS - Development Server Launch  " -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir
Set-Location $ProjectDir

# 1. Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "[✓] Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[!] Node.js is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# 2. Check and copy .env.example if .env.local does not exist
if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "[✓] Created .env.local from .env.example" -ForegroundColor Yellow
    }
}

# 3. Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[*] node_modules not found. Running npm install..." -ForegroundColor Yellow
    npm install
}

# 4. Start Next.js development server
Write-Host "[✓] Starting Dayflow HRMS on http://localhost:3000..." -ForegroundColor Green
npm run dev
