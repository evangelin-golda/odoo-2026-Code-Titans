import {
  EmployeeProfile,
  AttendanceRecord,
  LeaveRequest,
  LeaveBalance,
  Payslip,
  NotificationItem,
  PersonalReportSummary,
  WorkMode,
  LeaveType,
  UserRole,
} from '@/types/hrms';
import { sql, isNeonConfigured, ensureNeonSchema } from './neon';

// Global in-memory storage fallback simulating Odoo HR PostgreSQL backend
interface DBStore {
  employees: Map<string, EmployeeProfile>;
  attendance: Map<string, AttendanceRecord[]>;
  leaves: Map<string, LeaveRequest[]>;
  notifications: Map<string, NotificationItem[]>;
  payslips: Map<string, Payslip[]>;
}

// Initial Seed Data
const initialEmployees: EmployeeProfile[] = [
  {
    id: 'usr-101',
    employeeId: 'EMP-1001',
    name: 'Alex Rivera',
    email: 'alex.rivera@dayflow.internal',
    phone: '+1 (555) 234-8901',
    address: '428 Horizon Heights Blvd, Suite 4B, San Francisco, CA 94107',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    bio: 'Senior Frontend Engineer passionate about design systems, accessible interfaces, and fluid micro-interactions.',
    emergencyContact: {
      name: 'Elena Rivera',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
    department: 'Core Engineering',
    jobPosition: 'Senior Frontend Engineer',
    managerName: 'David Sterling (VP of Engineering)',
    managerEmail: 'david.sterling@dayflow.internal',
    joiningDate: '2023-04-15',
    employmentType: 'Full-time',
    workLocation: 'San Francisco HQ & Remote',
    workMode: 'hybrid',
    role: 'employee',
    salary: {
      currency: 'USD',
      baseAnnual: 145000,
      baseMonthly: 12083,
      hra: 3625,
      specialAllowance: 1812,
      performanceBonus: 1200,
      providentFund: 1450,
      professionalTax: 200,
      healthInsurance: 350,
      netMonthly: 16720,
      payFrequency: 'Monthly',
      bankAccountMasked: '•••• •••• •••• 8829 (Silicon Valley Bank)',
      panMasked: 'ABCDE••••F',
      pfNumber: 'PF-SF-889021',
    },
    documents: [
      {
        id: 'doc-1',
        title: 'Employment Offer Letter & NDA.pdf',
        category: 'Contract',
        uploadDate: '2023-04-10',
        fileSize: '1.4 MB',
      },
      {
        id: 'doc-2',
        title: 'National Identity Proof (Passport).pdf',
        category: 'ID Proof',
        uploadDate: '2023-04-12',
        fileSize: '2.8 MB',
      },
      {
        id: 'doc-3',
        title: 'Form W-4 Withholding Certificate 2026.pdf',
        category: 'Tax',
        uploadDate: '2026-01-05',
        fileSize: '840 KB',
      },
      {
        id: 'doc-4',
        title: 'AWS Certified Solutions Architect.pdf',
        category: 'Certification',
        uploadDate: '2025-08-20',
        fileSize: '1.1 MB',
      },
    ],
  },
  {
    id: 'usr-102',
    employeeId: 'EMP-1002',
    name: 'Sarah Chen',
    email: 'sarah.chen@dayflow.internal',
    phone: '+1 (555) 345-6789',
    address: '890 Marina Green Dr, San Francisco, CA 94123',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    bio: 'Lead Product Designer creating intuitive, human-centered enterprise experiences.',
    emergencyContact: {
      name: 'Michael Chen',
      relationship: 'Brother',
      phone: '+1 (555) 876-5432',
    },
    department: 'Product & Design',
    jobPosition: 'Lead Product Designer',
    managerName: 'Rachel Green (Head of Design)',
    managerEmail: 'rachel.green@dayflow.internal',
    joiningDate: '2022-09-01',
    employmentType: 'Full-time',
    workLocation: 'San Francisco HQ',
    workMode: 'office',
    role: 'employee',
    salary: {
      currency: 'USD',
      baseAnnual: 152000,
      baseMonthly: 12666,
      hra: 3800,
      specialAllowance: 1900,
      performanceBonus: 1500,
      providentFund: 1520,
      professionalTax: 200,
      healthInsurance: 350,
      netMonthly: 17796,
      payFrequency: 'Monthly',
      bankAccountMasked: '•••• •••• •••• 4419 (Chase Bank)',
      panMasked: 'PQRST••••K',
      pfNumber: 'PF-SF-774102',
    },
    documents: [
      {
        id: 'doc-10',
        title: 'Design Lead Contract Agreement.pdf',
        category: 'Contract',
        uploadDate: '2022-08-25',
        fileSize: '1.6 MB',
      },
    ],
  },
  {
    id: 'usr-103',
    employeeId: 'EMP-1003',
    name: 'Marcus Vance',
    email: 'marcus.vance@dayflow.internal',
    phone: '+1 (555) 456-7890',
    address: '1204 Pine Street, Apt 8, Seattle, WA 98101',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    bio: 'DevOps & SRE Specialist dedicated to high availability, zero-downtime deployments and cloud security.',
    emergencyContact: {
      name: 'Samantha Vance',
      relationship: 'Parent',
      phone: '+1 (555) 765-4321',
    },
    department: 'Infrastructure & Cloud',
    jobPosition: 'Senior DevOps Specialist',
    managerName: 'David Sterling (VP of Engineering)',
    managerEmail: 'david.sterling@dayflow.internal',
    joiningDate: '2024-01-10',
    employmentType: 'Full-time',
    workLocation: 'Seattle Remote',
    workMode: 'remote',
    role: 'employee',
    salary: {
      currency: 'USD',
      baseAnnual: 148000,
      baseMonthly: 12333,
      hra: 3700,
      specialAllowance: 1850,
      performanceBonus: 1300,
      providentFund: 1480,
      professionalTax: 200,
      healthInsurance: 350,
      netMonthly: 17153,
      payFrequency: 'Monthly',
      bankAccountMasked: '•••• •••• •••• 9102 (Bank of America)',
      panMasked: 'XYZAB••••M',
      pfNumber: 'PF-SEA-339182',
    },
    documents: [
      {
        id: 'doc-20',
        title: 'Remote Work Agreement.pdf',
        category: 'Contract',
        uploadDate: '2024-01-08',
        fileSize: '1.2 MB',
      },
    ],
  },
];

// Generate Seed Attendance for EMP-1001
const generateSeedAttendance = (empId: string): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const todayDate = now.getDate();

  let dayCounter = 1;
  while (dayCounter <= todayDate) {
    const d = new Date(currentYear, currentMonth, dayCounter);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = d.toISOString().split('T')[0];
      const isToday = dayCounter === todayDate;

      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '08:58:30';
      let checkOut: string | undefined = '17:34:10';
      let duration = 515;
      let isOnTime = true;
      let workMode: WorkMode = dayCounter % 3 === 0 ? 'remote' : 'office';

      if (dayCounter === 5) {
        status = 'on_leave';
        checkIn = '-';
        checkOut = '-';
        duration = 0;
        isOnTime = true;
      } else if (dayCounter === 12) {
        status = 'half_day';
        checkIn = '09:02:15';
        checkOut = '13:15:00';
        duration = 252;
        isOnTime = true;
      } else if (dayCounter === 18) {
        status = 'late';
        checkIn = '09:42:00';
        checkOut = '18:15:00';
        duration = 513;
        isOnTime = false;
      }

      if (isToday) {
        checkIn = '09:04:12';
        checkOut = undefined;
        duration = 240;
        status = 'present';
        isOnTime = true;
        workMode = 'office';
      }

      records.push({
        id: `att-${empId}-${dateStr}`,
        employeeId: empId,
        date: dateStr,
        checkIn,
        checkOut,
        durationMinutes: duration,
        status,
        workMode,
        isOnTime,
        notes: status === 'on_leave' ? 'Approved Casual Leave' : (workMode === 'remote' ? 'Work from home - sprint planning' : undefined),
      });
    }
    dayCounter++;
  }

  return records.reverse();
};

