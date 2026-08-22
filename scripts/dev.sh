#!/usr/bin/env bash
# Dayflow HRMS - Unix Development Server Launch Script

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd "$DIR"

echo "============================================="
echo "   Dayflow HRMS - Development Server Launch  "
echo "============================================="

if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "[✓] Created .env.local from .env.example"
fi

if [ ! -d "node_modules" ]; then
    echo "[*] Installing dependencies with npm install..."
    npm install
fi

echo "[✓] Launching Dayflow HRMS on http://localhost:3000..."
npm run dev
