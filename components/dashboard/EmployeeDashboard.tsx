'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  Clock,
  CalendarDays,
  CreditCard,
  User,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Sparkles,
  ChevronRight,
  Calendar,
  Building2,
  MapPin,
  Laptop,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Flame,
  FileText,
  HelpCircle,
  Users,
  Compass,
  Copy,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import { WorkMode } from '@/types/hrms';

export function EmployeeDashboard() {
  const {
    employee,
    todayAttendance,
    setActiveView,
    handleCheckIn,
    handleCheckOut,
    setOpenApplyLeaveModal,
    setOpenHRAssistantModal,
  } = useEmployee();

  const [leaveStats, setLeaveStats] = useState({ available: 18, pending: 1, used: 4 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [salarySummary, setSalarySummary] = useState<any>(null);
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>('office');
  const [copiedId, setCopiedId] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [elapsedDuration, setElapsedDuration] = useState<string>('00:00:00');

  // Real-time clock for dashboard
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

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  // Elapsed shift duration
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

  useEffect(() => {
    if (!employee) return;

    // Fetch leave summary
    fetch(`/api/leave?employeeId=${employee.employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.balances) {
          const annual = data.balances.find((b: any) => b.type === 'annual');
          if (annual) {
            setLeaveStats({
              available: annual.available,
              pending: data.summary.pendingCount,
              used: annual.used,
            });
          }
          setRecentRequests(data.requests.slice(0, 3));
        }
      })
      .catch(console.error);

    // Fetch salary summary
    fetch(`/api/salary?employeeId=${employee.employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.salaryStructure) {
          setSalarySummary(data.salaryStructure);
        }
      })
      .catch(console.error);
  }, [employee]);

  const handleCopyEmployeeId = () => {
    if (!employee?.employeeId) return;
    navigator.clipboard.writeText(employee.employeeId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Week schedule strip mock (Mon-Fri)
  const currentWeekDays = [
    { day: 'Mon', date: 'Aug 17', status: 'present', hours: '8.4h', mode: 'office' },
    { day: 'Tue', date: 'Aug 18', status: 'present', hours: '8.6h', mode: 'remote' },
    { day: 'Wed', date: 'Aug 19', status: 'present', hours: '8.2h', mode: 'office' },
    { day: 'Thu', date: 'Aug 20', status: 'present', hours: '8.5h', mode: 'office' },
    {
      day: 'Fri',
      date: 'Aug 21',
      status: isCheckedOut ? 'present' : isCheckedIn ? 'active' : 'pending',
      hours: isCheckedOut ? '8.0h' : isCheckedIn ? elapsedDuration : 'Shift scheduled',
      mode: isCheckedIn ? (todayAttendance?.workMode || 'office') : 'office',
      isToday: true,
    },
  ];

  // Team colleagues in same department
  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Lead UI/UX Designer',
      status: 'active',
      location: 'In Office (Floor 4)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'DevOps Engineer',
      status: 'remote',
      location: 'Remote (Seattle, WA)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'David Sterling',
      role: 'VP of Engineering',
      status: 'active',
      location: 'In Office (Executive Suite)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Sharma',
      role: 'Senior QA Specialist',
      status: 'leave',
      location: 'On Paid Leave (Returns Mon)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // Upcoming holidays
  const upcomingHolidays = [
    { name: 'Labor Day', date: 'Sep 7, 2026', type: 'Public Holiday', inDays: 'in 16 days' },
    { name: 'Dayflow Annual Hackathon', date: 'Sep 25, 2026', type: 'Company Event', inDays: 'in 34 days' },
    { name: 'Veterans Day', date: 'Nov 11, 2026', type: 'Public Holiday', inDays: 'in 81 days' },
  ];

  return (
    <div id="dayflow-employee-dashboard" className="space-y-6">
      {/* 1. Header & Live Shift Clock Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xs p-6 md:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-100/60 via-teal-50/30 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Employee Welcome & Identity */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-sky-500/30 shadow-xs shrink-0">
              {employee?.avatarUrl ? (
                <Image
                  src={employee.avatarUrl}
                  alt={employee.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-sky-700 bg-sky-50">
                  {employee?.name?.charAt(0) || 'E'}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmployeeId}
                  title="Click to copy Employee ID"
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors"
                >
                  <span>{employee?.employeeId}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  {employee?.department}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Shift
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Good day, {employee?.name?.split(' ')[0] || 'Employee'}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {currentDateFormatted} • Standard Shift 09:00 AM – 06:00 PM
              </p>
            </div>
          </div>

          {/* Real-time Shift Punch Card Widget */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Live Shift Clock</span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                {currentTime || '09:00:00 AM'}
              </span>
            </div>

            {/* Work Mode Toggle (Before Punching In) */}
            {!isCheckedIn && !isCheckedOut && (
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 text-[11px] font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedWorkMode('office')}
                  className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
                    selectedWorkMode === 'office'
                      ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🏢 Office
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWorkMode('remote')}
                  className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
                    selectedWorkMode === 'remote'
                      ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🏠 Remote
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedWorkMode('hybrid')}
                  className={`flex-1 py-1 px-2 rounded-lg transition-all text-center ${
                    selectedWorkMode === 'hybrid'
                      ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  💼 Hybrid
                </button>
              </div>
            )}

            {/* Punch In / Out Actions */}
            <div>
              {!isCheckedOut ? (
                isCheckedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">In at {todayAttendance?.checkIn}</span>
                      <span className="font-mono font-bold text-emerald-600">{elapsedDuration}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCheckOut()}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
                    >
                      <Square className="w-3.5 h-3.5 fill-white" />
                      Check Out (End Shift)
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCheckIn(selectedWorkMode)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-98"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Check In ({selectedWorkMode === 'office' ? 'Office' : selectedWorkMode === 'remote' ? 'Remote' : 'Hybrid'})
                  </button>
                )
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Workday Finished ({todayAttendance?.checkOut})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Attendance Strip Visualizer */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              This Week&apos;s Schedule & Logs
            </span>
            <span className="text-[11px] text-slate-500">Target: 40 hrs/week</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {currentWeekDays.map(item => (
              <div
                key={item.day}
                className={`p-3 rounded-xl border transition-all ${
                  item.isToday
                    ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-400/30'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.day}</span>
                  <span className="text-[10px] text-slate-500">{item.date}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-900">
                    {item.hours}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'present'
                        ? 'bg-emerald-500'
                        : item.status === 'active'
                        ? 'bg-sky-500 animate-ping'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>
                <div className="mt-1 text-[10px] text-slate-500 capitalize">
                  {item.isToday && isCheckedIn ? 'Currently Active' : item.mode}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Summary Grid (4 Elevated Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Attendance */}
        <div
          onClick={() => setActiveView('attendance')}
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs hover:border-sky-300 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Shift Attendance
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-100 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {isCheckedOut
                ? 'Checked Out'
                : isCheckedIn
                ? `In at ${todayAttendance?.checkIn}`
                : 'Not Checked In'}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCheckedOut
                    ? 'bg-slate-400'
                    : isCheckedIn
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-amber-400'
                }`}
              />
              {isCheckedOut
                ? `Logged ${((todayAttendance?.durationMinutes || 0) / 60).toFixed(1)} hrs today`
                : isCheckedIn
                ? `Shift mode: ${todayAttendance?.workMode || 'Office'}`
                : 'Shift starts at 9:00 AM'}
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>View Punch History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Leave Balance */}
        <div
          onClick={() => setActiveView('leave')}
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Time Off Quotas
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {leaveStats.available}{' '}
              <span className="text-xs font-normal text-slate-500">Days Remaining</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {leaveStats.used} days used • {leaveStats.pending} pending approval
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Apply Time Off</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Monthly Net Salary */}
        <div
          onClick={() => setActiveView('salary')}
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs hover:border-violet-300 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Net Monthly Earnings
            </span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-100 transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              ${salarySummary ? salarySummary.netMonthly.toLocaleString() : '16,720'}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Next payout on Aug 31 • Direct Deposit
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-violet-600 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>View Salary Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Personal Punctuality & Streak */}
        <div
          onClick={() => setActiveView('reports')}
          className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Punctuality Rate
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900 flex items-center gap-1.5">
              <span>96.4%</span>
              <span className="text-xs font-normal text-emerald-600">▲ Top 5%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>14-day on-time streak</span>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-medium group-hover:translate-x-0.5 transition-transform">
            <span>Personal Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 3. Main Split View: Left (Quick Actions + Recent Leaves + Team Today) | Right (Employee ID + Holidays + HR FAQ) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Navigation Bar */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Quick Employee Self-Service Actions
              </h2>
              <span className="text-[11px] text-slate-400">1-click triggers</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => (!isCheckedIn ? handleCheckIn(selectedWorkMode) : handleCheckOut())}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 transition-all group active:scale-95 text-center"
              >
                <div className="p-2 rounded-xl bg-white shadow-2xs text-sky-600 group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold mt-2">
                  {isCheckedIn ? 'Check Out' : 'Check In'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {isCheckedIn ? 'End Shift' : 'Start Shift'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOpenApplyLeaveModal(true)}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 transition-all group active:scale-95 text-center"
              >
                <div className="p-2 rounded-xl bg-white shadow-2xs text-emerald-600 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold mt-2">Apply Leave</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Request Time Off</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('salary')}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 transition-all group active:scale-95 text-center"
              >
                <div className="p-2 rounded-xl bg-white shadow-2xs text-violet-600 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold mt-2">View Payslip</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Salary & Stubs</span>
              </button>

              <button
                type="button"
                onClick={() => setOpenHRAssistantModal(true)}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-800 transition-all group active:scale-95 text-center"
              >
                <div className="p-2 rounded-xl bg-white shadow-2xs text-amber-600 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold mt-2">Ask HR Policy</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Handbook FAQ</span>
              </button>
            </div>
          </div>

          {/* Recent Leave Requests List with Multi-step Tracker */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recent Leave Requests & Approval Track
                </h2>
                <p className="text-xs text-slate-500">
                  Track manager review and automated status updates
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView('leave')}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <span>All Requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No leave requests submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRequests.map(req => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 uppercase">
                          {req.leaveType} Leave
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          ({req.daysCount} {req.daysCount === 1 ? 'day' : 'days'})
                        </span>
                        <span className="text-xs text-slate-400">• Applied {req.appliedDate}</span>
                      </div>

                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize w-fit ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center justify-between">
                      <span>Period: <strong className="text-slate-800">{req.startDate}</strong> to <strong className="text-slate-800">{req.endDate}</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                      &ldquo;{req.reason}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Department Team Overview ("Who's Working Today") */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {employee?.department || 'Engineering'} Colleagues Today
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">4 Active Members</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teamMembers.map(tm => (
                <div
                  key={tm.name}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center gap-3"
                >
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <Image
                      src={tm.avatar}
                      alt={tm.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{tm.name}</p>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          tm.status === 'active'
                            ? 'bg-emerald-500'
                            : tm.status === 'remote'
                            ? 'bg-sky-500'
                            : 'bg-amber-400'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{tm.role}</p>
                    <p className="text-[10px] text-slate-400 truncate">{tm.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Employee Identity + Company Holidays + HR Policy Box */}
        <div className="space-y-6">
          {/* Employee Virtual Identity & Employment Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Official Employment Card
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  Position
                </span>
                <span className="font-semibold text-slate-900 text-right">
                  {employee?.jobPosition}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Department
                </span>
                <span className="font-semibold text-slate-900">{employee?.department}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Reporting Manager
                </span>
                <span className="font-semibold text-slate-900 text-right">
                  {employee?.managerName?.split('(')[0] || 'David Sterling'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Primary Site
                </span>
                <span className="font-semibold text-slate-900">{employee?.workLocation}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined On
                </span>
                <span className="font-semibold text-slate-900">{employee?.joiningDate}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className="w-full py-2 px-3 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors text-center block"
            >
              View Full Profile & Credentials →
            </button>
          </div>

          {/* Upcoming Company Holidays Widget */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Upcoming Holidays
                </h2>
              </div>
              <span className="text-[11px] text-slate-400">2026 Calendar</span>
            </div>

            <div className="space-y-2.5">
              {upcomingHolidays.map(hol => (
                <div
                  key={hol.name}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{hol.name}</p>
                    <p className="text-[11px] text-slate-500">{hol.date} • {hol.type}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {hol.inDays}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HR Assistant Policy Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-sky-50 via-teal-50/40 to-white border border-sky-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-sky-600 text-white shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-sky-950 uppercase tracking-wider">
                HR Policy & Handbook
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Have questions about leave rules, insurance coverage, or reimbursement limits?
            </p>

            <button
              type="button"
              onClick={() => setOpenHRAssistantModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-xs active:scale-98"
            >
              <span>Ask Policy Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