// Seed Leaves
const initialLeaves: LeaveRequest[] = [
  {
    id: 'lv-901',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Rivera',
    leaveType: 'casual',
    startDate: '2026-08-05',
    endDate: '2026-08-05',
    daysCount: 1,
    reason: 'Family appointment and home relocation errands.',
    status: 'approved',
    appliedDate: '2026-08-01',
    approvedBy: 'David Sterling (VP of Engineering)',
    approvalDate: '2026-08-02',
    adminComments: 'Approved. Enjoy your time off!',
  },
  {
    id: 'lv-902',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Rivera',
    leaveType: 'annual',
    startDate: '2026-09-14',
    endDate: '2026-09-18',
    daysCount: 5,
    reason: 'Annual family vacation trip to Yosemite National Park.',
    status: 'pending',
    appliedDate: '2026-08-18',
    adminComments: 'Under review by Engineering Management.',
  },
  {
    id: 'lv-903',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Rivera',
    leaveType: 'sick',
    startDate: '2026-07-11',
    endDate: '2026-07-12',
    daysCount: 2,
    reason: 'Severe seasonal flu with fever. Physician recommended 48h rest.',
    status: 'approved',
    appliedDate: '2026-07-11',
    approvedBy: 'Rachel Green (HR Partner)',
    approvalDate: '2026-07-11',
    adminComments: 'Medical leave approved. Get well soon!',
  },
  {
    id: 'lv-904',
    employeeId: 'EMP-1001',
    employeeName: 'Alex Rivera',
    leaveType: 'remote_wfh',
    startDate: '2026-06-20',
    endDate: '2026-06-20',
    daysCount: 1,
    reason: 'Broadband technician visiting residential address.',
    status: 'approved',
    appliedDate: '2026-06-18',
    approvedBy: 'David Sterling',
    approvalDate: '2026-06-19',
  },
];

// Seed Payslips
const initialPayslips: Payslip[] = [
  {
    id: 'ps-2026-07',
    employeeId: 'EMP-1001',
    month: 'July 2026',
    year: 2026,
    periodStart: '2026-07-01',
    periodEnd: '2026-07-31',
    payDate: '2026-07-31',
    grossPay: 18720,
    totalDeductions: 2000,
    netPay: 16720,
    currency: 'USD',
    status: 'Paid',
    breakdown: {
      basic: 12083,
      hra: 3625,
      specialAllowance: 1812,
      bonus: 1200,
      providentFund: 1450,
      taxDeducted: 200,
      healthInsurance: 350,
    },
    workingDays: 23,
    daysPresent: 21,
    paidLeaves: 2,
  },
  {
    id: 'ps-2026-06',
    employeeId: 'EMP-1001',
    month: 'June 2026',
    year: 2026,
    periodStart: '2026-06-01',
    periodEnd: '2026-06-30',
    payDate: '2026-06-30',
    grossPay: 18720,
    totalDeductions: 2000,
    netPay: 16720,
    currency: 'USD',
    status: 'Paid',
    breakdown: {
      basic: 12083,
      hra: 3625,
      specialAllowance: 1812,
      bonus: 1200,
      providentFund: 1450,
      taxDeducted: 200,
      healthInsurance: 350,
    },
    workingDays: 22,
    daysPresent: 21,
    paidLeaves: 1,
  },
];

// Seed Notifications
const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    employeeId: 'EMP-1001',
    title: 'Leave Request Received',
    message: 'Your request for Annual Leave (Sep 14 - Sep 18) has been routed to Engineering Management for review.',
    category: 'leave',
    timestamp: '2 hours ago',
    isRead: false,
    actionUrl: '/leave',
  },
  {
    id: 'notif-2',
    employeeId: 'EMP-1001',
    title: 'July 2026 Payslip Generated',
    message: 'Your monthly salary of $16,720.00 has been credited to Silicon Valley Bank (••• 8829).',
    category: 'payroll',
    timestamp: '3 days ago',
    isRead: false,
    actionUrl: '/salary',
  },
  {
    id: 'notif-3',
    employeeId: 'EMP-1001',
    title: 'Attendance Reminder',
    message: 'Great job maintaining a 96% punctuality rate this month! Keep up the great flow.',
    category: 'attendance',
    timestamp: '5 days ago',
    isRead: true,
    actionUrl: '/attendance',
  },
];

