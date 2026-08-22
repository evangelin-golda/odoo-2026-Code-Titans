'use client';

import React from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { HRMSProvider, useHRMS } from '@/context/HRMSContext';
import { HRDashboard } from '../hr/HRDashboard';
import { HREmployeeManagement } from '../hr/HREmployeeManagement';
import { HRAttendanceManagement } from '../hr/HRAttendanceManagement';
import { HRLeaveApprovals } from '../hr/HRLeaveApprovals';
import { HRPayrollManagement } from '../hr/HRPayrollManagement';
import { HRReportsAnalytics } from '../hr/HRReportsAnalytics';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  BarChart3,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

function HRAdminInnerView() {
  const { setActiveView: setEmployeeActiveView } = useEmployee();
  const { activeView, setActiveView } = useHRMS();

  const navItems = [
    { id: 'dashboard', label: 'HR Dashboard', icon: <LayoutDashboard size={15} /> },
    { id: 'employees', label: 'Employees', icon: <Users size={15} /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock size={15} /> },
    { id: 'leave-approvals', label: 'Leave Approvals', icon: <CalendarCheck size={15} /> },
    { id: 'payroll', label: 'Payroll', icon: <CreditCard size={15} /> },
    { id: 'reports', label: 'Reports & Analytics', icon: <BarChart3 size={15} /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Role Badge */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E2F0] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#7B2CBF] text-white flex items-center justify-center shadow-md">
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7B2CBF] bg-[#F3E8FC] px-2.5 py-0.5 rounded-md border border-[#E9D5FF]">
                Super HR & Admin Command Center
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1E1035] tracking-tight mt-1">
              Dayflow HRMS Management Suite
            </h1>
          </div>
        </div>

        {/* Action Button: Return to Employee Workspace */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEmployeeActiveView('dashboard')}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Employee Workspace</span>
          </button>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#E8E2F0] shadow-xs overflow-x-auto">
        {navItems.map((item) => {
          const isActive =
            activeView === item.id ||
            (item.id === 'reports' && (activeView === 'reports' || activeView === 'analytics'));
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#7B2CBF] text-white shadow-xs'
                  : 'text-[#1E1035]/65 hover:text-[#1E1035] hover:bg-[#F7F4FA]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Module View Component */}
      <div className="pt-2">
        {activeView === 'dashboard' && <HRDashboard />}
        {activeView === 'employees' && <HREmployeeManagement />}
        {activeView === 'attendance' && <HRAttendanceManagement />}
        {activeView === 'leave-approvals' && <HRLeaveApprovals />}
        {activeView === 'payroll' && <HRPayrollManagement />}
        {(activeView === 'reports' || activeView === 'analytics') && <HRReportsAnalytics />}
      </div>
    </div>
  );
}

export function AdminPortalView() {
  return (
    <HRMSProvider>
      <HRAdminInnerView />
    </HRMSProvider>
  );
}
