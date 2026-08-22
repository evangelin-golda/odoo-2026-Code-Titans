'use client';

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Search,
  Filter,
  Users,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Download,
  Building,
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { AttendanceStatus } from '../../types/dayflowTypes';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Avatar } from '../ui/Avatar';
import { AttendanceBadge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

export const HRAttendanceManagement: React.FC = () => {
  const { employees, attendanceRecords } = useHRMS();

  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState('2026-08-21');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Filter daily records
  const dailyRecords = attendanceRecords.filter((rec) => {
    const matchesDate = rec.date === selectedDate;
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || rec.status === statusFilter;
    const matchesDept =
      departmentFilter === 'all' || rec.department === departmentFilter;

    return matchesDate && matchesSearch && matchesStatus && matchesDept;
  });

  const departments = Array.from(new Set(employees.map((e) => e.jobDetails.department)));

  // Compute daily totals
  const allToday = attendanceRecords.filter((r) => r.date === selectedDate);
  const presentCount = allToday.filter((r) => r.status === 'present').length;
  const absentCount = allToday.filter((r) => r.status === 'absent').length;
  const halfDayCount = allToday.filter((r) => r.status === 'half-day').length;
  const leaveCount = allToday.filter((r) => r.status === 'leave').length;

  // Weekly matrix date range: Mon Aug 17 - Fri Aug 21
  const weekDates = [
    { label: 'Mon (17)', date: '2026-08-17' },
    { label: 'Tue (18)', date: '2026-08-18' },
    { label: 'Wed (19)', date: '2026-08-19' },
    { label: 'Thu (20)', date: '2026-08-20' },
    { label: 'Fri (21)', date: '2026-08-21' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Workforce Compliance
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Attendance Records & Timesheets
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Company-wide attendance tracking, shift verification, check-in timestamps, and weekly hours audited across departments.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="p-1 bg-[#FFFFFF] border border-[#E8E2F0] rounded-xl flex items-center shadow-xs">
          <button
            id="hr-att-view-daily"
            onClick={() => setViewMode('daily')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'daily'
                ? 'bg-[#7B2CBF] text-white shadow-xs'
                : 'text-[#1E1035]/70 hover:text-[#1E1035]'
            }`}
          >
            Daily Log
          </button>
          <button
            id="hr-att-view-weekly"
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-[#7B2CBF] text-white shadow-xs'
                : 'text-[#1E1035]/70 hover:text-[#1E1035]'
            }`}
          >
            Weekly Matrix
          </button>
        </div>
      </div>

      {/* Metric summary counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            Present on Duty
          </span>
          <p className="text-xl font-extrabold text-emerald-700 mt-1">
            {presentCount} <span className="text-xs font-medium text-[#1E1035]/50">employees</span>
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            On Approved Leave
          </span>
          <p className="text-xl font-extrabold text-[#7B2CBF] mt-1">
            {leaveCount} <span className="text-xs font-medium text-[#1E1035]/50">employees</span>
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            Half-Day Shifts
          </span>
          <p className="text-xl font-extrabold text-amber-600 mt-1">
            {halfDayCount} <span className="text-xs font-medium text-[#1E1035]/50">employees</span>
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            Unexcused Absent
          </span>
          <p className="text-xl font-extrabold text-rose-700 mt-1">
            {absentCount} <span className="text-xs font-medium text-[#1E1035]/50">employees</span>
          </p>
        </Card>
      </div>

      {/* Filter and Control Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            id="hr-att-search"
            placeholder="Search employee..."
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Input
            id="hr-att-date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

          <Select
            id="hr-att-dept-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { label: 'All Departments', value: 'all' },
              ...departments.map((d) => ({ label: d, value: d })),
            ]}
          />

          <Select
            id="hr-att-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Present', value: 'present' },
              { label: 'Absent', value: 'absent' },
              { label: 'Half-day', value: 'half-day' },
              { label: 'On Leave', value: 'leave' },
            ]}
          />
        </div>
      </Card>

      {/* 1. DAILY VIEW */}
      {viewMode === 'daily' && (
        <Card>
          <CardHeader
            title={`Attendance Log: ${selectedDate}`}
            subtitle={`Showing ${dailyRecords.length} records`}
            icon={<Clock size={18} />}
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check-In</TableHead>
                <TableHead>Check-Out</TableHead>
                <TableHead>Hours Logged</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dailyRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-xs text-[#1E1035]/50">
                    No attendance records logged for this selected date.
                  </TableCell>
                </TableRow>
              ) : (
                dailyRecords.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={rec.employeeAvatar}
                          name={rec.employeeName}
                          size="sm"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#1E1035]">
                            {rec.employeeName}
                          </p>
                          <p className="text-[11px] font-mono text-[#7B2CBF]">
                            {rec.employeeId}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-[#1E1035]/70">
                      {rec.department}
                    </TableCell>

                    <TableCell className="text-xs font-mono font-medium text-[#1E1035]">
                      {rec.checkIn || '—'}
                    </TableCell>

                    <TableCell className="text-xs font-mono font-medium text-[#1E1035]">
                      {rec.checkOut || (rec.checkIn ? 'In Progress' : '—')}
                    </TableCell>

                    <TableCell className="text-xs font-bold font-mono text-[#1E1035]">
                      {rec.hoursWorked > 0 ? `${rec.hoursWorked} hrs` : '0.0 hrs'}
                    </TableCell>

                    <TableCell>
                      <AttendanceBadge status={rec.status} />
                    </TableCell>

                    <TableCell className="text-xs text-[#1E1035]/65">
                      {rec.remarks || 'Standard Shift'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* 2. WEEKLY MATRIX VIEW */}
      {viewMode === 'weekly' && (
        <Card>
          <CardHeader
            title="Weekly Workforce Attendance Matrix"
            subtitle="Mon Aug 17, 2026 – Fri Aug 21, 2026"
            icon={<CalendarDays size={18} />}
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  {weekDates.map((d) => (
                    <TableHead key={d.date} className="text-center">
                      {d.label}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Total Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((emp) => {
                  const empRecords = attendanceRecords.filter(
                    (r) => r.employeeId === emp.employeeId
                  );
                  const totalHrs = weekDates.reduce((acc, d) => {
                    const found = empRecords.find((r) => r.date === d.date);
                    return acc + (found?.hoursWorked || 0);
                  }, 0);

                  return (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={emp.personalDetails.profilePicture}
                            name={emp.personalDetails.name}
                            size="xs"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#1E1035]">
                              {emp.personalDetails.name}
                            </p>
                            <p className="text-[10px] text-[#1E1035]/50">
                              {emp.jobDetails.department}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {weekDates.map((d) => {
                        const rec = empRecords.find((r) => r.date === d.date);
                        return (
                          <TableCell key={d.date} className="text-center py-2.5">
                            {rec ? (
                              <div className="inline-flex flex-col items-center">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    rec.status === 'present'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : rec.status === 'leave'
                                      ? 'bg-purple-100 text-[#7B2CBF]'
                                      : rec.status === 'half-day'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {rec.status === 'present'
                                    ? `${rec.hoursWorked}h`
                                    : rec.status}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[#1E1035]/30">—</span>
                            )}
                          </TableCell>
                        );
                      })}

                      <TableCell className="text-right font-bold text-xs font-mono text-[#7B2CBF]">
                        {totalHrs.toFixed(1)} hrs
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};
