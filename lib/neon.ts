import { neon } from '@neondatabase/serverless';

// Cache connection in serverless runtime
const databaseUrl = process.env.DATABASE_URL;

export const isNeonConfigured = Boolean(
  databaseUrl &&
  databaseUrl.startsWith('postgres') &&
  !databaseUrl.includes('YOUR_NEON_DATABASE_URL')
);

// Instantiate Neon serverless SQL client if DATABASE_URL is present
export const sql = isNeonConfigured ? neon(databaseUrl!) : null;

let schemaInitPromise: Promise<boolean> | null = null;

export async function ensureNeonSchema(): Promise<boolean> {
  if (!isNeonConfigured || !sql) return false;
  if (schemaInitPromise) return schemaInitPromise;

  schemaInitPromise = (async () => {
    try {
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

      return true;
    } catch (err: any) {
      console.warn('Neon schema ensure error (falling back to memory):', err?.message || err);
      return false;
    }
  })();

  return schemaInitPromise;
}

export async function checkNeonConnection(): Promise<{ connected: boolean; message: string; version?: string }> {
  if (!isNeonConfigured || !sql) {
    return {
      connected: false,
      message: 'DATABASE_URL is not configured in environment variables (.env.local)',
    };
  }

  try {
    const result = await sql`SELECT version(), current_database() as db_name, current_user as db_user;`;
    if (result && result.length > 0) {
      await ensureNeonSchema();
      return {
        connected: true,
        message: `Successfully connected to Neon DB: ${result[0].db_name} as ${result[0].db_user}`,
        version: result[0].version,
      };
    }
    return { connected: true, message: 'Connected to Neon DB.' };
  } catch (error: any) {
    return {
      connected: false,
      message: `Neon DB connection error: ${error.message}`,
    };
  }
}
