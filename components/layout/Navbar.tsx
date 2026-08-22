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
  ExternalLink,
  ShieldCheck,
  Shield,
  Layers,
} from 'lucide-react';
import Image from 'next/image';

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
    setActiveView,
    switchDemoUser,
    handleCheckIn,
    handleCheckOut,
    setOpenHRAssistantModal,
  } = useEmployee();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Live digital clock
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  return (
    <header
      id="dayflow-top-navbar"
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs"
    >
      {/* Left: Brand Logo & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm text-white">
            <svg
              className="w-5 h-5 text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                DAYFLOW
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wide">
                HRMS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Every workday, perfectly aligned.
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Live Clock & Shift Badge (Desktop) */}
      <div className="hidden md:flex items-center gap-4 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200/80 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-mono text-slate-800 font-medium">
          <Clock className="w-3.5 h-3.5 text-sky-600" />
          <span>{currentTime || '09:00:00 AM'}</span>
        </div>
        <div className="w-px h-3.5 bg-slate-300" />
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Shift Status:</span>
          {isCheckedOut ? (
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Shift Ended ({todayAttendance?.checkOut})
            </span>
          ) : isCheckedIn ? (
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active (In at {todayAttendance?.checkIn})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Not Checked In
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Punch, HR Handbook, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-2.5">
        {/* Quick Punch Header Button */}
        {!isCheckedOut && (
          <button
            type="button"
            onClick={() => (isCheckedIn ? handleCheckOut() : handleCheckIn('office'))}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs ${
              isCheckedIn
                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
        )}

        {/* HR Handbook Assistant Button */}
        <button
          type="button"
          onClick={() => setOpenHRAssistantModal(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          title="HR Policies & Handbook"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden lg:inline">HR Help</span>
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={() => setActiveView('notifications')}
          className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Switcher Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all"
          >
            <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-slate-200 ring-1 ring-slate-300">
              {employee?.avatarUrl ? (
                <Image
                  src={employee.avatarUrl}
                  alt={employee.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-xs text-slate-700">
                  {employee?.name?.charAt(0) || 'E'}
                </div>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight flex items-center gap-1">
                {employee?.name || 'Loading...'}
                <ShieldCheck className="w-3 h-3 text-sky-600" />
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {employee?.employeeId} • {employee?.department?.split(' ')[0]}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-slate-900">
              {/* Header Info */}
              <div className="p-3 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{employee?.name}</p>
                <p className="text-[11px] text-sky-700 font-mono mt-0.5">{employee?.email}</p>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600">
                  <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                    {employee?.role?.toUpperCase()}
                  </span>
                  <span>{employee?.jobPosition}</span>
                </div>
              </div>

              {/* Navigation Items */}
              <button
                type="button"
                onClick={() => {
                  setActiveView('profile');
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                View & Edit My Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenHRAssistantModal(true);
                  setIsProfileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-sky-600" />
                Company HR Handbook & FAQ
              </button>

              {/* Demo Account Switcher (For Hackathon Review) */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Demo Switcher
                </div>
                <button
                  type="button"
                  onClick={() => {
                    switchDemoUser('EMP-1001');
                    setIsProfileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                    employee?.employeeId === 'EMP-1001'
                      ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Alex Rivera (Eng)</span>
                  {employee?.employeeId === 'EMP-1001' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchDemoUser('EMP-1002');
                    setIsProfileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                    employee?.employeeId === 'EMP-1002'
                      ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Sarah Chen (Design)</span>
                  {employee?.employeeId === 'EMP-1002' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    switchDemoUser('EMP-1003');
                    setIsProfileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                    employee?.employeeId === 'EMP-1003'
                      ? 'bg-sky-50 text-sky-800 font-semibold border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Marcus Vance (DevOps)</span>
                  {employee?.employeeId === 'EMP-1003' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              </div>

              {/* Reset Session */}
              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    switchDemoUser('EMP-1001');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Reset Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
