'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  Bell,
  Clock,
  LogOut,
  ChevronDown,
  User,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Calendar,
  LogIn,
  UserPlus,
  CheckCheck,
} from 'lucide-react';
import Image from 'next/image';
import { DayflowLogo } from '../ui/DayflowLogo';

export function Navbar({
  onToggleMobileMenu,
  isMobileMenuOpen,
}: {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}) {
  const {
    employee,
    todayAttendance,
    unreadCount,
    activeView,
    setActiveView,
    handleCheckIn,
    handleCheckOut,
    setOpenHRAssistantModal,
    setOpenAuthModal,
    setAuthModalTab,
    enterAdminMode,
    logout,
  } = useEmployee();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: employee?.role === 'hr' || employee?.role === 'admin' ? 'HR Overview' : 'Employee Overview',
      subtitle: 'Welcome back to your Dayflow workspace',
    },
    profile: {
      title: 'My Profile',
      subtitle: 'Personal, job, salary, and document details',
    },
    attendance: {
      title: 'Attendance Tracking',
      subtitle: 'Check-in, daily logs, and weekly work hours',
    },
    leave: {
      title: 'Leave & Time-Off Requests',
      subtitle: 'Apply for paid, sick, or unpaid leave and track status',
    },
    salary: {
      title: 'My Salary & Pay Slips',
      subtitle: 'Transparent view of your earnings, deductions, and tax stubs',
    },
    notifications: {
      title: 'Notification Center',
      subtitle: 'System alerts, leave updates, and corporate notices',
    },
    reports: {
      title: 'Performance & Reports',
      subtitle: 'Attendance performance insights and personal analytics',
    },
    admin: {
      title: 'HR & Admin Command Center',
      subtitle: 'Company-wide workforce management, approvals, and payroll',
    },
  };

  const currentViewMeta = viewTitles[activeView] || {
    title: 'Dayflow HRMS',
    subtitle: 'Every workday, perfectly aligned.',
  };

  return (
    <header
      id="dayflow-top-navbar"
      className="h-20 px-4 sm:px-8 border-b border-[#E8E2F0] flex items-center justify-between bg-white sticky top-0 z-30 transition-all shadow-xs"
    >
      {/* Left: Mobile Drawer Trigger + Brand Logo & Dynamic View Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#1E1035] hover:bg-[#F7F4FA] border border-[#E8E2F0] cursor-pointer"
          aria-label="Open navigation drawer"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div
          onClick={() => setActiveView('dashboard')}
          className="cursor-pointer group flex items-center gap-3 select-none"
        >
          <DayflowLogo size={34} showText={false} />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1035] tracking-tight leading-tight group-hover:text-[#7B2CBF] transition-colors">
              {currentViewMeta.title}
            </h2>
            <p className="text-[11px] text-[#1E1035]/60 font-medium leading-tight mt-0.5 hidden sm:block">
              {todayFormatted} • {currentTime || '09:00:00 AM'}
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Shift Status Live Capsule (Desktop) */}
      {employee && (
        <div className="hidden lg:flex items-center gap-3 bg-[#F7F4FA] px-4 py-1.5 rounded-full border border-[#E8E2F0] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#1E1035]/60 font-medium">Shift Status:</span>
            {isCheckedOut ? (
              <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Shift Closed ({todayAttendance?.checkOut})
              </span>
            ) : isCheckedIn ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active on Duty (In: {todayAttendance?.checkIn})
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Not Checked In
              </span>
            )}
          </div>
        </div>
      )}

      {/* Right Side: Actions, Role Badge, Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {employee ? (
          <>
            {/* Quick Punch Button */}
            {!isCheckedOut && (
              <button
                type="button"
                onClick={() => (isCheckedIn ? handleCheckOut() : handleCheckIn('office'))}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs ${
                  isCheckedIn
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Clock size={14} />
                <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
              </button>
            )}

            {/* HR / Admin Portal Switcher Capsule */}
            <button
              type="button"
              id="header-admin-portal-btn"
              onClick={() => enterAdminMode()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeView === 'admin'
                  ? 'bg-[#7B2CBF] text-white border-[#7B2CBF] shadow-xs'
                  : 'bg-[#F7F4FA] hover:bg-[#ECE5F5] text-[#1E1035] border-[#E8E2F0]'
              }`}
              title="Access HR & Admin Portal"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeView === 'admin' ? 'bg-white' : 'bg-[#7B2CBF]'
                }`}
              />
              <span className="hidden sm:inline">
                {employee.role === 'hr' || employee.role === 'admin' ? 'HR Portal' : 'Admin'}
              </span>
              <ShieldCheck size={14} className={activeView === 'admin' ? 'text-white' : 'text-[#7B2CBF]'} />
            </button>

            {/* HR Handbook Assistant Icon */}
            <button
              type="button"
              onClick={() => setOpenHRAssistantModal(true)}
              className="p-2 rounded-xl text-[#1E1035]/70 hover:text-[#7B2CBF] hover:bg-[#F7F4FA] border border-[#E8E2F0] transition-colors cursor-pointer"
              title="HR Handbook & Policies"
            >
              <Sparkles size={18} className="text-[#7B2CBF]" />
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                id="header-notification-button"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-[#1E1035]/70 hover:text-[#7B2CBF] hover:bg-[#F7F4FA] border border-[#E8E2F0] transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-[#7B2CBF] rounded-full ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E8E2F0] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-5 py-3.5 border-b border-[#E8E2F0] flex items-center justify-between bg-[#F7F4FA]/70">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1E1035]">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7B2CBF] text-white">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveView('notifications');
                        setIsNotifOpen(false);
                      }}
                      className="text-[11px] font-semibold text-[#7B2CBF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck size={13} />
                      <span>View All</span>
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E8E2F0]">
                    <div
                      onClick={() => {
                        setActiveView('leave');
                        setIsNotifOpen(false);
                      }}
                      className="p-3.5 hover:bg-[#F7F4FA] transition-colors cursor-pointer flex items-start gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#7B2CBF] mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#1E1035]">Leave Balance Verified</p>
                        <p className="text-[11px] text-[#1E1035]/70 mt-0.5">
                          Your annual paid leave balance has been refreshed for August 2026.
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        setActiveView('salary');
                        setIsNotifOpen(false);
                      }}
                      className="p-3.5 hover:bg-[#F7F4FA] transition-colors cursor-pointer flex items-start gap-3"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-[#1E1035]">Monthly Pay Slip Available</p>
                        <p className="text-[11px] text-[#1E1035]/70 mt-0.5">
                          August 2026 salary direct deposit statement is now available for review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-[#E8E2F0] cursor-pointer group select-none"
                title="Go to profile"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-[#1E1035] group-hover:text-[#7B2CBF] transition-colors leading-tight">
                    {employee.name}
                  </p>
                  <p className="text-[10px] text-[#7B2CBF] font-bold uppercase tracking-wider leading-tight mt-0.5">
                    {employee.jobPosition || employee.role}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#F7F4FA] border border-[#7B2CBF]/20 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-[#7B2CBF]/30 transition-all">
                  {employee.avatarUrl ? (
                    <Image
                      src={employee.avatarUrl}
                      alt={employee.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#7B2CBF]">
                      {employee.name?.charAt(0) || 'E'}
                    </span>
                  )}
                </div>
                <ChevronDown size={14} className="text-[#1E1035]/50 group-hover:text-[#7B2CBF] transition-colors hidden sm:block" />
              </div>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white border border-[#E8E2F0] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-[#1E1035]">
                  <div className="p-3 bg-[#F7F4FA] rounded-xl mb-2 border border-[#E8E2F0]">
                    <p className="text-xs font-bold text-[#1E1035]">{employee.name}</p>
                    <p className="text-[11px] text-[#7B2CBF] font-mono mt-0.5">{employee.email}</p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#E8E2F0] text-[10px] text-[#1E1035]/70">
                      <span className="px-2 py-0.5 rounded-md bg-[#7B2CBF]/10 text-[#7B2CBF] font-bold">
                        {employee.employeeId}
                      </span>
                      <span>{employee.department}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1E1035] hover:bg-[#F7F4FA] rounded-xl transition-colors cursor-pointer"
                  >
                    <User size={15} className="text-[#7B2CBF]" />
                    <span>View & Edit My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      enterAdminMode();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#7B2CBF] hover:bg-purple-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <ShieldCheck size={15} className="text-[#7B2CBF]" />
                    <span>Access HR / Admin Suite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpenHRAssistantModal(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1E1035] hover:bg-[#F7F4FA] rounded-xl transition-colors cursor-pointer"
                  >
                    <HelpCircle size={15} className="text-[#7B2CBF]" />
                    <span>HR Handbook & Policies</span>
                  </button>

                  <div className="mt-2 pt-2 border-t border-[#E8E2F0]">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut size={15} />
                      <span>Sign Out of Dayflow</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setOpenAuthModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#1E1035] hover:bg-[#F7F4FA] border border-[#E8E2F0] rounded-xl transition-all cursor-pointer"
            >
              <LogIn size={14} className="text-[#7B2CBF]" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('signup');
                setOpenAuthModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#7B2CBF] hover:bg-[#6824A3] rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <UserPlus size={14} />
              <span>Create Account</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
