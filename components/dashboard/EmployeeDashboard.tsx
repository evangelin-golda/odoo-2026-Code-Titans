'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  User,
  Clock,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  LogIn,
  LogOut,
  MapPin,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AttendanceBadge, LeaveStatusBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

export function EmployeeDashboard() {
  const {
    employee,
    todayAttendance,
    setActiveView,
    handleCheckIn,
    handleCheckOut,
    setOpenApplyLeaveModal,
  } = useEmployee();

  const [leaveStats, setLeaveStats] = useState({ available: 18, pending: 1, used: 4 });
  const [userLeaves, setUserLeaves] = useState<any[]>([]);
  const [salarySummary, setSalarySummary] = useState<any>(null);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);

  const isCheckedIn = !!(todayAttendance && todayAttendance.checkIn && todayAttendance.checkIn !== '-');
  const isCheckedOut = !!(todayAttendance && todayAttendance.checkOut && todayAttendance.checkOut !== '-');

  // Fetch live leave records
  useEffect(() => {
    if (!employee) return;
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`/api/leaves?employeeId=${employee.employeeId}`);
        const data = await res.json();
        if (data.success && data.requests) {
          setUserLeaves(data.requests);
          const pending = data.requests.filter((r: any) => r.status === 'pending').length;
          const approved = data.requests
            .filter((r: any) => r.status === 'approved')
            .reduce((acc: number, r: any) => acc + (r.totalDays || 1), 0);
          setLeaveStats({
            available: Math.max(0, 18 - approved),
            pending,
            used: approved,
          });
        }
      } catch (err) {
        console.error('Error loading leaves:', err);
      }
    };

    const fetchSalary = async () => {
      try {
        const res = await fetch(`/api/salary?employeeId=${employee.employeeId}`);
        const data = await res.json();
        if (data.success && data.salary) {
          setSalarySummary(data.salary);
        }
      } catch (err) {
        console.error('Error loading salary:', err);
      }
    };

    const fetchAttendance = async () => {
      try {
        const res = await fetch(`/api/attendance?employeeId=${employee.employeeId}`);
        const data = await res.json();
        if (data.success && data.records) {
          setRecentAttendance(data.records.slice(0, 5));
        }
      } catch (err) {
        console.error('Error loading attendance:', err);
      }
    };

    fetchLeaves();
    fetchSalary();
    fetchAttendance();
  }, [employee]);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const alerts = [
    {
      id: '1',
      title: 'Annual Performance Appraisal Cycle',
      description: 'Q3 self-review assessments are now open in the employee portal until Aug 31.',
      priority: 'high',
      date: '2026-08-20',
    },
    {
      id: '2',
      title: 'Company Holiday Notice: Labor Day',
      description: 'Corporate offices will remain closed on Monday, September 7, 2026.',
      priority: 'normal',
      date: '2026-08-18',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Welcome Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={employee?.avatarUrl || ''}
            name={employee?.name || 'Employee'}
            size="lg"
            statusIndicator={isCheckedIn ? 'online' : 'offline'}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
                Employee Portal
              </span>
              <span className="text-xs text-[#1E1035]/50">•</span>
              <span className="text-xs text-[#1E1035]/60 font-semibold">{formattedDate}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1E1035] tracking-tight mt-1">
              Welcome, {employee?.name || 'Employee'}
            </h2>
            <p className="text-xs text-[#1E1035]/70 mt-0.5">
              {employee?.jobPosition} • {employee?.department} ({employee?.employeeId})
            </p>
          </div>
        </div>

        {/* Quick Check-In CTA */}
        <div className="flex items-center gap-3 bg-[#FFFFFF] p-3.5 rounded-2xl border border-[#E8E2F0] shadow-xs">
          <div className="text-left pr-2">
            <p className="text-[11px] font-bold text-[#1E1035]/50 uppercase tracking-wider">
              Today's Shift
            </p>
            <p className="text-xs font-semibold text-[#1E1035] flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCheckedIn
                    ? 'bg-emerald-500 animate-pulse'
                    : isCheckedOut
                    ? 'bg-[#7B2CBF]'
                    : 'bg-amber-400'
                }`}
              />
              <span>
                {isCheckedIn
                  ? `Checked In at ${todayAttendance?.checkIn}`
                  : isCheckedOut
                  ? `Checked Out at ${todayAttendance?.checkOut}`
                  : 'Not Checked In'}
              </span>
            </p>
          </div>

          {!isCheckedIn && !isCheckedOut && (
            <Button
              id="emp-dashboard-checkin-btn"
              size="sm"
              onClick={() => handleCheckIn('office')}
              leftIcon={<LogIn size={15} />}
              className="whitespace-nowrap rounded-xl"
            >
              Check In
            </Button>
          )}

          {isCheckedIn && (
            <Button
              id="emp-dashboard-checkout-btn"
              size="sm"
              variant="secondary"
              onClick={() => handleCheckOut()}
              leftIcon={<LogOut size={15} />}
              className="whitespace-nowrap rounded-xl text-[#7B2CBF] border-purple-200 hover:bg-purple-50"
            >
              Check Out
            </Button>
          )}

          {isCheckedOut && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>Shift Complete</span>
            </span>
          )}
        </div>
      </div>

      {/* Main 4 Quick-Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Profile Card */}
        <Card
          id="card-quick-profile"
          hoverable
          className="cursor-pointer group flex flex-col justify-between"
          onClick={() => setActiveView('profile')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] group-hover:bg-[#7B2CBF] group-hover:text-white transition-all">
                <User size={20} />
              </div>
              <ArrowUpRight size={16} className="text-[#1E1035]/30 group-hover:text-[#7B2CBF] transition-colors" />
            </div>
            <h3 className="text-base font-bold text-[#1E1035]">Employee Profile</h3>
            <p className="text-xs text-[#1E1035]/65 mt-1 leading-relaxed">
              Manage personal details, contact info, and view documents.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8E2F0] flex items-center justify-between text-xs font-semibold text-[#7B2CBF]">
            <span>View Full Profile</span>
            <ArrowRight size={13} />
          </div>
        </Card>

        {/* 2. Attendance Card */}
        <Card
          id="card-quick-attendance"
          hoverable
          className="cursor-pointer group flex flex-col justify-between"
          onClick={() => setActiveView('attendance')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] group-hover:bg-[#7B2CBF] group-hover:text-white transition-all">
                <Clock size={20} />
              </div>
              <ArrowUpRight size={16} className="text-[#1E1035]/30 group-hover:text-[#7B2CBF] transition-colors" />
            </div>
            <h3 className="text-base font-bold text-[#1E1035]">Attendance Records</h3>
            <p className="text-xs text-[#1E1035]/65 mt-1 leading-relaxed">
              Track daily check-in times and monthly calendar compliance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8E2F0] flex items-center justify-between text-xs">
            <span className="text-[#1E1035]/60">Status</span>
            <span className="font-bold text-[#7B2CBF]">
              {isCheckedIn ? 'Checked In' : isCheckedOut ? 'Recorded' : 'Ready'}
            </span>
          </div>
        </Card>

        {/* 3. Leave Requests Card */}
        <Card
          id="card-quick-leave"
          hoverable
          className="cursor-pointer group flex flex-col justify-between"
          onClick={() => setActiveView('leave')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] group-hover:bg-[#7B2CBF] group-hover:text-white transition-all">
                <CalendarDays size={20} />
              </div>
              <ArrowUpRight size={16} className="text-[#1E1035]/30 group-hover:text-[#7B2CBF] transition-colors" />
            </div>
            <h3 className="text-base font-bold text-[#1E1035]">Leave & Time-Off</h3>
            <p className="text-xs text-[#1E1035]/65 mt-1 leading-relaxed">
              Request paid, sick, or unpaid leave and monitor approvals.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8E2F0] flex items-center justify-between text-xs">
            <span className="text-[#1E1035]/60">Available Balance</span>
            <span className="font-bold text-[#7B2CBF]">
              {leaveStats.available} days left
            </span>
          </div>
        </Card>

        {/* 4. Payroll Card */}
        <Card
          id="card-quick-payroll"
          hoverable
          className="cursor-pointer group flex flex-col justify-between"
          onClick={() => setActiveView('salary')}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] group-hover:bg-[#7B2CBF] group-hover:text-white transition-all">
                <CreditCard size={20} />
              </div>
              <ArrowUpRight size={16} className="text-[#1E1035]/30 group-hover:text-[#7B2CBF] transition-colors" />
            </div>
            <h3 className="text-base font-bold text-[#1E1035]">Payroll / Salary</h3>
            <p className="text-xs text-[#1E1035]/65 mt-1 leading-relaxed">
              Read-only salary structure and monthly pay stubs.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E8E2F0] flex items-center justify-between text-xs">
            <span className="text-[#1E1035]/60">August Net Pay</span>
            <span className="font-bold text-[#1E1035]">
              ${(salarySummary?.netSalary || 8490).toLocaleString()} / mo
            </span>
          </div>
        </Card>
      </div>

      {/* Two Column Layout: Recent Activity & HR Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Attendance & Leave Applications */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2F0] mb-4">
              <div className="flex items-center gap-2.5">
                <Clock size={18} className="text-[#7B2CBF]" />
                <h3 className="text-base font-bold text-[#1E1035]">Recent Attendance Activity</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#7B2CBF]"
                onClick={() => setActiveView('attendance')}
              >
                View All Records
              </Button>
            </div>

            <div className="divide-y divide-[#E8E2F0]">
              {recentAttendance.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#1E1035]/50">
                  No attendance records logged this week yet.
                </div>
              ) : (
                recentAttendance.map((record, idx) => (
                  <div key={record.id || idx} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-center text-[#1E1035]">
                        <Calendar size={15} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1E1035]">
                          {record.date}
                        </p>
                        <p className="text-[11px] text-[#1E1035]/60">
                          {record.checkIn ? `In: ${record.checkIn}` : 'No Check In'}
                          {record.checkOut ? ` • Out: ${record.checkOut}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-[#1E1035]/70">
                        {record.hoursWorked ? `${record.hoursWorked} hrs` : '8.5 hrs'}
                      </span>
                      <AttendanceBadge status={record.status || 'present'} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* User Leave Summary */}
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2F0] mb-4">
              <div className="flex items-center gap-2.5">
                <CalendarDays size={18} className="text-[#7B2CBF]" />
                <h3 className="text-base font-bold text-[#1E1035]">My Leave Applications</h3>
              </div>
              <Button
                size="sm"
                onClick={() => setOpenApplyLeaveModal(true)}
              >
                Apply for Leave
              </Button>
            </div>

            {userLeaves.length === 0 ? (
              <p className="text-xs text-[#1E1035]/50 py-4 text-center">
                No leave requests filed yet.
              </p>
            ) : (
              <div className="divide-y divide-[#E8E2F0]">
                {userLeaves.slice(0, 3).map((leave, idx) => (
                  <div key={leave.id || idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1E1035]">
                          {leave.leaveType || leave.type} Leave
                        </span>
                        <span className="text-xs text-[#1E1035]/50">•</span>
                        <span className="text-xs font-medium text-[#1E1035]/70">
                          {leave.startDate} to {leave.endDate} ({leave.totalDays || 1} days)
                        </span>
                      </div>
                      <p className="text-xs text-[#1E1035]/65 mt-0.5 line-clamp-1">
                        Reason: {leave.remarks || leave.reason}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <LeaveStatusBadge status={leave.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: HR Announcements & Helpdesk */}
        <div className="space-y-6">
          <Card className="bg-[#FFFFFF]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2F0] mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#7B2CBF]" />
                <h3 className="text-base font-bold text-[#1E1035]">Company Notices</h3>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F7F4FA] border border-[#E8E2F0] text-[#7B2CBF]">
                HR Office
              </span>
            </div>

            <div className="space-y-3.5">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-left space-y-1.5 ${
                    alert.priority === 'high'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-[#F7F4FA] border-[#E8E2F0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E1035]">
                      {alert.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        alert.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-[#7B2CBF]'
                      }`}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1035]/70 leading-relaxed">
                    {alert.description}
                  </p>
                  <span className="text-[10px] text-[#1E1035]/40 block pt-1">
                    Posted on {alert.date}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Help & HR Contact */}
          <Card className="bg-[#F7F4FA] border border-[#E8E2F0]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFFFFF] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF]">
                <Building2 size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1035]">HR Support & Policy</h4>
                <p className="text-[11px] text-[#1E1035]/60">Dayflow HR Governance</p>
              </div>
            </div>
            <p className="text-xs text-[#1E1035]/70 leading-relaxed mb-3">
              Need assistance with document verification, payroll adjustments, or leave balances?
            </p>
            <div className="text-xs font-semibold text-[#7B2CBF] flex items-center gap-1">
              <span>bharani.flow@gmail.com</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
