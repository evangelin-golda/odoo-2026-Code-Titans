/**
 * Dayflow HRMS - Neon PostgreSQL Schema Setup & Seeder Script
 * 
 * Usage:
 *   node scripts/init-neon.mjs
 */

import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Check if .env.local exists and load it if present
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    }
  }
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL || !DATABASE_URL.startsWith('postgres') || DATABASE_URL.includes('YOUR_NEON_DATABASE_URL')) {
  console.error('\x1b[31m[ERROR]\x1b[0m DATABASE_URL is not set or invalid in .env.local.');
  console.log('\nPlease add your Neon connection string to .env.local:');
  console.log('DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require"\n');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function initializeDatabase() {
  console.log('\n======================================================');
  console.log('  DAYFLOW HRMS - NEON POSTGRESQL INITIALIZATION');
  console.log('======================================================\n');

  console.log('1. Connecting to Neon PostgreSQL...');
  const testConn = await sql`SELECT current_database() as db, current_user as usr, version();`;
  console.log(`\x1b[32m[✓]\x1b[0m Connected to Database: \x1b[36m${testConn[0].db}\x1b[0m as \x1b[36m${testConn[0].usr}\x1b[0m`);

  console.log('\n2. Creating HRMS Tables and Schema...');

  // 1. Employees table
  await sql`
    CREATE TABLE IF NOT EXISTS employees (
      id VARCHAR(64) PRIMARY KEY,
      employee_id VARCHAR(32) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(64),
      address TEXT,
      avatar_url TEXT,
      bio TEXT,
      emergency_contact JSONB,
      department VARCHAR(128),
      job_position VARCHAR(128),
      manager_name VARCHAR(128),
      manager_email VARCHAR(128),
      joining_date VARCHAR(32),
      employment_type VARCHAR(32) DEFAULT 'Full-time',
      work_location VARCHAR(128),
      work_mode VARCHAR(32) DEFAULT 'hybrid',
      role VARCHAR(32) DEFAULT 'employee',
      salary JSONB,
      documents JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('  [✓] Table "employees" ready.');

  // 2. Attendance table
  await sql`
    CREATE TABLE IF NOT EXISTS attendance (
      id VARCHAR(128) PRIMARY KEY,
      employee_id VARCHAR(32) REFERENCES employees(employee_id) ON DELETE CASCADE,
      date VARCHAR(32) NOT NULL,
      check_in VARCHAR(32),
      check_out VARCHAR(32),
      duration_minutes INTEGER DEFAULT 0,
      status VARCHAR(32) NOT NULL,
      work_mode VARCHAR(32) NOT NULL,
      notes TEXT,
      is_on_time BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('  [✓] Table "attendance" ready.');

  // 3. Leaves table
  await sql`
    CREATE TABLE IF NOT EXISTS leaves (
      id VARCHAR(128) PRIMARY KEY,
      employee_id VARCHAR(32) REFERENCES employees(employee_id) ON DELETE CASCADE,
      employee_name VARCHAR(255),
      leave_type VARCHAR(64) NOT NULL,
      start_date VARCHAR(32) NOT NULL,
      end_date VARCHAR(32) NOT NULL,
      days_count NUMERIC(4, 1) NOT NULL,
      is_half_day BOOLEAN DEFAULT false,
      half_day_period VARCHAR(32),
      reason TEXT,
      status VARCHAR(32) DEFAULT 'pending',
      applied_date VARCHAR(32) NOT NULL,
      approved_by VARCHAR(128),
      approval_date VARCHAR(32),
      admin_comments TEXT,
      emergency_contact VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('  [✓] Table "leaves" ready.');

  // 4. Payslips table
  await sql`
    CREATE TABLE IF NOT EXISTS payslips (
      id VARCHAR(128) PRIMARY KEY,
      employee_id VARCHAR(32) REFERENCES employees(employee_id) ON DELETE CASCADE,
      month VARCHAR(64) NOT NULL,
      year INTEGER NOT NULL,
      period_start VARCHAR(32) NOT NULL,
      period_end VARCHAR(32) NOT NULL,
      pay_date VARCHAR(32) NOT NULL,
      gross_pay NUMERIC(10, 2) NOT NULL,
      total_deductions NUMERIC(10, 2) NOT NULL,
      net_pay NUMERIC(10, 2) NOT NULL,
      currency VARCHAR(16) DEFAULT 'USD',
      status VARCHAR(32) DEFAULT 'Paid',
      breakdown JSONB NOT NULL,
      working_days INTEGER NOT NULL,
      days_present INTEGER NOT NULL,
      paid_leaves INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('  [✓] Table "payslips" ready.');

  // 5. Notifications table
  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR(128) PRIMARY KEY,
      employee_id VARCHAR(32) REFERENCES employees(employee_id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      category VARCHAR(64) NOT NULL,
      timestamp VARCHAR(64) NOT NULL,
      is_read BOOLEAN DEFAULT false,
      action_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('  [✓] Table "notifications" ready.');

  console.log('\n3. Seeding Initial Personas and Historical Data...');

  // Check if employees exist
  const existingCount = await sql`SELECT count(*)::int as cnt FROM employees;`;
  if (existingCount[0].cnt === 0) {
    // Seed Personas
    await sql`
      INSERT INTO employees (
        id, employee_id, name, email, phone, address, avatar_url, bio, emergency_contact,
        department, job_position, manager_name, manager_email, joining_date, employment_type,
        work_location, work_mode, role, salary, documents
      ) VALUES
      (
        'usr-101', 'EMP-1001', 'Alex Rivera', 'alex.rivera@dayflow.internal', '+1 (555) 234-8901',
        '428 Horizon Heights Blvd, Suite 4B, San Francisco, CA 94107',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        'Senior Frontend Engineer passionate about design systems, accessible interfaces, and fluid micro-interactions.',
        '{"name": "Elena Rivera", "relationship": "Spouse", "phone": "+1 (555) 987-6543"}',
        'Core Engineering', 'Senior Frontend Engineer', 'David Sterling (VP of Engineering)', 'david.sterling@dayflow.internal',
        '2023-04-15', 'Full-time', 'San Francisco HQ & Remote', 'hybrid', 'employee',
        '{"currency": "USD", "baseAnnual": 145000, "baseMonthly": 12083, "hra": 3625, "specialAllowance": 1812, "performanceBonus": 1200, "providentFund": 1450, "professionalTax": 200, "healthInsurance": 350, "netMonthly": 16720, "payFrequency": "Monthly", "bankAccountMasked": "•••• •••• •••• 8829 (Silicon Valley Bank)", "panMasked": "ABCDE••••F", "pfNumber": "PF-SF-889021"}',
        '[{"id": "doc-1", "title": "Employment Offer Letter & NDA.pdf", "category": "Contract", "uploadDate": "2023-04-10", "fileSize": "1.4 MB"}, {"id": "doc-2", "title": "National Identity Proof (Passport).pdf", "category": "ID Proof", "uploadDate": "2023-04-12", "fileSize": "2.8 MB"}, {"id": "doc-3", "title": "Form W-4 Withholding Certificate 2026.pdf", "category": "Tax", "uploadDate": "2026-01-05", "fileSize": "840 KB"}, {"id": "doc-4", "title": "AWS Certified Solutions Architect.pdf", "category": "Certification", "uploadDate": "2025-08-20", "fileSize": "1.1 MB"}]'
      ),
      (
        'usr-102', 'EMP-1002', 'Sarah Chen', 'sarah.chen@dayflow.internal', '+1 (555) 345-6789',
        '890 Marina Green Dr, San Francisco, CA 94123',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        'Lead Product Designer creating intuitive, human-centered enterprise experiences.',
        '{"name": "Michael Chen", "relationship": "Brother", "phone": "+1 (555) 876-5432"}',
        'Product & Design', 'Lead Product Designer', 'Rachel Green (Head of Design)', 'rachel.green@dayflow.internal',
        '2022-09-01', 'Full-time', 'San Francisco HQ', 'office', 'employee',
        '{"currency": "USD", "baseAnnual": 152000, "baseMonthly": 12666, "hra": 3800, "specialAllowance": 1900, "performanceBonus": 1500, "providentFund": 1520, "professionalTax": 200, "healthInsurance": 350, "netMonthly": 17796, "payFrequency": "Monthly", "bankAccountMasked": "•••• •••• •••• 4419 (Chase Bank)", "panMasked": "PQRST••••K", "pfNumber": "PF-SF-774102"}',
        '[{"id": "doc-10", "title": "Design Lead Contract Agreement.pdf", "category": "Contract", "uploadDate": "2022-08-25", "fileSize": "1.6 MB"}]'
      ),
      (
        'usr-103', 'EMP-1003', 'Marcus Vance', 'marcus.vance@dayflow.internal', '+1 (555) 456-7890',
        '1204 Pine Street, Apt 8, Seattle, WA 98101',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        'DevOps & SRE Specialist dedicated to high availability, zero-downtime deployments and cloud security.',
        '{"name": "Samantha Vance", "relationship": "Parent", "phone": "+1 (555) 765-4321"}',
        'Infrastructure & Cloud', 'Senior DevOps Specialist', 'David Sterling (VP of Engineering)', 'david.sterling@dayflow.internal',
        '2024-01-10', 'Full-time', 'Seattle Remote', 'remote', 'employee',
        '{"currency": "USD", "baseAnnual": 148000, "baseMonthly": 12333, "hra": 3700, "specialAllowance": 1850, "performanceBonus": 1300, "providentFund": 1480, "professionalTax": 200, "healthInsurance": 350, "netMonthly": 17153, "payFrequency": "Monthly", "bankAccountMasked": "•••• •••• •••• 9102 (Bank of America)", "panMasked": "XYZAB••••M", "pfNumber": "PF-SEA-339182"}',
        '[{"id": "doc-20", "title": "Remote Work Agreement.pdf", "category": "Contract", "uploadDate": "2024-01-08", "fileSize": "1.2 MB"}]'
      );
    `;
    console.log('  [✓] Seeded 3 Employee personas into Neon DB.');

    // Seed Leaves for EMP-1001
    await sql`
      INSERT INTO leaves (id, employee_id, employee_name, leave_type, start_date, end_date, days_count, reason, status, applied_date, approved_by, approval_date, admin_comments)
      VALUES
      ('lv-901', 'EMP-1001', 'Alex Rivera', 'casual', '2026-08-05', '2026-08-05', 1, 'Family appointment and home relocation errands.', 'approved', '2026-08-01', 'David Sterling (VP of Engineering)', '2026-08-02', 'Approved. Enjoy your time off!'),
      ('lv-902', 'EMP-1001', 'Alex Rivera', 'annual', '2026-09-14', '2026-09-18', 5, 'Annual family vacation trip to Yosemite National Park.', 'pending', '2026-08-18', NULL, NULL, 'Under review by Engineering Management.'),
      ('lv-903', 'EMP-1001', 'Alex Rivera', 'sick', '2026-07-11', '2026-07-12', 2, 'Severe seasonal flu with fever. Physician recommended 48h rest.', 'approved', '2026-07-11', 'Rachel Green (HR Partner)', '2026-07-11', 'Medical leave approved. Get well soon!'),
      ('lv-904', 'EMP-1001', 'Alex Rivera', 'remote_wfh', '2026-06-20', '2026-06-20', 1, 'Broadband technician visiting residential address.', 'approved', '2026-06-18', 'David Sterling', '2026-06-19', NULL);
    `;
    console.log('  [✓] Seeded initial leave records into Neon DB.');

    // Seed Payslips
    await sql`
      INSERT INTO payslips (id, employee_id, month, year, period_start, period_end, pay_date, gross_pay, total_deductions, net_pay, currency, status, breakdown, working_days, days_present, paid_leaves)
      VALUES
      ('ps-2026-07', 'EMP-1001', 'July 2026', 2026, '2026-07-01', '2026-07-31', '2026-07-31', 18720, 2000, 16720, 'USD', 'Paid', '{"basic": 12083, "hra": 3625, "specialAllowance": 1812, "bonus": 1200, "providentFund": 1450, "taxDeducted": 200, "healthInsurance": 350}', 23, 21, 2),
      ('ps-2026-06', 'EMP-1001', 'June 2026', 2026, '2026-06-01', '2026-06-30', '2026-06-30', 18720, 2000, 16720, 'USD', 'Paid', '{"basic": 12083, "hra": 3625, "specialAllowance": 1812, "bonus": 1200, "providentFund": 1450, "taxDeducted": 200, "healthInsurance": 350}', 22, 21, 1);
    `;
    console.log('  [✓] Seeded historical payslips into Neon DB.');

    // Seed Notifications
    await sql`
      INSERT INTO notifications (id, employee_id, title, message, category, timestamp, is_read, action_url)
      VALUES
      ('notif-1', 'EMP-1001', 'Leave Request Received', 'Your request for Annual Leave (Sep 14 - Sep 18) has been routed to Engineering Management for review.', 'leave', '2 hours ago', false, '/leave'),
      ('notif-2', 'EMP-1001', 'July 2026 Payslip Generated', 'Your monthly salary of $16,720.00 has been credited to Silicon Valley Bank (••• 8829).', 'payroll', '3 days ago', false, '/salary'),
      ('notif-3', 'EMP-1001', 'Attendance Reminder', 'Great job maintaining a 96% punctuality rate this month! Keep up the great flow.', 'attendance', '5 days ago', true, '/attendance');
    `;
    console.log('  [✓] Seeded notifications into Neon DB.');
  } else {
    console.log(`  [i] Neon database already contains ${existingCount[0].cnt} employee records. Skipping initial seed.`);
  }

  console.log('\n======================================================');
  console.log('  \x1b[32mNEON POSTGRESQL INITIALIZATION COMPLETE!\x1b[0m');
  console.log('======================================================\n');
}

initializeDatabase().catch((err) => {
  console.error('\x1b[31mInitialization Error:\x1b[0m', err.message);
  process.exit(1);
});
