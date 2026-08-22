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
  BarChart3,
  BookOpen,
  Play,
  Square,
  Shield,
  Sparkles,
  MapPin,
  Laptop,
} from 'lucide-react';
import Image from 'next/image';

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
    unreadCount,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
    setOpenApplyLeaveModal,
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
    { id: 'attendance', label: 'Attendance Log', icon: Clock },
    { id: 'leave', label: 'Leave & Time Off', icon: CalendarDays },
    { id: 'salary', label: 'Salary & Payslips', icon: CreditCard },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { id: 'reports', label: 'Personal Analytics', icon: BarChart3 },
    { id: 'assistant', label: 'HR Handbook & FAQ', icon: BookOpen },
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
      className="flex flex-col justify-between h-full w-64 bg-white border-r border-slate-200 p-4 select-none"
    >
      {/* Upper Navigation Links */}
      <div className="space-y-6">
        {/* Employee Mini Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200 ring-2 ring-sky-500/20 shrink-0">
            {employee?.avatarUrl ? (
              <Image
                src={employee.avatarUrl}
                alt={employee.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-sky-700 bg-sky-50">
                {employee?.name?.charAt(0) || 'E'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 truncate">{employee?.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{employee?.jobPosition}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] text-sky-700 font-mono font-medium">
                <Shield className="w-2.5 h-2.5" />
                {employee?.employeeId}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-slate-500 uppercase font-medium">
                {employee?.workMode}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Employee Workspace
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-rose-500 text-white font-bold'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Punch Widget & Quick Action */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        {/* Live Shift Card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              Live Shift Timer
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
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

          <div className="text-xl font-mono font-bold text-slate-900 tracking-wider my-1 text-center py-1.5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
            {elapsedDuration}
          </div>

          <div className="mt-3">
            {isCheckedOut ? (
              <div className="text-center text-[11px] text-slate-500 py-1 font-medium">
                Shift ended at {todayAttendance?.checkOut}
              </div>
            ) : isCheckedIn ? (
              <button
                type="button"
                onClick={() => handleCheckOut()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all shadow-xs active:scale-[0.98]"
              >
                <Square className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                Check Out Now
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleCheckIn('office')}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Check In (Office)
              </button>
            )}
          </div>
        </div>

        {/* Quick Leave Request Button */}
        <button
          type="button"
          onClick={() => {
            setOpenApplyLeaveModal(true);
            if (onCloseMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-xs"
        >
          <CalendarDays className="w-3.5 h-3.5 text-sky-600" />
          Apply for Time Off
        </button>
      </div>
    </aside>
  );
}
