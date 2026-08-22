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
} from 'lucide-react';
import { AttendanceRecord, WorkMode } from '@/types/hrms';

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

  // Filtered records
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

  return (
    <div id="dayflow-employee-attendance-view" className="space-y-6">
      {/* 1. Header & Live Clock Action Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Time & Attendance Tracker
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Daily Attendance & Shift Clock
            </h1>
            <p className="text-xs text-slate-500">
              Standard Shift: 9:00 AM – 6:00 PM (45 hrs weekly). Log your check-ins and check-outs.
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
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
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
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    Check Out Now
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCheckIn(selectedLocation)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
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

      {/* 3. Detailed Attendance History Log Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Attendance History Log
            </h2>
          </div>

          {/* Filter Status Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Records</option>
              <option value="present">Present (On-Time)</option>
              <option value="late">Late Arrival</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check In</th>
                <th className="py-3 px-4">Check Out</th>
                <th className="py-3 px-4">Work Duration</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record: AttendanceRecord) => (
                <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-900">
                    {record.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {record.checkIn}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {record.checkOut}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {record.durationMinutes
                      ? `${(record.durationMinutes / 60).toFixed(1)} hrs`
                      : '-'}
                  </td>
                  <td className="py-3.5 px-4 capitalize text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      {record.workMode === 'office' ? (
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
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
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
