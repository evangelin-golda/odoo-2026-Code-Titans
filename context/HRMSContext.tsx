'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  NotificationItem,
  HRAlert,
  AttendanceStatus,
  LeaveType,
  LeaveStatus,
} from '../types/dayflowTypes';
import {
  initialEmployees,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialPayrollRecords,
  initialNotifications,
  initialHRAlerts,
} from '../data/dayflowData';

interface HRMSContextType {
  currentUser: User | null;
  currentRole: UserRole;
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  payrollRecords: PayrollRecord[];
  notifications: NotificationItem[];
  alerts: HRAlert[];
  activeView: string;
  setActiveView: (view: string) => void;
  // Auth
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  impersonateEmployee: (employeeId: string) => void;
  // Profile
  updateEmployeeFull: (updatedEmployee: Employee) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => Employee;
  // Attendance
  checkIn: (employeeId: string) => void;
  checkOut: (employeeId: string) => void;
  getTodayAttendance: (employeeId: string) => AttendanceRecord | undefined;
  // Leave
  reviewLeave: (leaveId: string, status: 'approved' | 'rejected', hrComments: string) => void;
  approveLeave: (leaveId: string, hrComments?: string) => void;
  rejectLeave: (leaveId: string, hrComments?: string) => void;
  // Payroll
  updateSalaryStructure: (employeeId: string, salary: Partial<Employee['salaryStructure']>) => void;
}

const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

const STORAGE_PREFIX = 'dayflow_hrms_v2_';

export const HRMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    const admin = initialEmployees.find((e) => e.role === 'hr') || initialEmployees[1];
    return {
      id: admin.id,
      employeeId: admin.employeeId,
      name: admin.personalDetails.name,
      email: admin.personalDetails.email,
      role: 'hr',
      avatarUrl: admin.personalDetails.profilePicture,
      department: admin.jobDetails.department,
      jobTitle: admin.jobDetails.jobTitle,
    };
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('hr');
  const [activeView, setActiveView] = useState<string>('dashboard');

  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}employees`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialEmployees;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}attendance`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialAttendanceRecords;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}leaves`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialLeaveRequests;
  });

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}payroll`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return initialPayrollRecords;
  });

  const [notifications] = useState<NotificationItem[]>(initialNotifications);
  const [alerts] = useState<HRAlert[]>(initialHRAlerts);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}employees`, JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}attendance`, JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}leaves`, JSON.stringify(leaveRequests));
    }
  }, [leaveRequests]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${STORAGE_PREFIX}payroll`, JSON.stringify(payrollRecords));
    }
  }, [payrollRecords]);

  const login = async (email: string, role?: UserRole) => {
    const found = employees.find(
      (e) => e.personalDetails.email.toLowerCase() === email.toLowerCase()
    );
    if (found) {
      const u: User = {
        id: found.id,
        employeeId: found.employeeId,
        name: found.personalDetails.name,
        email: found.personalDetails.email,
        role: role || found.role,
        avatarUrl: found.personalDetails.profilePicture,
        department: found.jobDetails.department,
        jobTitle: found.jobDetails.jobTitle,
      };
      setCurrentUser(u);
      setCurrentRole(u.role);
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const impersonateEmployee = (employeeId: string) => {
    const found = employees.find((e) => e.employeeId === employeeId);
    if (found) {
      setCurrentUser({
        id: found.id,
        employeeId: found.employeeId,
        name: found.personalDetails.name,
        email: found.personalDetails.email,
        role: found.role,
        avatarUrl: found.personalDetails.profilePicture,
        department: found.jobDetails.department,
        jobTitle: found.jobDetails.jobTitle,
      });
      setCurrentRole(found.role);
    }
  };

  const updateEmployeeFull = (updatedEmployee: Employee) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === updatedEmployee.id || e.employeeId === updatedEmployee.employeeId ? updatedEmployee : e))
    );
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now()}`;
    const newEmpId = `EMP-${1000 + employees.length + 1}`;
    const newEmployee: Employee = {
      ...empData,
      id: newId,
      employeeId: empData.employeeId || newEmpId,
      personalDetails: {
        ...empData.personalDetails,
        employeeId: empData.employeeId || newEmpId,
      },
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    return newEmployee;
  };

  const checkIn = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const emp = employees.find((e) => e.employeeId === employeeId);
    if (!emp) return;

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      employeeName: emp.personalDetails.name,
      employeeAvatar: emp.personalDetails.profilePicture,
      department: emp.jobDetails.department,
      date: today,
      checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      checkOut: null,
      status: 'present',
      hoursWorked: 8.0,
      remarks: 'Self check-in recorded',
    };

    setAttendanceRecords((prev) => [newRecord, ...prev.filter((r) => !(r.employeeId === employeeId && r.date === today))]);
  };

  const checkOut = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setAttendanceRecords((prev) =>
      prev.map((r) => {
        if (r.employeeId === employeeId && r.date === today) {
          return {
            ...r,
            checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return r;
      })
    );
  };

  const getTodayAttendance = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceRecords.find((r) => r.employeeId === employeeId && r.date === today);
  };

  const reviewLeave = (leaveId: string, status: 'approved' | 'rejected', hrComments: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.id === leaveId) {
          return {
            ...l,
            status,
            hrComments,
            reviewedBy: currentUser?.name || 'HR Lead',
            reviewedAt: new Date().toISOString().split('T')[0],
          };
        }
        return l;
      })
    );
  };

  const approveLeave = (leaveId: string, hrComments?: string) => {
    reviewLeave(leaveId, 'approved', hrComments || 'Approved by HR Lead');
  };

  const rejectLeave = (leaveId: string, hrComments?: string) => {
    reviewLeave(leaveId, 'rejected', hrComments || 'Declined by HR Lead');
  };

  const updateSalaryStructure = (employeeId: string, salary: Partial<Employee['salaryStructure']>) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.employeeId === employeeId) {
          return {
            ...e,
            salaryStructure: {
              ...e.salaryStructure,
              ...salary,
            },
          };
        }
        return e;
      })
    );
  };

  return (
    <HRMSContext.Provider
      value={{
        currentUser,
        currentRole,
        employees,
        attendanceRecords,
        leaveRequests,
        payrollRecords,
        notifications,
        alerts,
        activeView,
        setActiveView,
        login,
        logout,
        switchRole,
        impersonateEmployee,
        updateEmployeeFull,
        addEmployee,
        checkIn,
        checkOut,
        getTodayAttendance,
        reviewLeave,
        approveLeave,
        rejectLeave,
        updateSalaryStructure,
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = (): HRMSContextType => {
  const ctx = useContext(HRMSContext);
  if (!ctx) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return ctx;
};
