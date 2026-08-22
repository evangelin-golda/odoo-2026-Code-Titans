export type UserRole = 'employee' | 'hr';

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';

export type LeaveType = 'paid' | 'sick' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  jobTitle: string;
}

export interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  fileSize: string;
  downloadUrl?: string;
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';

export type EmploymentStatus = 'Active' | 'On Leave' | 'Inactive';

export interface SalaryStructure {
  baseSalary: number;
  hra: number;
  specialAllowance: number;
  transportAllowance: number;
  grossSalary: number;
  pfDeduction: number;
  taxDeduction: number;
  otherDeductions: number;
  netSalary: number;
  currency: string;
  payFrequency: 'Monthly' | 'Bi-weekly';
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
}

export interface JobDetails {
  jobTitle: string;
  department: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  joinDate: string;
  reportingManager: string;
  workLocation: string;
  workEmail: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface PersonalDetails {
  name: string;
  employeeId: string;
  email: string;
  phone: string;
  address: string;
  profilePicture: string;
  dateOfBirth?: string;
  gender?: string;
  emergencyContact?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  personalDetails: PersonalDetails;
  jobDetails: JobDetails;
  salaryStructure: SalaryStructure;
  documents: EmployeeDocument[];
  role: UserRole;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // HH:mm AM/PM
  checkOut: string | null;
  status: AttendanceStatus;
  hoursWorked: number;
  remarks?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  remarks: string;
  status: LeaveStatus;
  appliedOn: string;
  hrComments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  jobTitle: string;
  monthYear: string; // e.g. "August 2026"
  baseSalary: number;
  hra: number;
  specialAllowance: number;
  grossSalary: number;
  pfDeduction: number;
  taxDeduction: number;
  netSalary: number;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  paymentDate?: string;
  bankName: string;
  accountNumber: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // employeeId or 'hr_all' or 'all'
  title: string;
  message: string;
  type: 'leave' | 'attendance' | 'payroll' | 'alert' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface HRAlert {
  id: string;
  title: string;
  description: string;
  priority: 'normal' | 'high' | 'urgent';
  date: string;
  targetRole: 'all' | 'employee' | 'hr';
}

export interface AttendanceStats {
  presentCount: number;
  absentCount: number;
  halfDayCount: number;
  leaveCount: number;
  totalEmployees: number;
  attendanceRate: number;
}