// Declare global singleton storage to persist across hot reloads in dev server
declare global {
  var __DAYFLOW_DB__: DBStore | undefined;
}

function initDB(): DBStore {
  if (global.__DAYFLOW_DB__) {
    return global.__DAYFLOW_DB__;
  }

  const store: DBStore = {
    employees: new Map(),
    attendance: new Map(),
    leaves: new Map(),
    notifications: new Map(),
    payslips: new Map(),
  };

  for (const emp of initialEmployees) {
    store.employees.set(emp.employeeId, emp);
    store.attendance.set(emp.employeeId, generateSeedAttendance(emp.employeeId));
    store.notifications.set(
      emp.employeeId,
      initialNotifications.map(n => ({ ...n, employeeId: emp.employeeId }))
    );
    store.payslips.set(
      emp.employeeId,
      initialPayslips.map(p => ({ ...p, employeeId: emp.employeeId }))
    );
  }

  store.leaves.set('EMP-1001', [...initialLeaves]);
  store.leaves.set('EMP-1002', []);
  store.leaves.set('EMP-1003', []);

  global.__DAYFLOW_DB__ = store;
  return store;
}

export const db = initDB();

// --- HELPER ROW MAPPERS FOR NEON POSTGRESQL ---

function safeJsonParse<T>(val: any, fallback: T): T {
  if (!val) return fallback;
  if (typeof val === 'object') return val as T;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

function mapEmployeeRow(row: any): EmployeeProfile {
  if (!row) return null as any;
  return {
    id: String(row.id || ''),
    employeeId: String(row.employee_id || row.employeeId || ''),
    name: String(row.name || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    address: String(row.address || ''),
    avatarUrl: String(row.avatar_url || row.avatarUrl || ''),
    bio: String(row.bio || ''),
    emergencyContact: safeJsonParse(row.emergency_contact || row.emergencyContact, { name: '', relationship: '', phone: '' }),
    department: String(row.department || ''),
    jobPosition: String(row.job_position || row.jobPosition || ''),
    managerName: String(row.manager_name || row.managerName || ''),
    managerEmail: String(row.manager_email || row.managerEmail || ''),
    joiningDate: String(row.joining_date || row.joiningDate || ''),
    employmentType: (row.employment_type || row.employmentType || 'Full-time') as any,
    workLocation: String(row.work_location || row.workLocation || ''),
    workMode: (row.work_mode || row.workMode || 'hybrid') as any,
    role: (row.role || 'employee') as any,
    salary: safeJsonParse(row.salary, {} as any),
    documents: safeJsonParse(row.documents, []),
  };
}

function mapAttendanceRow(row: any): AttendanceRecord {
  if (!row) return null as any;
  return {
    id: String(row.id || `att-${row.employee_id || row.employeeId}-${row.date || Date.now()}`),
    employeeId: String(row.employee_id || row.employeeId || ''),
    date: String(row.date || ''),
    checkIn: String(row.check_in || row.checkIn || '-'),
    checkOut: (row.check_out || row.checkOut) ? String(row.check_out || row.checkOut) : undefined,
    durationMinutes: Number(row.duration_minutes || row.durationMinutes) || 0,
    status: (row.status || 'present') as any,
    workMode: (row.work_mode || row.workMode || 'office') as any,
    notes: row.notes ? String(row.notes) : undefined,
    isOnTime: row.is_on_time !== undefined ? Boolean(row.is_on_time) : (row.isOnTime !== undefined ? Boolean(row.isOnTime) : true),
  };
}

function mapLeaveRow(row: any): LeaveRequest {
  if (!row) return null as any;
  return {
    id: String(row.id || ''),
    employeeId: String(row.employee_id || row.employeeId || ''),
    employeeName: String(row.employee_name || row.employeeName || ''),
    leaveType: (row.leave_type || row.leaveType || 'casual') as any,
    startDate: String(row.start_date || row.startDate || ''),
    endDate: String(row.end_date || row.endDate || ''),
    daysCount: Number(row.days_count || row.daysCount) || 1,
    isHalfDay: Boolean(row.is_half_day ?? row.isHalfDay ?? false),
    halfDayPeriod: (row.half_day_period || row.halfDayPeriod) as any,
    reason: String(row.reason || ''),
    status: (row.status || 'pending') as any,
    appliedDate: String(row.applied_date || row.appliedDate || ''),
    approvedBy: (row.approved_by || row.approvedBy) ? String(row.approved_by || row.approvedBy) : undefined,
    approvalDate: (row.approval_date || row.approvalDate) ? String(row.approval_date || row.approvalDate) : undefined,
    adminComments: (row.admin_comments || row.adminComments) ? String(row.admin_comments || row.adminComments) : undefined,
    emergencyContactDuringLeave: (row.emergency_contact || row.emergencyContactDuringLeave) ? String(row.emergency_contact || row.emergencyContactDuringLeave) : undefined,
  };
}

function mapPayslipRow(row: any): Payslip {
  if (!row) return null as any;
  return {
    id: String(row.id || ''),
    employeeId: String(row.employee_id || row.employeeId || ''),
    month: String(row.month || ''),
    year: Number(row.year) || new Date().getFullYear(),
    periodStart: String(row.period_start || row.periodStart || ''),
    periodEnd: String(row.period_end || row.periodEnd || ''),
    payDate: String(row.pay_date || row.payDate || ''),
    grossPay: Number(row.gross_pay || row.grossPay) || 0,
    totalDeductions: Number(row.total_deductions || row.totalDeductions) || 0,
    netPay: Number(row.net_pay || row.netPay) || 0,
    currency: String(row.currency || 'USD'),
    status: (row.status || 'Paid') as any,
    breakdown: safeJsonParse(row.breakdown, {} as any),
    workingDays: Number(row.working_days || row.workingDays) || 22,
    daysPresent: Number(row.days_present || row.daysPresent) || 22,
    paidLeaves: Number(row.paid_leaves || row.paidLeaves) || 0,
  };
}

function mapNotificationRow(row: any): NotificationItem {
  if (!row) return null as any;
  return {
    id: String(row.id || ''),
    employeeId: String(row.employee_id || row.employeeId || ''),
    title: String(row.title || ''),
    message: String(row.message || ''),
    category: (row.category || 'general') as any,
    timestamp: String(row.timestamp || ''),
    isRead: Boolean(row.is_read ?? row.isRead ?? false),
    actionUrl: (row.action_url || row.actionUrl) ? String(row.action_url || row.actionUrl) : undefined,
  };
}

// --- EMPLOYEE ACCESS AND OPERATIONS ---

export async function getEmployeeByEmployeeId(employeeId: string): Promise<EmployeeProfile | null> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM employees WHERE employee_id = ${employeeId} LIMIT 1;`;
      if (rows && rows.length > 0 && rows[0]) {
        return mapEmployeeRow(rows[0]);
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  return db.employees.get(employeeId) || null;
}

export async function getEmployeeByEmail(email: string): Promise<EmployeeProfile | null> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM employees WHERE LOWER(email) = LOWER(${email.trim()}) LIMIT 1;`;
      if (rows && rows.length > 0 && rows[0]) {
        return mapEmployeeRow(rows[0]);
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  for (const emp of db.employees.values()) {
    if (emp.email.toLowerCase() === email.toLowerCase()) {
      return emp;
    }
  }
  return null;
}

export async function registerNewEmployee(data: {
  name: string;
  email: string;
  phone?: string;
  department?: string;
  jobPosition?: string;
  workMode?: WorkMode;
  workLocation?: string;
  role?: UserRole;
  password?: string;
}): Promise<EmployeeProfile> {
  const existing = await getEmployeeByEmail(data.email);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const nextNumber = 1000 + (db.employees.size + 1);
  const newEmpId = `EMP-${nextNumber}`;
  const newUserId = `usr-${100 + (db.employees.size + 1)}`;
  const workMode: WorkMode = data.workMode || 'hybrid';
  const department = data.department || 'Engineering';
  const jobPosition = data.jobPosition || 'Associate Engineer';
  const workLocation = data.workLocation || (workMode === 'remote' ? 'Remote (US)' : 'San Francisco HQ');
  const role: UserRole = data.role || (department.toLowerCase().includes('hr') || data.email.toLowerCase().includes('hr') || data.email.toLowerCase().includes('admin') ? 'hr' : 'employee');

  const newProfile: EmployeeProfile = {
    id: newUserId,
    employeeId: newEmpId,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || '+1 (555) 000-0000',
    address: 'Address pending verification',
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
    bio: `${jobPosition} in ${department} at Dayflow HRMS.`,
    emergencyContact: {
      name: 'Primary Contact',
      relationship: 'Family',
      phone: '+1 (555) 000-0000',
    },
    department,
    jobPosition,
    managerName: 'David Sterling (VP of Engineering)',
    managerEmail: 'david.sterling@dayflow.internal',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentType: 'Full-time',
    workLocation,
    workMode,
    role,
    salary: {
      currency: 'USD',
      baseAnnual: 120000,
      baseMonthly: 10000,
      hra: 3000,
      specialAllowance: 1500,
      performanceBonus: 1000,
      providentFund: 1200,
      professionalTax: 200,
      healthInsurance: 350,
      netMonthly: 13750,
      payFrequency: 'Monthly',
      bankAccountMasked: '•••• •••• •••• 1234 (Verified)',
      panMasked: 'DEFGH••••Z',
      pfNumber: `PF-SF-${nextNumber}`,
    },
    documents: [
      {
        id: `doc-${Date.now()}`,
        title: 'Dayflow Standard Employment Agreement.pdf',
        category: 'Contract',
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: '1.2 MB',
      },
    ],
  };

  if (isNeonConfigured && sql) {
    try {
      await sql`
        INSERT INTO employees (
          id, employee_id, name, email, phone, address, avatar_url, bio, emergency_contact,
          department, job_position, manager_name, manager_email, joining_date, employment_type,
          work_location, work_mode, role, salary, documents
        ) VALUES (
          ${newProfile.id}, ${newProfile.employeeId}, ${newProfile.name}, ${newProfile.email},
          ${newProfile.phone}, ${newProfile.address}, ${newProfile.avatarUrl}, ${newProfile.bio},
          ${JSON.stringify(newProfile.emergencyContact)}, ${newProfile.department}, ${newProfile.jobPosition},
          ${newProfile.managerName}, ${newProfile.managerEmail}, ${newProfile.joiningDate}, ${newProfile.employmentType},
          ${newProfile.workLocation}, ${newProfile.workMode}, ${newProfile.role}, ${JSON.stringify(newProfile.salary)},
          ${JSON.stringify(newProfile.documents)}
        );
      `;
    } catch (err) {
      console.warn('Neon insert error, saving locally:', err);
    }
  }

  db.employees.set(newEmpId, newProfile);
  db.attendance.set(newEmpId, generateSeedAttendance(newEmpId));
  db.leaves.set(newEmpId, []);
  db.payslips.set(newEmpId, []);

  await addNotification(newEmpId, {
    title: 'Welcome to Dayflow!',
    message: `Welcome aboard, ${data.name}! Your employee workspace EMP ID is ${newEmpId}.`,
    category: 'general',
    actionUrl: '/dashboard',
  });

  return newProfile;
}

export async function updateEmployeeProfile(
  employeeId: string,
  updates: Partial<EmployeeProfile>
): Promise<EmployeeProfile> {
  const emp = await getEmployeeByEmployeeId(employeeId);
  if (!emp) {
    throw new Error('Employee record not found.');
  }

  if (updates.phone !== undefined) emp.phone = updates.phone.trim();
  if (updates.address !== undefined) emp.address = updates.address.trim();
  if (updates.bio !== undefined) emp.bio = updates.bio.trim();
  if (updates.avatarUrl !== undefined && updates.avatarUrl.trim().length > 0) {
    emp.avatarUrl = updates.avatarUrl.trim();
  }
  if (updates.emergencyContact) {
    emp.emergencyContact = {
      name: updates.emergencyContact.name?.trim() || emp.emergencyContact.name,
      relationship: updates.emergencyContact.relationship?.trim() || emp.emergencyContact.relationship,
      phone: updates.emergencyContact.phone?.trim() || emp.emergencyContact.phone,
    };
  }

  if (isNeonConfigured && sql) {
    try {
      await sql`
        UPDATE employees
        SET phone = ${emp.phone}, address = ${emp.address}, bio = ${emp.bio},
            avatar_url = ${emp.avatarUrl}, emergency_contact = ${JSON.stringify(emp.emergencyContact)}
        WHERE employee_id = ${employeeId};
      `;
    } catch (err) {
      console.warn('Neon update error, saving locally:', err);
    }
  }

  db.employees.set(employeeId, { ...emp });
  return emp;
}

// --- ATTENDANCE SYSTEM ---

export async function getEmployeeAttendance(
  employeeId: string,
  filter?: { month?: string; status?: string }
): Promise<AttendanceRecord[]> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      let rows;
      if (filter?.status && filter.status !== 'all') {
        rows = await sql`SELECT * FROM attendance WHERE employee_id = ${employeeId} AND status = ${filter.status} ORDER BY date DESC;`;
      } else {
        rows = await sql`SELECT * FROM attendance WHERE employee_id = ${employeeId} ORDER BY date DESC;`;
      }
      if (rows && rows.length > 0) {
        return rows.map(mapAttendanceRow).filter(Boolean);
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  const records = db.attendance.get(employeeId) || [];
  if (!filter) return records;

  return records.filter(rec => {
    let matches = true;
    if (filter.month && !rec.date.startsWith(filter.month)) matches = false;
    if (filter.status && filter.status !== 'all' && rec.status !== filter.status) matches = false;
    return matches;
  });
}

export async function getTodayAttendanceRecord(employeeId: string): Promise<AttendanceRecord | null> {
  const todayStr = new Date().toISOString().split('T')[0];
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM attendance WHERE employee_id = ${employeeId} AND date = ${todayStr} LIMIT 1;`;
      if (rows && rows.length > 0 && rows[0]) {
        return mapAttendanceRow(rows[0]);
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  const records = db.attendance.get(employeeId) || [];
  return records.find(r => r.date === todayStr) || null;
}

export async function recordCheckIn(
  employeeId: string,
  workMode: WorkMode = 'office',
  notes?: string
): Promise<AttendanceRecord> {
  const records = db.attendance.get(employeeId) || [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];

  const existingToday = await getTodayAttendanceRecord(employeeId);
  if (existingToday && existingToday.checkIn && existingToday.checkIn !== '-') {
    throw new Error('You have already checked in for today.');
  }

  const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

  const newRecord: AttendanceRecord = {
    id: `att-${employeeId}-${todayStr}`,
    employeeId,
    date: todayStr,
    checkIn: timeStr,
    checkOut: undefined,
    durationMinutes: 0,
    status: isLate ? 'late' : 'present',
    workMode,
    notes: notes || (workMode === 'remote' ? 'Remote check-in' : 'Office check-in'),
    isOnTime: !isLate,
  };

  if (isNeonConfigured && sql) {
    try {
      await sql`
        INSERT INTO attendance (id, employee_id, date, check_in, duration_minutes, status, work_mode, notes, is_on_time)
        VALUES (${newRecord.id}, ${newRecord.employeeId}, ${newRecord.date}, ${newRecord.checkIn}, 0, ${newRecord.status}, ${newRecord.workMode}, ${newRecord.notes}, ${newRecord.isOnTime})
        ON CONFLICT (id) DO UPDATE SET check_in = ${newRecord.checkIn}, status = ${newRecord.status}, work_mode = ${newRecord.workMode};
      `;
    } catch (err) {
      console.warn('Neon check-in error:', err);
    }
  }

  const updated = [newRecord, ...records.filter(r => r.date !== todayStr)];
  db.attendance.set(employeeId, updated);

  await addNotification(employeeId, {
    title: 'Check-in Recorded',
    message: `Checked in successfully at ${timeStr} (${workMode.toUpperCase()} mode). Have a productive workday!`,
    category: 'attendance',
  });

  return newRecord;
}

export async function recordCheckOut(employeeId: string, notes?: string): Promise<AttendanceRecord> {
  const records = db.attendance.get(employeeId) || [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];

  const todayRecord = await getTodayAttendanceRecord(employeeId);
  if (!todayRecord || !todayRecord.checkIn || todayRecord.checkIn === '-') {
    throw new Error('You must check in before you can check out.');
  }

  if (todayRecord.checkOut && todayRecord.checkOut !== '-') {
    throw new Error('You have already checked out for today.');
  }

  const [inH, inM, inS] = todayRecord.checkIn.split(':').map(Number);
  const checkInDate = new Date();
  checkInDate.setHours(inH, inM, inS || 0, 0);

  const durationMs = Math.max(0, now.getTime() - checkInDate.getTime());
  const durationMinutes = Math.floor(durationMs / (1000 * 60));

  todayRecord.checkOut = timeStr;
  todayRecord.durationMinutes = durationMinutes;
  if (notes) {
    todayRecord.notes = todayRecord.notes ? `${todayRecord.notes} | ${notes}` : notes;
  }

  if (isNeonConfigured && sql) {
    try {
      await sql`
        UPDATE attendance
        SET check_out = ${timeStr}, duration_minutes = ${durationMinutes}, notes = ${todayRecord.notes || ''}
        WHERE id = ${todayRecord.id};
      `;
    } catch (err) {
      console.warn('Neon check-out error:', err);
    }
  }

  const todayIndex = records.findIndex(r => r.date === todayStr);
  if (todayIndex !== -1) {
    records[todayIndex] = { ...todayRecord };
    db.attendance.set(employeeId, records);
  }

  const hours = (durationMinutes / 60).toFixed(1);
  await addNotification(employeeId, {
    title: 'Check-out Recorded',
    message: `Checked out at ${timeStr}. Total shift duration: ${hours} hours. Great work today!`,
    category: 'attendance',
  });

  return todayRecord;
}

// --- LEAVE MANAGEMENT ---

export async function getLeaveBalances(employeeId: string): Promise<LeaveBalance[]> {
  const leaves = await getEmployeeLeaves(employeeId);

  const totalAllocations: Record<LeaveType, { name: string; total: number; color: string }> = {
    annual: { name: 'Paid / Annual Leave', total: 18, color: '#0ea5e9' },
    sick: { name: 'Sick Leave', total: 10, color: '#10b981' },
    casual: { name: 'Casual Leave', total: 6, color: '#f59e0b' },
    remote_wfh: { name: 'Remote / WFH Allowance', total: 24, color: '#8b5cf6' },
    unpaid: { name: 'Unpaid Leave', total: 30, color: '#64748b' },
    maternity_paternity: { name: 'Parental Leave', total: 60, color: '#ec4899' },
  };

  return (Object.keys(totalAllocations) as LeaveType[]).map(type => {
    const alloc = totalAllocations[type];
    const userLeavesOfType = leaves.filter(l => l.leaveType === type);

    const approvedDays = userLeavesOfType
      .filter(l => l.status === 'approved')
      .reduce((sum, l) => sum + l.daysCount, 0);

    const pendingDays = userLeavesOfType
      .filter(l => l.status === 'pending')
      .reduce((sum, l) => sum + l.daysCount, 0);

    const available = Math.max(0, alloc.total - approvedDays - pendingDays);

    return {
      type,
      name: alloc.name,
      totalAllowed: alloc.total,
      used: approvedDays,
      pending: pendingDays,
      available,
      color: alloc.color,
    };
  });
}

export async function getEmployeeLeaves(employeeId: string): Promise<LeaveRequest[]> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM leaves WHERE employee_id = ${employeeId} ORDER BY applied_date DESC;`;
      if (rows && rows.length > 0) {
        return rows.map(mapLeaveRow).filter(Boolean);
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  return db.leaves.get(employeeId) || [];
}

export async function applyForLeave(
  employeeId: string,
  data: {
    leaveType: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
    isHalfDay?: boolean;
    halfDayPeriod?: 'morning' | 'afternoon';
    emergencyContact?: string;
  }
): Promise<LeaveRequest> {
  const emp = await getEmployeeByEmployeeId(employeeId);
  if (!emp) throw new Error('Employee not found');

  const start = new Date(data.startDate);
  const end = new Date(data.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Please select valid start and end dates.');
  }

  if (end < start) {
    throw new Error('End date cannot be earlier than start date.');
  }

  let daysCount = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      daysCount += 1;
    }
    cur.setDate(cur.getDate() + 1);
  }

  if (data.isHalfDay) {
    daysCount = 0.5;
  }

  if (daysCount <= 0) {
    throw new Error('Selected date range contains no working days (weekends only).');
  }

  const balances = await getLeaveBalances(employeeId);
  const balance = balances.find(b => b.type === data.leaveType);
  if (balance && balance.available < daysCount && data.leaveType !== 'unpaid') {
    throw new Error(
      `Insufficient ${balance.name} balance. Available: ${balance.available} days, Requested: ${daysCount} days.`
    );
  }

  const existingLeaves = await getEmployeeLeaves(employeeId);
  const hasOverlap = existingLeaves.some(l => {
    if (l.status === 'rejected' || l.status === 'cancelled') return false;
    const lStart = new Date(l.startDate);
    const lEnd = new Date(l.endDate);
    return start <= lEnd && end >= lStart;
  });

  if (hasOverlap) {
    throw new Error('You already have an active or pending leave request in this date range.');
  }

  const newRequest: LeaveRequest = {
    id: `lv-${Date.now()}`,
    employeeId,
    employeeName: emp.name,
    leaveType: data.leaveType,
    startDate: data.startDate,
    endDate: data.endDate,
    daysCount,
    isHalfDay: data.isHalfDay,
    halfDayPeriod: data.halfDayPeriod,
    reason: data.reason.trim(),
    status: 'pending',
    appliedDate: new Date().toISOString().split('T')[0],
    emergencyContactDuringLeave: data.emergencyContact?.trim(),
  };

  if (isNeonConfigured && sql) {
    try {
      await sql`
        INSERT INTO leaves (
          id, employee_id, employee_name, leave_type, start_date, end_date, days_count,
          is_half_day, half_day_period, reason, status, applied_date, emergency_contact
        ) VALUES (
          ${newRequest.id}, ${newRequest.employeeId}, ${newRequest.employeeName}, ${newRequest.leaveType},
          ${newRequest.startDate}, ${newRequest.endDate}, ${newRequest.daysCount},
          ${newRequest.isHalfDay || false}, ${newRequest.halfDayPeriod || null}, ${newRequest.reason},
          ${newRequest.status}, ${newRequest.appliedDate}, ${newRequest.emergencyContactDuringLeave || null}
        );
      `;
    } catch (err) {
      console.warn('Neon leave insert error:', err);
    }
  }

  db.leaves.set(employeeId, [newRequest, ...existingLeaves]);

  await addNotification(employeeId, {
    title: 'Leave Application Submitted',
    message: `Your ${data.leaveType.toUpperCase()} leave request for ${daysCount} day(s) (${data.startDate} to ${data.endDate}) was submitted for manager review.`,
    category: 'leave',
    actionUrl: '/leave',
  });

  return newRequest;
}

export async function cancelLeaveRequest(employeeId: string, leaveId: string): Promise<LeaveRequest> {
  const leaves = await getEmployeeLeaves(employeeId);
  const index = leaves.findIndex(l => l.id === leaveId);
  if (index === -1) {
    throw new Error('Leave request not found.');
  }

  const target = leaves[index];
  if (target.status !== 'pending') {
    throw new Error('Only pending leave requests can be cancelled.');
  }

  target.status = 'cancelled';

  if (isNeonConfigured && sql) {
    try {
      await sql`UPDATE leaves SET status = 'cancelled' WHERE id = ${leaveId};`;
    } catch (err) {
      console.warn('Neon leave cancel error:', err);
    }
  }

  leaves[index] = { ...target };
  db.leaves.set(employeeId, leaves);

  await addNotification(employeeId, {
    title: 'Leave Request Cancelled',
    message: `Your pending leave request (${target.startDate} to ${target.endDate}) has been cancelled.`,
    category: 'leave',
    actionUrl: '/leave',
  });

  return target;
}

// --- SALARY & PAYSLIP (Read-Only) ---

export async function getSalaryDetails(employeeId: string) {
  const emp = await getEmployeeByEmployeeId(employeeId);
  if (!emp) throw new Error('Employee not found');

  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM payslips WHERE employee_id = ${employeeId} ORDER BY period_start DESC;`;
      if (rows && rows.length > 0) {
        return {
          salaryStructure: emp.salary,
          payslips: rows.map(mapPayslipRow).filter(Boolean),
        };
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  const payslips = db.payslips.get(employeeId) || [];
  return {
    salaryStructure: emp.salary,
    payslips,
  };
}

export async function getPayslipById(employeeId: string, payslipId: string): Promise<Payslip | null> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM payslips WHERE employee_id = ${employeeId} AND id = ${payslipId} LIMIT 1;`;
      if (rows && rows.length > 0 && rows[0]) {
        return mapPayslipRow(rows[0]);
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  const payslips = db.payslips.get(employeeId) || [];
  return payslips.find(p => p.id === payslipId) || null;
}

// --- NOTIFICATIONS ---

export async function getEmployeeNotifications(employeeId: string): Promise<NotificationItem[]> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM notifications WHERE employee_id = ${employeeId} ORDER BY created_at DESC;`;
      if (rows && rows.length > 0) {
        return rows.map(mapNotificationRow).filter(Boolean);
      }
    } catch {
      // Fallback to in-memory store
    }
  }
  return db.notifications.get(employeeId) || [];
}

export async function markNotificationRead(employeeId: string, notificationId: string): Promise<boolean> {
  if (isNeonConfigured && sql) {
    try {
      await sql`UPDATE notifications SET is_read = true WHERE id = ${notificationId} AND employee_id = ${employeeId};`;
    } catch (err) {
      console.warn('Neon mark read error:', err);
    }
  }

  const notifs = db.notifications.get(employeeId) || [];
  const item = notifs.find(n => n.id === notificationId);
  if (item) {
    item.isRead = true;
    db.notifications.set(employeeId, [...notifs]);
    return true;
  }
  return false;
}

export async function markAllNotificationsRead(employeeId: string): Promise<boolean> {
  if (isNeonConfigured && sql) {
    try {
      await sql`UPDATE notifications SET is_read = true WHERE employee_id = ${employeeId};`;
    } catch (err) {
      console.warn('Neon mark all read error:', err);
    }
  }

  const notifs = db.notifications.get(employeeId) || [];
  for (const n of notifs) {
    n.isRead = true;
  }
  db.notifications.set(employeeId, [...notifs]);
  return true;
}

export async function addNotification(
  employeeId: string,
  notif: Omit<NotificationItem, 'id' | 'employeeId' | 'timestamp' | 'isRead'>
): Promise<NotificationItem> {
  const newItem: NotificationItem = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    employeeId,
    timestamp: 'Just now',
    isRead: false,
    ...notif,
  };

  if (isNeonConfigured && sql) {
    try {
      await sql`
        INSERT INTO notifications (id, employee_id, title, message, category, timestamp, is_read, action_url)
        VALUES (${newItem.id}, ${newItem.employeeId}, ${newItem.title}, ${newItem.message}, ${newItem.category}, ${newItem.timestamp}, ${newItem.isRead}, ${newItem.actionUrl || null});
      `;
    } catch (err) {
      console.warn('Neon notification insert error:', err);
    }
  }

  const notifs = db.notifications.get(employeeId) || [];
  db.notifications.set(employeeId, [newItem, ...notifs]);
  return newItem;
}

// --- PERSONAL ANALYTICS & REPORTS ---

export async function getPersonalReport(employeeId: string): Promise<PersonalReportSummary> {
  const records = await getEmployeeAttendance(employeeId);
  const totalLogs = records.length || 1;
  const presentCount = records.filter(r => r.status === 'present' || r.status === 'late').length;
  const onLeaveCount = records.filter(r => r.status === 'on_leave').length;
  const halfDayCount = records.filter(r => r.status === 'half_day').length;
  const onTimeCount = records.filter(r => r.isOnTime).length;

  const totalMinutes = records.reduce((sum, r) => sum + r.durationMinutes, 0);
  const avgHours = Number((totalMinutes / (Math.max(1, presentCount) * 60)).toFixed(1));

  const attendancePct = Math.min(100, Math.round(((presentCount + halfDayCount * 0.5) / totalLogs) * 100));
  const punctualityRate = Math.min(100, Math.round((onTimeCount / Math.max(1, presentCount)) * 100));

  const monthlyHoursTrend = [
    { week: 'Week 1', hours: 41.5, target: 40 },
    { week: 'Week 2', hours: 38.0, target: 40 },
    { week: 'Week 3', hours: 42.8, target: 40 },
    { week: 'Week 4', hours: 40.2, target: 40 },
  ];

  const leaveUsageByCategory = [
    { category: 'Paid Time Off', used: 4, total: 18 },
    { category: 'Sick Leave', used: 2, total: 10 },
    { category: 'Casual Leave', used: 1, total: 6 },
    { category: 'Remote Days', used: 7, total: 24 },
  ];

  return {
    employeeId,
    period: 'Current Quarter (Q3 2026)',
    attendancePercentage: attendancePct || 96,
    totalWorkingDays: totalLogs,
    daysPresent: presentCount,
    daysOnLeave: onLeaveCount,
    daysHalfDay: halfDayCount,
    averageWorkingHours: avgHours || 8.4,
    punctualityRate: punctualityRate || 95,
    currentStreakDays: 14,
    monthlyHoursTrend,
    leaveUsageByCategory,
  };
}

// --- HR POLICY ASSISTANT KNOWLEDGE BASE ---

export const HR_POLICIES = [
  {
    topic: 'Leave & Time Off Policy',
    keywords: ['leave', 'sick', 'casual', 'annual', 'vacation', 'pto', 'holiday'],
    content: `• Annual/Paid Leave: 18 days per year, accrues 1.5 days/month. Maximum 10 days can carry forward to next year.
• Sick Leave: 10 days per year. Medical certificate required for 3+ consecutive days.
• Casual Leave: 6 days per year for urgent personal matters.
• Remote / WFH Allowance: Up to 2 days/week for hybrid employees with manager notice.
• Application Window: Submit leave requests at least 48 hours in advance for planned time-off.`,
  },
  {
    topic: 'Working Hours & Attendance',
    keywords: ['hours', 'timing', 'check in', 'attendance', 'late', 'shift', 'grace period'],
    content: `• Standard Work Hours: 9:00 AM – 6:00 PM (Monday to Friday, 8 work hours + 1h lunch).
• Grace Period: Up to 30 minutes (check-in before 9:30 AM is on-time).
• Core Collaboration Hours: 10:00 AM – 4:00 PM PST.
• Overtime / Comp-off: Overtime exceeding 45 hours/week qualifies for compensatory off upon manager approval.`,
  },
  {
    topic: 'Payroll, Taxes & Payslips',
    keywords: ['salary', 'payday', 'payslip', 'tax', 'deduction', 'bank', 'pf', 'bonus'],
    content: `• Pay Date: Salary is processed on the last business day of every month directly to your registered bank account.
• Payslip Availability: Downloadable in PDF format in your Salary portal by the 1st of the following month.
• Tax Declarations: Annual investment proofs can be submitted between Dec 1 and Jan 15 for Form W-4/TDS calculation.`,
  },
  {
    topic: 'Health, Wellness & Benefits',
    keywords: ['insurance', 'health', 'medical', 'gym', 'wellness', 'benefits', 'dental'],
    content: `• Comprehensive Health Insurance: 100% employer-covered for employees + 70% covered for dependents.
• Annual Health Checkup: Fully reimbursed up to $350/year.
• Learning & Development Stipend: $1,500 annual budget for books, courses, and engineering certifications.`,
  },
];

// --- HR / ADMIN PORTAL OPERATIONS ---

export async function getAllEmployees(): Promise<EmployeeProfile[]> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM employees ORDER BY employee_id ASC;`;
      if (rows && rows.length > 0) {
        return rows.map(mapEmployeeRow).filter(Boolean);
      }
    } catch {
      // Fallback
    }
  }
  return Array.from(db.employees.values());
}

