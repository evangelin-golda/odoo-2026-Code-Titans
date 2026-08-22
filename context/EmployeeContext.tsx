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
  | 'assistant';

interface EmployeeContextType {
  employee: EmployeeProfile | null;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  isLoading: boolean;
  todayAttendance: AttendanceRecord | null;
  unreadCount: number;
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
        activeView,
        setActiveView,
        isLoading,
        todayAttendance,
        unreadCount,
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
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}
