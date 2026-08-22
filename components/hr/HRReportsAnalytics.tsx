'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  Clock,
  Download,
  Calendar,
  Users,
  Building,
  CheckCircle2,
  PieChart,
  FileSpreadsheet,
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export const HRReportsAnalytics: React.FC = () => {
  const { employees, attendanceRecords, leaveRequests, payrollRecords } = useHRMS();

  const [activeReportTab, setActiveReportTab] = useState<'attendance' | 'payroll'>('attendance');

  // Attendance statistics
  const totalLogs = attendanceRecords.length;
  const presentLogs = attendanceRecords.filter((r) => r.status === 'present').length;
  const leaveLogs = attendanceRecords.filter((r) => r.status === 'leave').length;
  const absentLogs = attendanceRecords.filter((r) => r.status === 'absent').length;
  const halfDayLogs = attendanceRecords.filter((r) => r.status === 'half-day').length;

  const attendanceRate = totalLogs > 0 ? Math.round(((presentLogs + halfDayLogs * 0.5) / totalLogs) * 100) : 95;

  // Leave breakdown
  const paidLeaves = leaveRequests.filter((l) => l.leaveType === 'paid' && l.status === 'approved').length;
  const sickLeaves = leaveRequests.filter((l) => l.leaveType === 'sick' && l.status === 'approved').length;
  const unpaidLeaves = leaveRequests.filter((l) => l.leaveType === 'unpaid' && l.status === 'approved').length;

  // Department salary distribution
  const deptSalaryMap: Record<string, number> = employees.reduce((acc: Record<string, number>, emp) => {
    const dept = emp.jobDetails.department;
    acc[dept] = (acc[dept] || 0) + emp.salaryStructure.grossSalary;
    return acc;
  }, {});

  const totalPayrollGross = Object.values(deptSalaryMap).reduce((a: number, b: number) => a + b, 0);

  // Department Attendance Performance
  const deptAttendanceMap: Record<string, { total: number; present: number }> = employees.reduce(
    (acc: Record<string, { total: number; present: number }>, emp) => {
      const dept = emp.jobDetails.department;
      const empLogs = attendanceRecords.filter((r) => r.employeeId === emp.employeeId);
      const present = empLogs.filter((r) => r.status === 'present').length;
      if (!acc[dept]) acc[dept] = { total: 0, present: 0 };
      acc[dept].total += empLogs.length;
      acc[dept].present += present;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Workforce Intelligence
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            HR Reports & Analytics
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Generate executive compliance summaries, audit departmental attendance trends, and review monthly salary expenditure.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="p-1 bg-[#FFFFFF] border border-[#E8E2F0] rounded-xl flex items-center shadow-xs">
          <button
            onClick={() => setActiveReportTab('attendance')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeReportTab === 'attendance'
                ? 'bg-[#7B2CBF] text-white shadow-xs'
                : 'text-[#1E1035]/70 hover:text-[#1E1035]'
            }`}
          >
            <Clock size={15} />
            <span>Attendance Reports</span>
          </button>
          <button
            onClick={() => setActiveReportTab('payroll')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeReportTab === 'payroll'
                ? 'bg-[#7B2CBF] text-white shadow-xs'
                : 'text-[#1E1035]/70 hover:text-[#1E1035]'
            }`}
          >
            <CreditCard size={15} />
            <span>Payroll Analytics</span>
          </button>
        </div>
      </div>

      {/* 1. ATTENDANCE & LEAVE REPORTS */}
      {activeReportTab === 'attendance' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Overall Attendance Rate
              </span>
              <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                {attendanceRate}%
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Current month average
              </span>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Total Present Logs
              </span>
              <p className="text-2xl font-extrabold text-[#1E1035] mt-1">
                {presentLogs} <span className="text-xs font-medium text-[#1E1035]/50">shifts</span>
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Verified check-ins
              </span>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Approved Leave Days
              </span>
              <p className="text-2xl font-extrabold text-[#7B2CBF] mt-1">
                {leaveLogs} <span className="text-xs font-medium text-[#1E1035]/50">days</span>
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Paid, sick & unpaid
              </span>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Unexcused Absences
              </span>
              <p className="text-2xl font-extrabold text-rose-700 mt-1">
                {absentLogs} <span className="text-xs font-medium text-[#1E1035]/50">days</span>
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Target: &lt;2% threshold
              </span>
            </Card>
          </div>

          {/* Department Attendance Performance & Leave Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Punctuality */}
            <Card>
              <CardHeader
                title="Department Attendance Compliance"
                subtitle="Percentage of on-time shifts by department"
                icon={<Building size={18} />}
              />

              <div className="space-y-4 pt-2">
                {Object.entries(deptAttendanceMap).map(([dept, data]) => {
                  const rate = data.total > 0 ? Math.round((data.present / data.total) * 100) : 90;
                  return (
                    <div key={dept} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1E1035]">{dept}</span>
                        <span className="font-mono font-bold text-[#7B2CBF]">{rate}%</span>
                      </div>
                      <div className="w-full bg-[#F7F4FA] h-2.5 rounded-full overflow-hidden border border-[#E8E2F0]">
                        <div
                          className="h-full bg-[#7B2CBF] rounded-full transition-all duration-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Leave Type Utilization Breakdown */}
            <Card>
              <CardHeader
                title="Leave Utilization by Category"
                subtitle="Approved leave allocation for August 2026"
                icon={<PieChart size={18} />}
              />

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Paid Leave (Annual / Vacation)</h4>
                    <p className="text-[11px] text-blue-800">Approved employee vacation requests</p>
                  </div>
                  <span className="text-lg font-extrabold text-blue-900">{paidLeaves} approved</span>
                </div>

                <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-orange-900">Sick Leave (Medical)</h4>
                    <p className="text-[11px] text-orange-800">Health and medical recuperation</p>
                  </div>
                  <span className="text-lg font-extrabold text-orange-900">{sickLeaves} approved</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unpaid Personal Leave</h4>
                    <p className="text-[11px] text-slate-800">Discretionary time off</p>
                  </div>
                  <span className="text-lg font-extrabold text-slate-900">{unpaidLeaves} approved</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 2. PAYROLL & SALARY REPORTS */}
      {activeReportTab === 'payroll' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Total Gross Expenditure
              </span>
              <p className="text-2xl font-extrabold text-[#1E1035] mt-1">
                ${totalPayrollGross.toLocaleString()}
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Pre-tax budgeted payroll
              </span>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Avg. Employee Net Pay
              </span>
              <p className="text-2xl font-extrabold text-[#7B2CBF] mt-1">
                $
                {employees.length > 0
                  ? Math.round(
                      employees.reduce((a, b) => a + b.salaryStructure.netSalary, 0) /
                        employees.length
                    ).toLocaleString()
                  : '0'}
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Per staff member
              </span>
            </Card>

            <Card>
              <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
                Tax Compliance Withholding
              </span>
              <p className="text-2xl font-extrabold text-rose-700 mt-1">
                $
                {employees
                  .reduce((a, b) => a + b.salaryStructure.taxDeduction, 0)
                  .toLocaleString()}
              </p>
              <span className="text-[11px] text-[#1E1035]/50 block mt-0.5">
                Remitted to federal/state revenue
              </span>
            </Card>
          </div>

          {/* Department Salary Distribution */}
          <Card>
            <CardHeader
              title="Departmental Compensation Budget Allocation"
              subtitle="Monthly gross salary breakdown by business unit"
              icon={<CreditCard size={18} />}
            />

            <div className="space-y-4 pt-2">
              {Object.entries(deptSalaryMap).map(([dept, amount]) => {
                const percent = Math.round((amount / totalPayrollGross) * 100);
                return (
                  <div key={dept} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1E1035]">{dept}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#1E1035]/70">
                          ${amount.toLocaleString()}
                        </span>
                        <span className="font-mono font-bold text-[#7B2CBF]">
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-[#F7F4FA] h-3 rounded-full overflow-hidden border border-[#E8E2F0]">
                      <div
                        className="h-full bg-[#7B2CBF] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