export async function getAllLeaves(): Promise<LeaveRequest[]> {
  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      const rows = await sql`SELECT * FROM leaves ORDER BY applied_date DESC;`;
      if (rows && rows.length > 0) {
        return rows.map(mapLeaveRow).filter(Boolean);
      }
    } catch {
      // Fallback
    }
  }
  const all: LeaveRequest[] = [];
  for (const list of db.leaves.values()) {
    all.push(...list);
  }
  return all.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
}

export async function adminApproveLeave(
  leaveId: string,
  adminName: string,
  comments?: string
): Promise<LeaveRequest> {
  const approvalDate = new Date().toISOString().split('T')[0];

  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      await sql`
        UPDATE leaves
        SET status = 'approved', approved_by = ${adminName}, approval_date = ${approvalDate}, admin_comments = ${comments || 'Approved by HR'}
        WHERE id = ${leaveId};
      `;
    } catch {
      // Fallback
    }
  }

  // Update in-memory
  let targetReq: LeaveRequest | null = null;
  for (const [empId, list] of db.leaves.entries()) {
    const idx = list.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status: 'approved',
        approvedBy: adminName,
        approvalDate,
        adminComments: comments || 'Approved by HR',
      };
      targetReq = list[idx];
      db.leaves.set(empId, list);

      await addNotification(empId, {
        title: 'Leave Request Approved',
        message: `Your ${targetReq.leaveType.toUpperCase()} leave request (${targetReq.startDate} to ${targetReq.endDate}) was APPROVED by ${adminName}.`,
        category: 'leave',
        actionUrl: '/leave',
      });
      break;
    }
  }

  if (!targetReq) {
    throw new Error('Leave request not found');
  }

  return targetReq;
}

