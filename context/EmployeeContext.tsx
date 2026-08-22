'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EmployeeProfile, AttendanceRecord, WorkMode } from '@/types/hrms';
import { useToast } from '@/components/ui/Toast';

export type NavView =
  | 'dashboard'
  | 'profile'
  | 'attendance'
  | 'leave'
  | 'salary'
  | 'notifications'
  | 'reports'
  | 'assistant'
  | 'admin';

export type AuthModalTab = 'login' | 'signup' | 'demo';

interface EmployeeContextType {
  employee: EmployeeProfile | null;
  isAuthenticated: boolean;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  isLoading: boolean;
  todayAttendance: AttendanceRecord | null;
  unreadCount: number;
  login: (credentials: { email?: string; employeeId?: string; identifier?: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone?: string; department?: string; jobPosition?: string; workMode?: WorkMode; password?: string }) => Promise<{ success: boolean; error?: string }>;
  loginEmployee: (empId: string) => Promise<void>;
  switchDemoUser: (empId: string) => Promise<void>;
  logout: () => void;
  handleCheckIn: (workMode?: WorkMode, notes?: string) => Promise<void>;
  handleCheckOut: (notes?: string) => Promise<void>;
  refreshEmployeeData: () => Promise<void>;
  refreshAttendance: () => Promise<void>;
  refreshNotificationsCount: () => Promise<void>;
  openApplyLeaveModal: boolean;
  setOpenApplyLeaveModal: (open: boolean) => void;
  openEditProfileModal: boolean;
  setOpenEditProfileModal: (open: boolean) => void;
  openHRAssistantModal: boolean;
  setOpenHRAssistantModal: (open: boolean) => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
  authModalTab: AuthModalTab;
  setAuthModalTab: (tab: AuthModalTab) => void;
  openAdminAuthModal: boolean;
  setOpenAdminAuthModal: (open: boolean) => void;
  enterAdminMode: () => void;
}

const EmployeeContext = createContext<EmployeeContextType | null>(null);

