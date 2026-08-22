export type UserRole = 'employee' | 'admin' | 'hr';

export type WorkMode = 'office' | 'remote' | 'hybrid';

export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'on_leave' | 'late';

export type LeaveType = 'annual' | 'sick' | 'casual' | 'remote_wfh' | 'unpaid' | 'maternity_paternity';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  jobPosition: string;
}

export interface SalaryStructure {
  currency: string;
  baseAnnual: number;
  baseMonthly: number;
  hra: number;
  specialAllowance: number;
  performanceBonus: number;
  providentFund: number;
  professionalTax: number;
  healthInsurance: number;
  netMonthly: number;
  payFrequency: 'Monthly' | 'Bi-weekly';
  bankAccountMasked: string;
  panMasked: string;
  pfNumber: string;
}

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl: string;
  bio?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  // Job Info (Immutable by employee)
  department: string;
  jobPosition: string;
  managerName: string;
  managerEmail: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  workLocation: string;
  workMode: WorkMode;
  role: UserRole;
  // Salary structure summary (Immutable by employee)
  salary: SalaryStructure;
  // Documents
  documents: Array<{
    id: string;
    title: string;
    category: 'Contract' | 'ID Proof' | 'Tax' | 'Certification';
    uploadDate: string;
    fileSize: string;
  }>;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss or ISO
  checkOut?: string; // HH:mm:ss or ISO
  durationMinutes: number;
  status: AttendanceStatus;
  workMode: WorkMode;
  notes?: string;
  isOnTime: boolean;
}

export interface LeaveBalance {
  type: LeaveType;
  name: string;
  totalAllowed: number;
  used: number;
  pending: number;
  available: number;
  color: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  isHalfDay?: boolean;
  halfDayPeriod?: 'morning' | 'afternoon';
  reason: string;
  status: LeaveStatus;
  appliedDate: string; // YYYY-MM-DD
  approvedBy?: string;
  approvalDate?: string;
  adminComments?: string;
  emergencyContactDuringLeave?: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string; // "July 2026", "June 2026", etc.
  year: number;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
  status: 'Paid' | 'Processing';
  breakdown: {
    basic: number;
    hra: number;
    specialAllowance: number;
    bonus: number;
    providentFund: number;
    taxDeducted: number;
    healthInsurance: number;
  };
  workingDays: number;
  daysPresent: number;
  paidLeaves: number;
}

export interface NotificationItem {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  category: 'attendance' | 'leave' | 'payroll' | 'general';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  iconType?: string;
}

export interface PersonalReportSummary {
  employeeId: string;
  period: string;
  attendancePercentage: number;
  totalWorkingDays: number;
  daysPresent: number;
  daysOnLeave: number;
  daysHalfDay: number;
  averageWorkingHours: number;
  punctualityRate: number; // %
  currentStreakDays: number;
  monthlyHoursTrend: Array<{
    week: string;
    hours: number;
    target: number;
  }>;
  leaveUsageByCategory: Array<{
    category: string;
    used: number;
    total: number;
  }>;
}