export async function adminRejectLeave(
  leaveId: string,
  adminName: string,
  comments?: string
): Promise<LeaveRequest> {
  const rejectionDate = new Date().toISOString().split('T')[0];

  if (isNeonConfigured && sql) {
    try {
      await ensureNeonSchema();
      await sql`
        UPDATE leaves
        SET status = 'rejected', approved_by = ${adminName}, approval_date = ${rejectionDate}, admin_comments = ${comments || 'Rejected'}
        WHERE id = ${leaveId};
      `;
    } catch {
      // Fallback
    }
  }

  // Update in-memory
  let targetReq: LeaveRequest | null = null;
  for (const [empId, list] of db.leaves.entries()) {
    const idx = list.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status: 'rejected',
        approvedBy: adminName,
        approvalDate: rejectionDate,
        adminComments: comments || 'Rejected by HR',
      };
      targetReq = list[idx];
      db.leaves.set(empId, list);

      await addNotification(empId, {
        title: 'Leave Request Rejected',
        message: `Your ${targetReq.leaveType.toUpperCase()} leave request was REJECTED by ${adminName}. Note: ${comments || 'No comment provided.'}`,
        category: 'leave',
        actionUrl: '/leave',
      });
      break;
    }
  }

  if (!targetReq) {
    throw new Error('Leave request not found');
  }

  return targetReq;
}

