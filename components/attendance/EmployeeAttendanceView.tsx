'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Timer,
  CalendarDays,
  TrendingUp,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AttendanceBadge } from '../ui/Badge';
import { AttendanceStatus } from '../../types/dayflowTypes';

export function EmployeeAttendanceView() {
  const {
    employee,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
  } = useEmployee();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 7, 21)); // August 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-08-21');

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  useEffect(() => {
    if (!employee) return;
    fetch(`/api/attendance?employeeId=${employee.employeeId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.records) {
          setAttendanceRecords(data.records);
        }
      })
      .catch(console.error);
  }, [employee, todayAttendance]);

  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();

  const handlePrevMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    setCalendarDate(new Date(2026, 7, 21));
    setSelectedDateStr('2026-08-21');
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const formatYMD = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const getRecordForDate = (dateStr: string) => {
    const existing = attendanceRecords.find((r) => r.date === dateStr);
    if (existing) return existing;

    const dateObj = new Date(`${dateStr}T00:00:00`);
    const dayOfWeek = dateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (isWeekend) {
      return {
        id: `weekend-${dateStr}`,
        employeeId: employee?.employeeId,
        date: dateStr,
        checkIn: null,
        checkOut: null,
        status: 'absent' as AttendanceStatus,
        isWeekend: true,
        hoursWorked: 0,
        remarks: dayOfWeek === 0 ? 'Sunday - Weekly Off' : 'Saturday - Weekend Off',
        location: 'Off-duty',
      };
    }

    if (dateStr === '2026-08-21' && todayAttendance) {
      return {
        ...todayAttendance,
        isWeekend: false,
        hoursWorked: (todayAttendance as any).hoursWorked || 8.5,
        location: 'San Francisco HQ - Desk 4B',
      };
    }

    if (dateStr < '2026-08-21') {
      return {
        id: `gen-${dateStr}`,
        employeeId: employee?.employeeId,
        date: dateStr,
        checkIn: '09:00 AM',
        checkOut: '05:30 PM',
        status: 'present' as AttendanceStatus,
        isWeekend: false,
        hoursWorked: 8.5,
        remarks: 'Standard Office Shift completed',
        location: 'San Francisco HQ - Desk 4B',
      };
    }

    return {
      id: `upcoming-${dateStr}`,
      employeeId: employee?.employeeId,
      date: dateStr,
      checkIn: null,
      checkOut: null,
      status: 'present' as AttendanceStatus,
      isWeekend: false,
      hoursWorked: 0,
      remarks: 'Scheduled Upcoming Workday',
      location: 'San Francisco HQ',
    };
  };

  // Build grid cells
  const calendarCells: any[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    const dateStr = formatYMD(y, m, d);
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === '2026-08-21',
      isSelected: dateStr === selectedDateStr,
      record: getRecordForDate(dateStr),
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatYMD(currentYear, currentMonth, d);
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === '2026-08-21',
      isSelected: dateStr === selectedDateStr,
      record: getRecordForDate(dateStr),
    });
  }

  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    const dateStr = formatYMD(y, m, d);
    calendarCells.push({
      day: d,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === '2026-08-21',
      isSelected: dateStr === selectedDateStr,
      record: getRecordForDate(dateStr),
    });
  }

  const currentMonthCells = calendarCells.filter((c) => c.isCurrentMonth);
  const monthPresentCount = currentMonthCells.filter((c) => !c.record.isWeekend && c.record.status === 'present').length;
  const monthWeekendHolidayCount = currentMonthCells.filter((c) => c.record.isWeekend).length;
  const monthLeaveCount = currentMonthCells.filter((c) => !c.record.isWeekend && (c.record.status === 'leave' || c.record.status === 'half-day')).length;

  const activeRecord = getRecordForDate(selectedDateStr);
  const selectedDateObj = new Date(`${selectedDateStr}T00:00:00`);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const monthTitle = calendarDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const currentWeekDays = [
    { day: 'Monday', date: '2026-08-17', record: getRecordForDate('2026-08-17') },
    { day: 'Tuesday', date: '2026-08-18', record: getRecordForDate('2026-08-18') },
    { day: 'Wednesday', date: '2026-08-19', record: getRecordForDate('2026-08-19') },
    { day: 'Thursday', date: '2026-08-20', record: getRecordForDate('2026-08-20') },
    { day: 'Friday (Today)', date: '2026-08-21', record: todayAttendance || getRecordForDate('2026-08-21') },
  ];

  const totalWeeklyHours = currentWeekDays.reduce((acc, curr) => acc + (curr.record?.hoursWorked || 8.5), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Banner with Quick Punch */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Workday Status Tracker
            </span>
            <span className="text-xs text-[#1E1035]/40">•</span>
            <span className="text-xs font-semibold text-[#1E1035]/60">
              Friday, August 21, 2026
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Attendance & Work Hours
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Record your daily shift check-ins, view timestamp logs, and monitor monthly attendance calendar compliance.
          </p>
        </div>

        {/* Action Punch Capsule */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E2F0] shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div>
            <span className="text-[11px] font-bold text-[#1E1035]/50 uppercase tracking-wider block">
              Current Session
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isCheckedIn
                    ? 'bg-emerald-500 animate-ping'
                    : isCheckedOut
                    ? 'bg-[#7B2CBF]'
                    : 'bg-amber-400'
                }`}
              />
              <span className="text-sm font-bold text-[#1E1035]">
                {isCheckedIn
                  ? 'Checked In (Active)'
                  : isCheckedOut
                  ? 'Checked Out (Shift Closed)'
                  : 'Pending Check-In'}
              </span>
            </div>
            <p className="text-xs text-[#1E1035]/60 mt-0.5">
              {todayAttendance?.checkIn
                ? `Check-in time: ${todayAttendance.checkIn}`
                : 'No punch logged today'}
              {todayAttendance?.checkOut ? ` | Check-out: ${todayAttendance.checkOut}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isCheckedIn && !isCheckedOut && (
              <Button
                id="attendance-checkin-btn"
                onClick={() => handleCheckIn('office')}
                leftIcon={<LogIn size={16} />}
                className="w-full sm:w-auto rounded-xl"
              >
                Check In Now
              </Button>
            )}

            {isCheckedIn && (
              <Button
                id="attendance-checkout-btn"
                variant="secondary"
                onClick={() => handleCheckOut()}
                leftIcon={<LogOut size={16} />}
                className="w-full sm:w-auto border-purple-200 hover:bg-purple-50 text-[#7B2CBF] rounded-xl"
              >
                Check Out
              </Button>
            )}

            {isCheckedOut && (
              <span className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 size={15} />
                <span>Recorded</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] shrink-0">
            <Timer size={22} />
          </div>
          <div>
            <span className="text-xs text-[#1E1035]/60 block font-semibold">
              Weekly Hours Logged
            </span>
            <p className="text-xl font-extrabold text-[#1E1035] mt-0.5">
              {totalWeeklyHours.toFixed(1)} <span className="text-xs font-medium text-[#1E1035]/50">/ 40.0 hrs</span>
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-xs text-[#1E1035]/60 block font-semibold">
              Present Days This Month
            </span>
            <p className="text-xl font-extrabold text-[#1E1035] mt-0.5">
              {monthPresentCount} <span className="text-xs font-medium text-[#1E1035]/50">days</span>
            </p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="text-xs text-[#1E1035]/60 block font-semibold">
              On-Time Punctuality Rate
            </span>
            <p className="text-xl font-extrabold text-emerald-700 mt-0.5">
              98%
            </p>
          </div>
        </Card>
      </div>

      {/* Main Timesheet / Calendar Presentation */}
      <div className="bg-white rounded-2xl border border-[#E8E2F0] shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header with Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2F0]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF]">
              <CalendarDays size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E1035]">
                {viewMode === 'daily' ? 'Monthly Attendance Calendar' : 'Weekly Attendance Matrix'}
              </h3>
              <p className="text-xs text-[#1E1035]/60">
                Verified daily logs & time-tracking for {employee?.name}
              </p>
            </div>
          </div>

          <div className="p-1 bg-[#F7F4FA] border border-[#E8E2F0] rounded-xl flex items-center">
            <button
              id="view-mode-daily"
              type="button"
              onClick={() => setViewMode('daily')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'daily'
                  ? 'bg-[#7B2CBF] text-white shadow-xs'
                  : 'text-[#1E1035]/60 hover:text-[#1E1035]'
              }`}
            >
              Daily View
            </button>
            <button
              id="view-mode-weekly"
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                viewMode === 'weekly'
                  ? 'bg-[#7B2CBF] text-white shadow-xs'
                  : 'text-[#1E1035]/60 hover:text-[#1E1035]'
              }`}
            >
              Weekly View
            </button>
          </div>
        </div>

        {/* 1. DAILY VIEW: CALENDAR */}
        {viewMode === 'daily' && (
          <div className="space-y-6">
            {/* Calendar Widget Container */}
            <div className="bg-white rounded-2xl border border-[#E8E2F0] shadow-md p-6 sm:p-8 max-w-xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <button
                  id="calendar-prev-month-btn"
                  onClick={handlePrevMonth}
                  title="Previous Month"
                  className="p-2 rounded-xl text-[#7B2CBF] hover:bg-[#F7F4FA] transition-colors cursor-pointer"
                >
                  <ChevronLeft size={22} className="stroke-[2.5]" />
                </button>

                <div className="text-center">
                  <h4 className="text-lg font-bold text-[#1E1035] tracking-tight">
                    {monthTitle}
                  </h4>
                  <button
                    onClick={handleToday}
                    className="text-[11px] font-semibold text-[#7B2CBF] hover:underline mt-0.5 inline-block cursor-pointer"
                  >
                    Jump to Today
                  </button>
                </div>

                <button
                  id="calendar-next-month-btn"
                  onClick={handleNextMonth}
                  title="Next Month"
                  className="p-2 rounded-xl text-[#7B2CBF] hover:bg-[#F7F4FA] transition-colors cursor-pointer"
                >
                  <ChevronRight size={22} className="stroke-[2.5]" />
                </button>
              </div>

              {/* Day Labels Row */}
              <div className="grid grid-cols-7 text-center gap-1 sm:gap-2 border-b border-[#E8E2F0] pb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <span
                    key={d}
                    className="text-xs font-bold text-[#7B2CBF] uppercase tracking-wider"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Day Circles Grid */}
              <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 gap-x-1 sm:gap-x-2 text-center">
                {calendarCells.map((cell, idx) => {
                  const rec = cell.record;
                  const isWeekend = rec.isWeekend;
                  const isPresent = !isWeekend && rec.status === 'present';
                  const isLeave = !isWeekend && rec.status === 'leave';
                  const isHalfDay = !isWeekend && rec.status === 'half-day';
                  const isAbsent = !isWeekend && rec.status === 'absent';

                  let circleClass = '';
                  if (!cell.isCurrentMonth) {
                    circleClass = 'text-[#1E1035]/25 hover:bg-[#F7F4FA]/50';
                  } else if (isPresent) {
                    circleClass =
                      'bg-gradient-to-br from-[#7B2CBF] to-[#9D4EDD] text-white font-bold shadow-xs hover:opacity-90';
                  } else if (isHalfDay) {
                    circleClass = 'bg-amber-500 text-white font-bold shadow-xs';
                  } else if (isLeave) {
                    circleClass = 'bg-purple-100 text-[#7B2CBF] font-bold border border-purple-200';
                  } else if (isAbsent) {
                    circleClass = 'bg-rose-500 text-white font-bold shadow-xs';
                  } else {
                    circleClass = 'text-[#1E1035] font-semibold hover:bg-[#F7F4FA]';
                  }

                  const isSelected = cell.isSelected;
                  const isToday = cell.isToday;

                  return (
                    <div key={`${cell.dateStr}-${idx}`} className="flex flex-col items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setSelectedDateStr(cell.dateStr)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm transition-all cursor-pointer relative ${circleClass} ${
                          isSelected
                            ? 'ring-3 ring-[#7B2CBF] ring-offset-2 scale-105 shadow-md z-10'
                            : ''
                        }`}
                      >
                        {cell.day}
                        {isToday && (
                          <span
                            className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                              isPresent ? 'bg-white' : 'bg-[#7B2CBF]'
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary Legend Cards */}
            <div className="max-w-xl mx-auto space-y-3">
              <div className="bg-white rounded-xl border border-[#E8E2F0] shadow-sm p-4 flex items-center justify-between hover:border-[#7B2CBF]/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#7B2CBF] to-[#9D4EDD] shadow-xs" />
                  <span className="text-sm font-bold text-[#1E1035]">Present</span>
                </div>
                <span className="bg-[#7B2CBF]/10 text-[#7B2CBF] text-xs font-bold px-3 py-1 rounded-full">
                  {monthPresentCount} Days
                </span>
              </div>

              <div className="bg-white rounded-xl border border-[#E8E2F0] shadow-sm p-4 flex items-center justify-between hover:border-[#7B2CBF]/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#F7F4FA] border border-gray-300" />
                  <span className="text-sm font-bold text-[#1E1035]">Holiday / Weekend</span>
                </div>
                <span className="bg-[#F7F4FA] text-[#1E1035]/70 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {monthWeekendHolidayCount} Days
                </span>
              </div>
            </div>

            {/* Detailed Selected Day Inspection Box */}
            <div className="bg-[#F7F4FA]/70 rounded-2xl border border-[#E8E2F0] p-6 sm:p-7 max-w-2xl mx-auto space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2F0]">
                <div className="flex items-center gap-2.5">
                  <Calendar className="text-[#7B2CBF]" size={18} />
                  <h4 className="text-base font-bold text-[#1E1035]">
                    {formattedSelectedDate}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <AttendanceBadge status={activeRecord.status || 'present'} />
                  {selectedDateStr === '2026-08-21' && (
                    <span className="text-[11px] font-bold text-[#7B2CBF] bg-[#7B2CBF]/10 px-2 py-0.5 rounded-md">
                      Today
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-[#E8E2F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#1E1035]/50 uppercase tracking-wider block">
                    Check-In
                  </span>
                  <div className="flex items-center gap-1.5">
                    <LogIn size={14} className="text-emerald-600" />
                    <span className="font-mono text-sm font-bold text-[#1E1035]">
                      {activeRecord.checkIn || '—'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8E2F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#1E1035]/50 uppercase tracking-wider block">
                    Check-Out
                  </span>
                  <div className="flex items-center gap-1.5">
                    <LogOut size={14} className="text-[#7B2CBF]" />
                    <span className="font-mono text-sm font-bold text-[#1E1035]">
                      {activeRecord.checkOut || (activeRecord.checkIn ? 'In Progress' : '—')}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8E2F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#1E1035]/50 uppercase tracking-wider block">
                    Hours Worked
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Timer size={14} className="text-[#7B2CBF]" />
                    <span className="font-mono text-sm font-bold text-[#1E1035]">
                      {activeRecord.hoursWorked > 0 ? `${activeRecord.hoursWorked} hrs` : '0.0 hrs'}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8E2F0] shadow-xs space-y-1">
                  <span className="text-[11px] font-bold text-[#1E1035]/50 uppercase tracking-wider block">
                    Attendance Status
                  </span>
                  <p className="text-xs font-bold text-[#1E1035] capitalize truncate mt-0.5">
                    {activeRecord.isWeekend ? 'Weekend / Off' : activeRecord.status}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#E8E2F0] shadow-xs space-y-2 text-xs">
                <div className="flex items-start gap-2 text-[#1E1035]/80">
                  <MapPin size={15} className="text-[#7B2CBF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E1035]">Location: </span>
                    <span>{activeRecord.location || 'San Francisco HQ — Workstation 4B'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-[#1E1035]/80 pt-1 border-t border-[#E8E2F0]">
                  <FileText size={15} className="text-[#7B2CBF] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E1035]">Remarks: </span>
                    <span className="italic">"{activeRecord.remarks || 'Standard verified workday shift.'}"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. WEEKLY VIEW */}
        {viewMode === 'weekly' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-[#F7F4FA] border border-[#E8E2F0] rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1E1035]">
                Current Week: Aug 17, 2026 – Aug 21, 2026
              </span>
              <span className="font-bold text-[#7B2CBF]">
                Total: {totalWeeklyHours.toFixed(1)} / 40.0 hrs
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {currentWeekDays.map((item) => (
                <div
                  key={item.day}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                    item.record?.status === 'present'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-[#E8E2F0]'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-[#1E1035] block">
                      {item.day}
                    </span>
                    <span className="text-[11px] text-[#1E1035]/50 block">
                      {item.date}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-[11px] text-[#1E1035]/70">
                      <span>In:</span>
                      <span className="font-mono font-medium">{item.record?.checkIn || '09:00 AM'}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#1E1035]/70">
                      <span>Out:</span>
                      <span className="font-mono font-medium">{item.record?.checkOut || '05:30 PM'}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xs pt-1 border-t border-black/5">
                      <span>Hours:</span>
                      <span>{item.record?.hoursWorked || 8.5} hrs</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <AttendanceBadge status={item.record?.status || 'present'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