export const useEmployee = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployee must be used within EmployeeProvider');
  return ctx;
};

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(2);

  // Modals state
  const [openApplyLeaveModal, setOpenApplyLeaveModal] = useState(false);
  const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
  const [openHRAssistantModal, setOpenHRAssistantModal] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login');
  const [openAdminAuthModal, setOpenAdminAuthModal] = useState(false);

  const enterAdminMode = useCallback(() => {
    if (typeof window !== 'undefined') {
      const isVerified = sessionStorage.getItem('dayflow_admin_verified') === 'true';
      if (isVerified) {
        setActiveView('admin');
        return;
      }
    }
    setOpenAdminAuthModal(true);
  }, []);

  // Fetch initial employee profile (Defaults to Alex Rivera EMP-1001)
  const fetchEmployee = useCallback(async (empId: string = 'EMP-1001') => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/me?employeeId=${empId}`);
      const data = await res.json();
      if (data.success && data.employee) {
        setEmployee(data.employee);
      } else {
        showToast('Could not load employee profile', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast('Network error loading profile', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const refreshAttendance = useCallback(async () => {
    if (!employee) return;
    try {
      const res = await fetch(`/api/attendance?employeeId=${employee.employeeId}`);
      const data = await res.json();
      if (data.success) {
        setTodayAttendance(data.today || null);
      }
    } catch (err) {
      console.error(err);
    }
  }, [employee]);

  const refreshNotificationsCount = useCallback(async () => {
    if (!employee) return;
    try {
      const res = await fetch(`/api/notifications?employeeId=${employee.employeeId}`);
      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  }, [employee]);

  const refreshEmployeeData = useCallback(async () => {
    if (!employee) return;
    await fetchEmployee(employee.employeeId);
    await refreshAttendance();
    await refreshNotificationsCount();
  }, [employee, fetchEmployee, refreshAttendance, refreshNotificationsCount]);

  useEffect(() => {
    // Initial bootstrap with EMP-1001
    const storedEmpId = typeof window !== 'undefined' ? localStorage.getItem('dayflow_emp_id') : null;
    const initialId = storedEmpId || 'EMP-1001';
    fetchEmployee(initialId);
  }, [fetchEmployee]);

  useEffect(() => {
    if (employee) {
      refreshAttendance();
      refreshNotificationsCount();
      if (typeof window !== 'undefined') {
        localStorage.setItem('dayflow_emp_id', employee.employeeId);
      }
    }
  }, [employee, refreshAttendance, refreshNotificationsCount]);

  const login = async (credentials: {
    email?: string;
    employeeId?: string;
    identifier?: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success && data.employee) {
        setEmployee(data.employee);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dayflow_emp_id', data.employee.employeeId);
        }
        showToast(`Welcome back, ${data.employee.name}!`, 'success');
        setOpenAuthModal(false);
        return { success: true };
      } else {
        const errorMsg = data.error || 'Authentication failed.';
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Network error during login.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    phone?: string;
    department?: string;
    jobPosition?: string;
    workMode?: WorkMode;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (resData.success && resData.employee) {
        setEmployee(resData.employee);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dayflow_emp_id', resData.employee.employeeId);
        }
        showToast(`Welcome to Dayflow! Your Employee ID is ${resData.employee.employeeId}`, 'success');
        setOpenAuthModal(false);
        return { success: true };
      } else {
        const errorMsg = resData.error || 'Registration failed.';
        showToast(errorMsg, 'error');
        return { success: false, error: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Network error during registration.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const loginEmployee = async (empId: string) => {
    await fetchEmployee(empId);
    showToast(`Logged in successfully as ${empId}`, 'success');
  };

  const switchDemoUser = async (empId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: empId }),
      });
      const data = await res.json();
      if (data.success && data.employee) {
        setEmployee(data.employee);
        if (typeof window !== 'undefined') {
          localStorage.setItem('dayflow_emp_id', data.employee.employeeId);
        }
        showToast(`Switched account to ${data.employee.name} (${data.employee.jobPosition})`, 'info');
        setOpenAuthModal(false);
      } else {
        showToast(data.error || 'Failed to switch user', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error switching demo user', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dayflow_emp_id');
    }
    setEmployee(null);
    setTodayAttendance(null);
    showToast('Logged out of Dayflow HRMS', 'info');
  };

  const handleCheckIn = async (workMode: WorkMode = 'office', notes?: string) => {
    if (!employee) return;
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          action: 'check_in',
          workMode,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Checked in successfully! Have a great workday.', 'success');
        setTodayAttendance(data.record);
        refreshNotificationsCount();
      } else {
        showToast(data.error || 'Check-in failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error during check-in', 'error');
    }
  };

  const handleCheckOut = async (notes?: string) => {
    if (!employee) return;
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          action: 'check_out',
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Checked out successfully. Shift logged!', 'success');
        setTodayAttendance(data.record);
        refreshNotificationsCount();
      } else {
        showToast(data.error || 'Check-out failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Network error during check-out', 'error');
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        employee,
        isAuthenticated: !!employee,
        activeView,
        setActiveView,
        isLoading,
        todayAttendance,
        unreadCount,
        login,
        register,
        loginEmployee,
        switchDemoUser,
        logout,
        handleCheckIn,
        handleCheckOut,
        refreshEmployeeData,
        refreshAttendance,
        refreshNotificationsCount,
        openApplyLeaveModal,
        setOpenApplyLeaveModal,
        openEditProfileModal,
        setOpenEditProfileModal,
        openHRAssistantModal,
        setOpenHRAssistantModal,
        openAuthModal,
        setOpenAuthModal,
        authModalTab,
        setAuthModalTab,
        openAdminAuthModal,
        setOpenAdminAuthModal,
        enterAdminMode,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}