export async function getAdminOverview() {
  const employees = await getAllEmployees();
  const allLeaves = await getAllLeaves();
  const todayStr = new Date().toISOString().split('T')[0];

  const pendingLeaves = allLeaves.filter(l => l.status === 'pending');

  let presentCount = 0;
  let remoteCount = 0;
  let onLeaveCount = 0;
  let lateCount = 0;

  const roster: Array<{ employee: EmployeeProfile; todayRecord: AttendanceRecord | null }> = [];

  for (const emp of employees) {
    const record = await getTodayAttendanceRecord(emp.employeeId);
    roster.push({ employee: emp, todayRecord: record });

    if (record) {
      if (record.status === 'present' || record.status === 'late' || record.status === 'half_day') {
        presentCount += 1;
        if (record.workMode === 'remote') remoteCount += 1;
        if (record.status === 'late') lateCount += 1;
      } else if (record.status === 'on_leave') {
        onLeaveCount += 1;
      }
    }
  }

  const totalMonthlyPayroll = employees.reduce((sum, e) => sum + (e.salary?.baseMonthly || 0), 0);

  return {
    totalEmployees: employees.length,
    presentToday: presentCount,
    remoteToday: remoteCount,
    onLeaveToday: onLeaveCount,
    lateToday: lateCount,
    pendingLeavesCount: pendingLeaves.length,
    totalMonthlyPayroll,
    roster,
    pendingLeaves: pendingLeaves.slice(0, 10),
    employees,
  };
}

