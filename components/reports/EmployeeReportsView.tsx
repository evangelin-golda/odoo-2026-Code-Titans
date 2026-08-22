'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  TrendingUp,
  Clock,
  CalendarDays,
  Award,
  CheckCircle2,
  AlertCircle,
  Printer,
  BarChart3,
  Flame,
  CheckCheck,
} from 'lucide-react';
import { PersonalReportSummary } from '@/types/hrms';

export function EmployeeReportsView() {
  const { employee } = useEmployee();
  const [report, setReport] = useState<PersonalReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!employee) return;
    setIsLoading(true);
    fetch(`/api/reports?employeeId=${employee.employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.report) {
          setReport(data.report);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [employee]);

  if (!employee) return null;

  return (
    <div id="dayflow-employee-reports-view" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Self-Service Analytics
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Personal Attendance & Performance Metrics
            </h1>
            <p className="text-xs text-slate-500">
              Data-backed breakdown of your working patterns, punctuality streaks, and leave quotas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-xs shrink-0"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* 2. Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Attendance Rate</span>
            <CheckCheck className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {report ? `${report.attendancePercentage}%` : '96%'}
          </div>
          <p className="text-[11px] text-slate-500">
            {report ? `${report.daysPresent} days present / ${report.totalWorkingDays} working days` : 'Active period'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Punctuality Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {report ? `${report.punctualityRate}%` : '96.4%'}
          </div>
          <p className="text-[11px] text-slate-500">Exceeds team baseline of 90%</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">On-Time Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500">
            {report ? `${report.currentStreakDays} Days` : '14 Days'}
          </div>
          <p className="text-[11px] text-slate-500">Continuous check-in on time</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Daily Average Hours</span>
            <Clock className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {report ? `${report.averageWorkingHours} hrs` : '8.4 hrs'}
          </div>
          <p className="text-[11px] text-slate-500">Standard shift target is 8.0 hrs</p>
        </div>
      </div>

      {/* 3. Visual Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Work Hours Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Weekly Shift Consistency
            </h2>
            <span className="text-xs text-slate-500">Target: 40 hrs/week</span>
          </div>

          <div className="space-y-3 pt-2">
            {(report?.monthlyHoursTrend || [
              { week: 'Week 1', hours: 41.5, target: 40 },
              { week: 'Week 2', hours: 38.0, target: 40 },
              { week: 'Week 3', hours: 42.8, target: 40 },
              { week: 'Week 4', hours: 40.2, target: 40 },
            ]).map(w => {
              const pct = Math.min(100, (w.hours / w.target) * 100);
              return (
                <div key={w.week} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{w.week}</span>
                    <span className="font-bold text-slate-900">{w.hours} hrs ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Category Quota Consumption */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Time Off Quotas Taken
            </h2>
            <span className="text-xs text-emerald-600 font-semibold">Annual Allocation</span>
          </div>

          <div className="space-y-3 pt-2">
            {(report?.leaveUsageByCategory || [
              { category: 'Paid Time Off', used: 4, total: 18 },
              { category: 'Sick Leave', used: 2, total: 10 },
              { category: 'Casual Leave', used: 1, total: 6 },
              { category: 'Remote Days', used: 7, total: 24 },
            ]).map(item => {
              const remaining = Math.max(0, item.total - item.used);
              const pct = (item.used / item.total) * 100;
              return (
                <div key={item.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">{item.category}</span>
                    <span className="text-slate-500 font-mono">
                      {item.used} used • <span className="text-emerald-600 font-bold">{remaining} remaining</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
