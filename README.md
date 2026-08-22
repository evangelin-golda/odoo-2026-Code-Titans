# Dayflow — Human Resource Management System (HRMS)

A modern employee experience portal built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Neon Serverless PostgreSQL.

## 🚀 Features

- **Employee Dashboard**: Real-time shift clock, quick punches, pending leaves, and personal stats.
- **Attendance & Time Tracking**: Check-in and check-out with automatic grace period calculation and work-mode tracking (Office, Remote, Hybrid).
- **Time Off & Leave Management**: Request submission, balance tracking across leave categories, and working day calculation.
- **Salary & Payslips Transparency**: Detailed compensation structure, statutory deductions breakdown, and monthly pay stubs.
- **Profile & Record Management**: Employee self-service for personal details and contact info with role-based field restrictions.
- **Analytics & Personal Reporting**: Attendance rates, punctuality trends, and streaks.
- **HR Policy Assistant**: In-app knowledge assistant for quick company policy lookups.
- **Neon PostgreSQL Persistence**: Serverless SQL database connection via `@neondatabase/serverless` with automatic schema creation and seeder scripts.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [Neon Serverless PostgreSQL](https://neon.tech/) (`@neondatabase/serverless`)
- **UI**: [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)
- **Language**: TypeScript

## 📦 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
```
Add your **Neon connection string** into `.env.local`:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 3. Initialize & Seed Neon Database
```bash
npm run db:init
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server on `http://localhost:3000` |
| `npm run db:init` | Creates tables and seeds initial employee personas into Neon PostgreSQL |
| `npm run test:api` | Runs automated end-to-end integration tests across all HRMS API routes |
| `npm run typecheck` | Validates TypeScript types across the entire codebase (`tsc --noEmit`) |
| `npm run build` | Compiles the production build |
| `npm start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint analysis |

### One-Click Launch Scripts

- **Windows Batch (Double-Click)**: `start.bat` or `scripts\start.bat`
- **Windows PowerShell**: `.\scripts\dev.ps1`
- **Linux / macOS**: `./scripts/dev.sh`
- **API Smoke & Test Suite**: `node scripts/test-api.mjs`
