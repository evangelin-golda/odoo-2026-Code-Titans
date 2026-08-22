'use client';

import React from 'react';
import {
  Users,
  Clock,
  CheckSquare,
  CreditCard,
  ArrowUpRight,
  UserCheck,
  AlertTriangle,
  Calendar,
  Building2,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Check,
  X,
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { AttendanceBadge, LeaveStatusBadge, LeaveTypeBadge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

export const HRDashboard: React.FC = () => {
  const {
    currentUser,
    employees,
    attendanceRecords,
    leaveRequests,
    payrollRecords,
    setActiveView,
    reviewLeave,
    impersonateEmployee,
  } = useHRMS();

  // Metrics computation
  const totalEmployees = employees.length;

  const todayDate = '2026-08-21';
  const todayRecords = attendanceRecords.filter((r) => r.date === todayDate);
  const presentCount = todayRecords.filter((r) => r.status === 'present').length;
  const absentCount = todayRecords.filter((r) => r.status === 'absent').length;
  const halfDayCount = todayRecords.filter((r) => r.status === 'half-day').length;
  const leaveCount = todayRecords.filter((r) => r.status === 'leave').length;
  const attendanceRate = totalEmployees > 0 ? ((presentCount / totalEmployees) * 100).toFixed(1) : '94.2';

  const pendingLeaveRequests = leaveRequests.filter((l) => l.status === 'pending');

  const totalGrossPayroll = payrollRecords.reduce((acc, curr) => acc + (curr.grossSalary || 0), 0);
  const totalNetPayroll = payrollRecords.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);
  const totalDeductions = payrollRecords.reduce(
    (acc, curr) => acc + (curr.pfDeduction || 0) + (curr.taxDeduction || 0),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 4 Professional KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Total Employees */}
        <div
          id="hr-kpi-employees"
          onClick={() => setActiveView('employees')}
          className="bg-white p-6 rounded-2xl border border-[#F7F4FA] shadow-sm hover:border-[#7B2CBF]/30 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-[#1E1035]/40 uppercase tracking-widest">
              Total Employees
            </span>
            <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-md border border-green-100">
              +4 this month
            </span>
          </div>
          <p className="text-3xl font-bold text-[#1E1035] tracking-tight">{totalEmployees}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-[#1E1035]/60 pt-2 border-t border-[#F7F4FA]">
            <span>Full-time: 85%</span>
            <span className="font-semibold text-[#7B2CBF] group-hover:underline">Directory &rarr;</span>
          </div>
        </div>

        {/* 2. Today's Attendance Rate */}
        <div
          id="hr-kpi-attendance"
          onClick={() => setActiveView('attendance')}
          className="bg-white p-6 rounded-2xl border border-[#F7F4FA] shadow-sm hover:border-[#7B2CBF]/30 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-[#1E1035]/40 uppercase tracking-widest">
              Attendance Rate
            </span>
            <span className="text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
              Target: 90%
            </span>
          </div>
          <p className="text-3xl font-bold text-[#1E1035] tracking-tight">{attendanceRate}%</p>
          <div className="mt-3 flex items-center justify-between text-xs text-[#1E1035]/60 pt-2 border-t border-[#F7F4FA]">
            <span>{presentCount} Present &bull; {absentCount} Absent</span>
            <span className="font-semibold text-[#7B2CBF] group-hover:underline">Timesheets &rarr;</span>
          </div>
        </div>

        {/* 3. Pending Approvals */}
        <div
          id="hr-kpi-leaves"
          onClick={() => setActiveView('leave-approvals')}
          className="bg-white p-6 rounded-2xl border border-[#F7F4FA] shadow-sm hover:border-[#7B2CBF]/30 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-[#1E1035]/40 uppercase tracking-widest">
              Pending Leaves
            </span>
            <span className="text-[#7B2CBF] text-xs font-bold bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
              Needs Action
            </span>
          </div>
          <p className="text-3xl font-bold text-[#7B2CBF] tracking-tight">
            {pendingLeaveRequests.length < 10 ? `0${pendingLeaveRequests.length}` : pendingLeaveRequests.length}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-[#1E1035]/60 pt-2 border-t border-[#F7F4FA]">
            <span>Awaiting Review</span>
            <span className="font-semibold text-[#7B2CBF] group-hover:underline">Approve &rarr;</span>
          </div>
        </div>

        {/* 4. Monthly Payroll */}
        <div
          id="hr-kpi-payroll"
          onClick={() => setActiveView('payroll')}
          className="bg-white p-6 rounded-2xl border border-[#F7F4FA] shadow-sm hover:border-[#7B2CBF]/30 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-[#1E1035]/40 uppercase tracking-widest">
              Monthly Payroll
            </span>
            <span className="text-gray-600 text-xs font-bold bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
              August 2026
            </span>
          </div>
          <p className="text-3xl font-bold text-[#1E1035] tracking-tight">
            ${(totalNetPayroll / 1000).toFixed(1)}k
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-[#1E1035]/60 pt-2 border-t border-[#F7F4FA]">
            <span>Gross: ${(totalGrossPayroll / 1000).toFixed(1)}k</span>
            <span className="font-semibold text-green-600">Disbursement Ready</span>
          </div>
        </div>
      </div>

      {/* Main Content Section: Left 2 cols (Pending Approvals / Attendance) + Right 1 col (Payroll Cycle Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tables & Queue */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Leave Approvals Table Card */}
          <div className="bg-white rounded-2xl border border-[#F7F4FA] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F7F4FA] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-[#1E1035]">Pending Leave Approvals</h3>
                <p className="text-xs text-[#1E1035]/50 mt-0.5">
                  Review and act on active employee time-off requests
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#7B2CBF] font-semibold"
                onClick={() => setActiveView('leave-approvals')}
              >
                View Full Queue
              </Button>
            </div>

            {pendingLeaveRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#1E1035]/50">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-green-500" />
                All leave requests have been resolved.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-[#1E1035]/50 border-b border-[#F7F4FA] bg-[#F7F4FA]/30">
                      <th className="px-6 py-3.5 font-bold">Employee</th>
                      <th className="px-6 py-3.5 font-bold">Type</th>
                      <th className="px-6 py-3.5 font-bold">Duration</th>
                      <th className="px-6 py-3.5 font-bold">Remarks</th>
                      <th className="px-6 py-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F4FA] text-xs">
                    {pendingLeaveRequests.slice(0, 4).map((leave) => (
                      <tr key={leave.id} className="hover:bg-[#F7F4FA]/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <Avatar
                            src={leave.employeeAvatar}
                            name={leave.employeeName}
                            size="sm"
                          />
                          <div>
                            <p className="font-bold text-[#1E1035]">{leave.employeeName}</p>
                            <p className="text-[11px] text-[#1E1035]/50">{leave.employeeId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <LeaveTypeBadge type={leave.leaveType} />
                        </td>
                        <td className="px-6 py-4 text-[#1E1035]/70">
                          <span className="font-semibold text-[#1E1035] block">
                            {leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'}
                          </span>
                          <span className="text-[10px] text-[#1E1035]/50">
                            {leave.startDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs text-[#1E1035]/70 truncate">
                          "{leave.remarks}"
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`quick-approve-${leave.id}`}
                              onClick={() => reviewLeave(leave.id, 'approved', 'Approved by HR Lead')}
                              title="Approve Leave"
                              className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer border border-green-100"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              id={`quick-reject-${leave.id}`}
                              onClick={() => reviewLeave(leave.id, 'rejected', 'Declined due to team schedule')}
                              title="Reject Leave"
                              className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer border border-rose-100"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Today's Attendance Overview Table Card */}
          <div className="bg-white rounded-2xl border border-[#F7F4FA] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#F7F4FA] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-[#1E1035]">Daily Attendance Roster</h3>
                <p className="text-xs text-[#1E1035]/50 mt-0.5">
                  August 21, 2026 &bull; Real-time check-in and check-out logs
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#7B2CBF] font-semibold"
                onClick={() => setActiveView('attendance')}
              >
                All Timesheets
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wider text-[#1E1035]/50 border-b border-[#F7F4FA] bg-[#F7F4FA]/30">
                    <th className="px-6 py-3.5 font-bold">Employee</th>
                    <th className="px-6 py-3.5 font-bold">Department</th>
                    <th className="px-6 py-3.5 font-bold">Check In</th>
                    <th className="px-6 py-3.5 font-bold">Check Out</th>
                    <th className="px-6 py-3.5 font-bold">Hours</th>
                    <th className="px-6 py-3.5 font-bold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F7F4FA] text-xs">
                  {todayRecords.slice(0, 5).map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#F7F4FA]/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Avatar
                          src={rec.employeeAvatar}
                          name={rec.employeeName}
                          size="sm"
                        />
                        <span className="font-bold text-[#1E1035]">{rec.employeeName}</span>
                      </td>
                      <td className="px-6 py-4 text-[#1E1035]/70">{rec.department}</td>
                      <td className="px-6 py-4 font-mono font-medium text-[#1E1035]">
                        {rec.checkIn || '—'}
                      </td>
                      <td className="px-6 py-4 font-mono text-[#1E1035]/70">
                        {rec.checkOut || '—'}
                      </td>
                      <td className="px-6 py-4 text-[#1E1035]/70">
                        {rec.hoursWorked > 0 ? `${rec.hoursWorked} hrs` : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AttendanceBadge status={rec.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Dark Accent Feature Card & Quick Auditor */}
        <div className="space-y-8">
          {/* Refined Light Feature Card: Payroll Cycle Status */}
          <div className="bg-gradient-to-br from-[#FAF7FC] via-white to-[#F5EEFB] rounded-2xl p-8 flex flex-col justify-between border border-[#EBDFF8] shadow-sm relative overflow-hidden">
            {/* Soft Ambient Purple Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#7B2CBF]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[11px] font-bold text-[#7B2CBF] uppercase tracking-widest block mb-1">
                    Payroll Cycle Status
                  </span>
                  <h4 className="text-xl font-bold tracking-tight text-[#1E1035]">August 2026 Cycle</h4>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-extrabold text-[#1E1035]">05</span>
                  <span className="text-xs text-[#1E1035]/60">Days until disbursement</span>
                </div>
                <div className="w-full h-2 bg-[#E8DEF8] rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-[#7B2CBF] rounded-full" />
                </div>
              </div>

              <div className="space-y-3.5 py-4 border-t border-[#EBDFF8] text-xs">
                <div className="flex justify-between items-center text-[#1E1035]/70">
                  <span>Gross Salary Commitment</span>
                  <span className="font-bold text-[#1E1035]">${totalGrossPayroll.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[#1E1035]/70">
                  <span>Calculated Taxes & Deductions</span>
                  <span className="font-bold text-rose-600">-${totalDeductions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#EBDFF8] text-sm">
                  <span className="font-bold text-[#1E1035]">Net Disbursement</span>
                  <span className="font-extrabold text-[#7B2CBF] bg-[#F3E8FC] px-2.5 py-1 rounded-md border border-[#E9D5FF]">
                    ${totalNetPayroll.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              id="payroll-card-cta-btn"
              onClick={() => setActiveView('payroll')}
              className="mt-6 w-full py-3 bg-[#7B2CBF] hover:bg-[#6A24A6] text-white rounded-xl font-bold transition-all text-xs text-center cursor-pointer shadow-sm"
            >
              Manage Salary Disbursement &rarr;
            </button>
          </div>

          {/* Quick Staff Auditor */}
          <div className="bg-white p-6 rounded-2xl border border-[#F7F4FA] shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7F4FA] border border-[#F7F4FA] flex items-center justify-center text-[#7B2CBF]">
                <UserCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E1035] uppercase tracking-wider">
                  Quick Staff Auditor
                </h4>
                <p className="text-xs text-[#1E1035]/60 mt-0.5">
                  Inspect self-service views as any employee
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {employees.slice(0, 4).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => impersonateEmployee(emp.employeeId)}
                  className="p-2.5 rounded-xl border border-[#F7F4FA] hover:border-[#7B2CBF]/30 hover:bg-[#F7F4FA]/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={emp.personalDetails.profilePicture}
                      name={emp.personalDetails.name}
                      size="xs"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#1E1035] group-hover:text-[#7B2CBF]">
                        {emp.personalDetails.name}
                      </p>
                      <p className="text-[10px] text-[#1E1035]/50">
                        {emp.jobDetails.jobTitle} ({emp.employeeId})
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-[#1E1035]/30 group-hover:text-[#7B2CBF] transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
