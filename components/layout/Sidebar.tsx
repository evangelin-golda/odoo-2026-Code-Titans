'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee, NavView } from '@/context/EmployeeContext';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CreditCard,
  Bell,
  LogOut,
  ShieldCheck,
  Play,
  Square,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { DayflowLogo } from '../ui/DayflowLogo';

interface NavItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const {
    employee,
    activeView,
    setActiveView,
    todayAttendance,
    unreadCount,
    handleCheckIn,
    handleCheckOut,
    setOpenApplyLeaveModal,
    enterAdminMode,
    logout,
  } = useEmployee();

  // Real-time elapsed punch timer
  const [elapsedDuration, setElapsedDuration] = useState<string>('00:00:00');

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  useEffect(() => {
    if (!isCheckedIn || isCheckedOut || !todayAttendance?.checkIn) {
      setElapsedDuration('00:00:00');
      return;
    }

    const calcElapsed = () => {
      const parts = todayAttendance.checkIn.split(':');
      if (parts.length < 2) return;
      const inH = parseInt(parts[0], 10);
      const inM = parseInt(parts[1], 10);
      const inDate = new Date();
      inDate.setHours(inH, inM, 0, 0);

      const now = new Date();
      const diffMs = Math.max(0, now.getTime() - inDate.getTime());
      const totalSec = Math.floor(diffMs / 1000);

      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');
      setElapsedDuration(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    calcElapsed();
    const timer = setInterval(calcElapsed, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn, isCheckedOut, todayAttendance]);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'leave', label: 'Leave Requests', icon: CalendarDays },
    { id: 'salary', label: 'Payroll / Salary', icon: CreditCard },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  const handleNavClick = (view: NavView) => {
    setActiveView(view);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      id="dayflow-sidebar"
      className="flex flex-col justify-between h-full w-64 bg-white border-r border-[#E8E2F0] select-none"
    >
      {/* Upper Navigation Links & Logo */}
      <div className="space-y-4">
        {/* Brand Header */}
        <div className="p-6 pb-3 border-b border-[#E8E2F0]">
          <DayflowLogo size={36} showText={true} showSubtitle={true} />
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1" aria-label="Sidebar Navigation">
          <div className="px-3 pb-2 text-[10px] font-bold text-[#1E1035]/45 uppercase tracking-wider">
            Workspace Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#F7F4FA] text-[#7B2CBF] border-r-4 border-[#7B2CBF] shadow-xs'
                    : 'text-[#1E1035]/75 hover:bg-[#F7F4FA] hover:text-[#1E1035]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#7B2CBF]' : 'text-[#1E1035]/60'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#7B2CBF] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Privileged Management Section */}
          <div className="pt-3">
            <div className="px-3 pb-2 text-[10px] font-bold text-[#7B2CBF] uppercase tracking-wider flex items-center justify-between">
              <span>HR & Administration</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-[#7B2CBF]/10 text-[#7B2CBF] font-bold">
                Privileged
              </span>
            </div>
            <button
              type="button"
              id="sidebar-admin-portal-btn"
              onClick={() => {
                enterAdminMode();
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group cursor-pointer border ${
                activeView === 'admin'
                  ? 'bg-[#7B2CBF] text-white border-[#7B2CBF] shadow-xs'
                  : 'text-[#7B2CBF] bg-[#F7F4FA] hover:bg-[#ECE5F5] border-[#E8E2F0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className={`w-4 h-4 transition-colors ${
                    activeView === 'admin' ? 'text-white' : 'text-[#7B2CBF]'
                  }`}
                />
                <span>HR / Admin Portal</span>
              </div>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                  activeView === 'admin'
                    ? 'bg-[#6824A3] text-white'
                    : 'bg-[#7B2CBF]/15 text-[#7B2CBF]'
                }`}
              >
                🔒 Protected
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Live Punch Widget & Quick Action */}
      <div className="p-3 space-y-2.5 border-t border-[#E8E2F0]">
        {/* Live Shift Card */}
        <div className="p-3 bg-[#F7F4FA] rounded-2xl border border-[#E8E2F0] shadow-xs">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[#1E1035]/60 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7B2CBF]" />
              Live Shift Timer
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isCheckedOut
                  ? 'bg-slate-200 text-slate-700'
                  : isCheckedIn
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {isCheckedOut ? 'Completed' : isCheckedIn ? 'Active' : 'Idle'}
            </span>
          </div>

          <div className="text-base font-mono font-bold text-[#1E1035] tracking-wider text-center py-1 bg-white rounded-xl border border-[#E8E2F0] shadow-2xs">
            {elapsedDuration}
          </div>

          <div className="mt-2.5">
            {isCheckedOut ? (
              <div className="text-center text-[10px] text-[#1E1035]/60 py-0.5 font-medium">
                Shift ended at {todayAttendance?.checkOut}
              </div>
            ) : isCheckedIn ? (
              <button
                type="button"
                onClick={() => handleCheckOut()}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                Check Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleCheckIn('office')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-xl bg-[#7B2CBF] hover:bg-[#6824A3] text-white transition-all shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Check In (Office)
              </button>
            )}
          </div>
        </div>

        {/* Quick Apply Leave Button */}
        <button
          type="button"
          onClick={() => {
            setOpenApplyLeaveModal(true);
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-[#1E1035] hover:bg-[#F7F4FA] bg-white rounded-xl border border-[#E8E2F0] transition-colors shadow-2xs cursor-pointer"
        >
          <CalendarDays className="w-3.5 h-3.5 text-[#7B2CBF]" />
          <span>Apply for Time Off</span>
        </button>

        {/* Sign Out Button */}
        <button
          type="button"
          id="sidebar-logout-button"
          onClick={() => {
            logout();
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
