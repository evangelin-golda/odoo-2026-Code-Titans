'use client';

import React, { useState, useMemo } from 'react';
import { AttendanceRecord, WorkMode } from '@/types/hrms';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Building,
  CalendarClock,
  Sparkles,
  ArrowRight,
  Filter,
  Info,
  CalendarDays,
  Flame,
  Award,
  FileText,
  ShieldCheck,
  Coffee,
  Check,
  Send,
} from 'lucide-react';

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  onSelectDate: (date: string, record: AttendanceRecord | null) => void;
  selectedDate?: string;
}

// Statutory public holidays
const HOLIDAYS_2026: Record<string, string> = {
  '2026-01-01': "New Year's Day",
  '2026-01-26': 'Republic Day',
  '2026-05-01': 'International Labor Day',
  '2026-07-04': 'Independence Day (US)',
  '2026-08-15': 'Independence Day',
  '2026-10-02': 'Gandhi Jayanti',
  '2026-11-26': 'Thanksgiving Day',
  '2026-12-25': 'Christmas Day',
};

export function AttendanceCalendar({
  records,
  onSelectDate,
  selectedDate,
}: AttendanceCalendarProps) {
  // Current calendar month/year
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');

  // Inline regularization state inside the right panel
  const [isRegularizing, setIsRegularizing] = useState(false);
  const [regularizeReason, setRegularizeReason] = useState('');
  const [regularizeSuccess, setRegularizeSuccess] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Create lookup map of records by YYYY-MM-DD
  const recordMap = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    for (const r of records) {
      map.set(r.date, r);
    }
    return map;
  }, [records]);

  // Today string YYYY-MM-DD
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  // Currently active selected date (defaults to selectedDate or today)
  const activeDate = selectedDate || todayStr;
  const activeRecord = recordMap.get(activeDate) || null;

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(todayStr, recordMap.get(todayStr) || null);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(year, parseInt(e.target.value, 10), 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value, 10), month, 1));
  };

  // Month stats calculation
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthRecords = records.filter(r => r.date.startsWith(currentMonthPrefix));
  const presentCount = monthRecords.filter(r => r.status === 'present').length;
  const lateCount = monthRecords.filter(r => r.status === 'late').length;
  const leaveCount = monthRecords.filter(r => r.status === 'on_leave').length;
  const halfDayCount = monthRecords.filter(r => r.status === 'half_day').length;
  const remoteCount = monthRecords.filter(r => r.workMode === 'remote').length;
  const totalMins = monthRecords.reduce((acc, r) => acc + (r.durationMinutes || 0), 0);
  const totalHours = (totalMins / 60).toFixed(1);

  // Active date parsed for inspector card
  const activeDateObj = new Date(activeDate + 'T00:00:00');
  const activeFormattedDate = !isNaN(activeDateObj.getTime())
    ? activeDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : activeDate;
  const activeDayOfWeek = !isNaN(activeDateObj.getTime()) ? activeDateObj.getDay() : -1;
  const activeIsWeekend = activeDayOfWeek === 0 || activeDayOfWeek === 6;
  const activeHoliday = HOLIDAYS_2026[activeDate];

  // Duration formatting helper
  const formatDuration = (mins?: number) => {
    if (!mins) return '0 hrs 0 mins';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} hr${h !== 1 ? 's' : ''} ${m} min${m !== 1 ? 's' : ''}`;
  };

  // Regularize submit handler
  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regularizeReason.trim()) return;
    setRegularizeSuccess(true);
    setTimeout(() => {
      setIsRegularizing(false);
      setRegularizeSuccess(false);
      setRegularizeReason('');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Month Header & Filter Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Navigation & Month/Year Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1 text-xs font-bold rounded-lg text-slate-800 hover:text-sky-700 hover:bg-sky-50 transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={handleMonthChange}
              className="py-1.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm shadow-2xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
            >
              {monthNames.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={handleYearChange}
              className="py-1.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm shadow-2xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-white py-1 px-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="present">🟢 Present Only</option>
              <option value="late">🟠 Late Arrivals</option>
              <option value="half_day">🔵 Half Days</option>
              <option value="on_leave">🟣 Approved Leaves</option>
            </select>
          </div>

          {/* Work Mode Filter */}
          <div className="flex items-center gap-1.5 bg-white py-1 px-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 shadow-2xs">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={modeFilter}
              onChange={e => setModeFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="office">🏢 Office HQ</option>
              <option value="remote">💻 Remote (WFH)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Monthly Summary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Present Days
          </span>
          <div className="text-lg font-bold text-emerald-600 mt-0.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{presentCount} Days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Late Arrivals
          </span>
          <div className="text-lg font-bold text-amber-600 mt-0.5 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            <span>{lateCount} Days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Half Days
          </span>
          <div className="text-lg font-bold text-sky-600 mt-0.5 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{halfDayCount} Days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Approved Leaves
          </span>
          <div className="text-lg font-bold text-purple-600 mt-0.5 flex items-center gap-1.5">
            <CalendarClock className="w-4 h-4" />
            <span>{leaveCount} Days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Remote WFH
          </span>
          <div className="text-lg font-bold text-indigo-600 mt-0.5 flex items-center gap-1.5">
            <Laptop className="w-4 h-4" />
            <span>{remoteCount} Days</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Logged Hours
          </span>
          <div className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>{totalHours} hrs</span>
          </div>
        </div>
      </div>

      {/* 3. Main Calendar Layout: Left Clean Calendar Grid + Right Detail Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Clean, Minimalist Monthly Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
            {/* Weekday Header Row */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 pb-2 mb-1 border-b border-slate-100">
              {weekdayNames.map((day, idx) => (
                <div
                  key={day}
                  className={`${idx === 0 || idx === 6 ? 'text-slate-400' : 'text-slate-700'}`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Clean Month Day Cells Grid (No crowded mini-text, only clean presence circles) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {/* Empty offset before month starts */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12 sm:h-14 rounded-xl" />
              ))}

              {/* Days in current month */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                  dayNum
                ).padStart(2, '0')}`;
                const record = recordMap.get(dateStr) || null;
                const dayOfWeek = (firstDayIndex + idx) % 7;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === activeDate;
                const holidayName = HOLIDAYS_2026[dateStr];

                // Filter check
                let isFilteredOut = false;
                if (statusFilter !== 'all') {
                  if (!record || record.status !== statusFilter) isFilteredOut = true;
                }
                if (modeFilter !== 'all') {
                  if (!record || record.workMode !== modeFilter) isFilteredOut = true;
                }

                // Presence check
                const isPresent = record?.status === 'present';
                const isLate = record?.status === 'late';
                const isHalfDay = record?.status === 'half_day';
                const isLeave = record?.status === 'on_leave';

                return (
                  <div
                    key={dateStr}
                    onClick={() => {
                      onSelectDate(dateStr, record);
                      setIsRegularizing(false);
                    }}
                    className={`h-12 sm:h-14 flex flex-col items-center justify-center transition-all cursor-pointer relative select-none rounded-xl ${
                      isFilteredOut ? 'opacity-20 grayscale' : ''
                    } ${
                      isSelected
                        ? 'bg-sky-50 ring-2 ring-sky-500 shadow-2xs z-10'
                        : isToday
                        ? 'bg-sky-50/50 ring-1 ring-sky-300'
                        : isWeekend
                        ? 'bg-slate-50/60 hover:bg-slate-100/80 text-slate-400'
                        : 'bg-white hover:bg-slate-50/90 hover:shadow-2xs'
                    }`}
                  >
                    {/* Clean Presence Circle & Day Number */}
                    <div className="relative flex items-center justify-center">
                      <span
                        className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white ring-2 ring-sky-400 scale-105 shadow-xs'
                            : isToday && !isPresent && !isLate && !isHalfDay && !isLeave
                            ? 'bg-sky-600 text-white shadow-xs'
                            : isPresent
                            ? 'bg-emerald-500 text-white shadow-2xs'
                            : isLate
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : isHalfDay
                            ? 'bg-sky-500 text-white shadow-2xs'
                            : isLeave
                            ? 'bg-purple-500 text-white shadow-2xs'
                            : isWeekend
                            ? 'text-slate-400'
                            : 'text-slate-700'
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Small holiday indicator dot */}
                      {holidayName && (
                        <span
                          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white"
                          title={`Holiday: ${holidayName}`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600">
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
              Presence Circles:
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Late Arrival</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-500" />
                <span>Half Day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                <span>Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                <span>Weekend</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Date Detailed Inspector (Everything shown cleanly on the right side) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="sticky top-6 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            {/* Header: Date title */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Day Details
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {activeFormattedDate}
                  </h3>
                </div>
              </div>

              {activeDate === todayStr && (
                <span className="px-2 py-0.5 rounded-md bg-sky-500 text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Today
                </span>
              )}
            </div>

            {/* Holiday notice if applicable */}
            {activeHoliday && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold">Company Holiday:</span> {activeHoliday}
                </div>
              </div>
            )}

            {/* Status & Work Location Tag */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-semibold">Attendance Status:</span>
                {activeRecord ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold capitalize ${
                      activeRecord.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeRecord.status === 'late'
                        ? 'bg-amber-100 text-amber-800'
                        : activeRecord.status === 'half_day'
                        ? 'bg-sky-100 text-sky-800'
                        : activeRecord.status === 'on_leave'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {activeRecord.status.replace('_', ' ')}
                  </span>
                ) : activeIsWeekend ? (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-200 text-slate-700">
                    Weekend Non-Working
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-200 text-slate-700">
                    No Record
                  </span>
                )}
              </div>

              {activeRecord && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-semibold">Work Location:</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-800 capitalize">
                    {activeRecord.workMode === 'remote' ? (
                      <>
                        <Laptop className="w-3.5 h-3.5 text-sky-600" /> Remote (WFH)
                      </>
                    ) : (
                      <>
                        <Building className="w-3.5 h-3.5 text-slate-500" /> Office HQ
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Check-In / Check-Out Punch Details */}
            {activeRecord ? (
              <div className="space-y-3">
                {/* Punch Timestamps */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Check-In
                    </span>
                    <div className="text-sm font-mono font-bold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>{activeRecord.checkIn || '—'}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeRecord.isOnTime ? (
                        <span className="text-emerald-600 font-medium">✓ On-Time Arrival</span>
                      ) : (
                        <span className="text-amber-600 font-medium">⚠ Grace Applied</span>
                      )}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Check-Out
                    </span>
                    <div className="text-sm font-mono font-bold text-slate-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>
                        {activeRecord.checkOut || (activeDate === todayStr ? 'In Progress' : '—')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeRecord.checkOut ? 'Shift Concluded' : 'Active Session'}
                    </span>
                  </div>
                </div>

                {/* Duration Progress Meter */}
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sky-950">Shift Total Duration:</span>
                    <span className="font-mono font-bold text-sky-900">
                      {activeRecord.durationMinutes
                        ? `${(activeRecord.durationMinutes / 60).toFixed(1)} hrs`
                        : '0.0 hrs'}
                    </span>
                  </div>

                  {/* Progress bar towards 8.5h quota */}
                  <div className="w-full h-2 rounded-full bg-sky-200/80 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(((activeRecord.durationMinutes || 0) / 510) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-sky-700 font-medium">
                    <span>Standard: 8.5 hrs/day</span>
                    <span>
                      {Math.min(
                        100,
                        Math.round(((activeRecord.durationMinutes || 0) / 510) * 100)
                      )}
                      % completed
                    </span>
                  </div>
                </div>

                {/* Visual Shift Timeline */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Day Timeline
                  </span>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>In: {activeRecord.checkIn || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Coffee className="w-3 h-3" />
                      <span>1h Lunch</span>
                    </div>
                    <div className="flex items-center gap-1 text-rose-700 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Out: {activeRecord.checkOut || (activeDate === todayStr ? 'Active' : '—')}</span>
                    </div>
                  </div>
                </div>

                {/* Shift Notes */}
                {activeRecord.notes && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> Shift Notes
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {activeRecord.notes}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* No punch placeholder */
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  {activeIsWeekend ? 'Weekend Non-Working Day' : 'No Check-In Recorded'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {activeIsWeekend
                    ? 'Standard weekly off. Shift punches are not required.'
                    : 'No attendance punch was logged for this date.'}
                </p>
              </div>
            )}

            {/* Inline Regularization Request Section */}
            {!activeIsWeekend && !activeHoliday && (
              <div className="pt-2 border-t border-slate-100">
                {!isRegularizing ? (
                  <button
                    type="button"
                    onClick={() => setIsRegularizing(true)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>Request Attendance Regularization</span>
                  </button>
                ) : regularizeSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Regularization request submitted to manager!</span>
                  </div>
                ) : (
                  <form onSubmit={handleRegularizeSubmit} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      Attendance Regularization for {activeFormattedDate}
                    </span>
                    <textarea
                      rows={2}
                      value={regularizeReason}
                      onChange={e => setRegularizeReason(e.target.value)}
                      placeholder="Enter reason for missing or late punch..."
                      className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsRegularizing(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Standard Shift Policy Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-semibold text-slate-800">Policy:</span> Core shift hours are 09:00 AM – 06:00 PM with a 15-minute grace window.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
