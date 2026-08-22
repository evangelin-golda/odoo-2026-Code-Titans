'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  Clock,
  Play,
  Square,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter,
  Download,
  Laptop,
  Building,
  History,
  LayoutGrid,
  List,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { AttendanceRecord, WorkMode } from '@/types/hrms';
import { AttendanceCalendar } from './AttendanceCalendar';

export function EmployeeAttendanceView() {
  const {
    employee,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
  } = useEmployee();

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WorkMode>('office');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Selected date details state (rendered on right-side panel)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (!employee) return;
    fetch(`/api/attendance?employeeId=${employee.employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.records) {
          setAttendanceRecords(data.records);
        }
      })
      .catch(console.error);
  }, [employee, todayAttendance]);

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  // Live Timer for active shift
  useEffect(() => {
    if (!isCheckedIn || isCheckedOut || !todayAttendance?.checkIn) {
      return;
    }

    const updateTimer = () => {
      const parts = todayAttendance.checkIn.split(':');
      if (parts.length < 2) return;
      const now = new Date();
      const inDate = new Date();
      inDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);

      const diff = Math.max(0, now.getTime() - inDate.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, isCheckedOut, todayAttendance]);

  // Date selection handler: updates the right-side detail panel
  const handleSelectDate = (date: string, record: AttendanceRecord | null) => {
    setSelectedDate(date);
    setSelectedRecord(record);
    if (viewMode === 'list') {
      setViewMode('calendar');
    }
  };

  // Filtered records for list view
  const filteredRecords = attendanceRecords.filter(rec => {
    if (filterStatus === 'all') return true;
    return rec.status.toLowerCase() === filterStatus.toLowerCase();
  });

  // Calculate statistics
  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const totalHours = attendanceRecords.reduce((acc, r) => acc + (r.durationMinutes || 0) / 60, 0);
  const avgHours = totalDays > 0 ? (totalHours / totalDays).toFixed(1) : '8.5';

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div id="dayflow-employee-attendance-view" className="space-y-6">
      {/* 1. Header & Live Clock Action Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
                Time & Attendance Tracker
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Live Sync
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Daily Attendance & Shift Calendar
            </h1>
            <p className="text-xs text-slate-500">
              Standard Shift: 9:00 AM – 6:00 PM (45 hrs weekly). Log punches or inspect your monthly attendance timeline.
            </p>
          </div>

          {/* Action Box */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {/* Work Location Selector */}
            {!isCheckedIn && (
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedLocation('office')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedLocation === 'office'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Office
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLocation('remote')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedLocation === 'remote'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Remote (WFH)
                </button>
              </div>
            )}

            {/* Check in / Check out Button */}
            {!isCheckedOut ? (
              isCheckedIn ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Active Shift Duration
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-600">
                      {elapsedTime}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCheckOut()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    Check Out Now
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckIn(selectedLocation)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Check In for Work
                </button>
              )
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Shift Completed Today ({todayAttendance?.checkOut})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Attendance Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Days Logged</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalDays}</div>
          <p className="text-[11px] text-slate-500 mt-1">This billing cycle</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">On-Time Check-Ins</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{presentDays}</div>
          <p className="text-[11px] text-slate-500 mt-1">Arrival before 09:15 AM</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Late Arrivals</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{lateDays}</div>
          <p className="text-[11px] text-slate-500 mt-1">Within grace policy limits</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Avg Daily Hours</span>
          <div className="text-2xl font-bold text-sky-600 mt-1">{avgHours}h</div>
          <p className="text-[11px] text-slate-500 mt-1">Productive active duration</p>
        </div>
      </div>

      {/* 3. Main Attendance Log Section (Calendar & List Views) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Attendance Timeline & Logs
              </h2>
              <p className="text-xs text-slate-500">
                Click any specific date on the calendar to view its check-in, check-out, and duration breakdown
              </p>
            </div>
          </div>

          {/* Controls: View Mode & Filter */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List View</span>
              </button>
            </div>

            {/* Status Filter (Active in List View) */}
            {viewMode === 'list' && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="py-1.5 px-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none text-xs font-medium cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="present">Present (On-Time)</option>
                  <option value="late">Late Arrival</option>
                  <option value="half_day">Half Day</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* View Switch Content */}
        {viewMode === 'calendar' ? (
          /* Calendar View Component */
          <AttendanceCalendar
            records={attendanceRecords}
            onSelectDate={handleSelectDate}
            selectedDate={selectedDate || undefined}
          />
        ) : (
          /* List / Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Work Duration</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record: AttendanceRecord) => (
                  <tr
                    key={record.id}
                    onClick={() => handleSelectDate(record.date, record)}
                    className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-900 group-hover:text-sky-700">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {record.checkIn}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {record.checkOut || (record.date === todayStr ? 'In Progress' : '—')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {record.durationMinutes
                        ? `${(record.durationMinutes / 60).toFixed(1)} hrs`
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        {record.workMode === 'office' ? (
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <Laptop className="w-3.5 h-3.5 text-sky-600" />
                        )}
                        {record.workMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          record.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : record.status === 'late'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : record.status === 'half_day'
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : record.status === 'on_leave'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {record.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[11px] text-sky-600 font-semibold group-hover:underline">
                        Inspect Day &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
