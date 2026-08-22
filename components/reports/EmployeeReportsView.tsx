'use client';

import React, { useState } from 'react';
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
  Building,
  PieChart,
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export function EmployeeReportsView() {
  const { employee } = useEmployee();

  if (!employee) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Workforce Intelligence
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Personal Performance & Attendance Reports
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Data-backed breakdown of your working patterns, punctuality streaks, shift hours, and leave utilization.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => window.print()}
          leftIcon={<Printer size={16} />}
          className="w-full md:w-auto"
        >
          Print Report Summary
        </Button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E1035]/60">Attendance Rate</span>
            <CheckCheck className="w-4 h-4 text-[#7B2CBF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#1E1035]">
            98.5%
          </div>
          <p className="text-[11px] text-[#1E1035]/50">
            21 days on duty / 21 workdays
          </p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E1035]/60">Punctuality Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            96.4%
          </div>
          <p className="text-[11px] text-[#1E1035]/50">
            Exceeds team baseline of 90%
          </p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E1035]/60">On-Time Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600">
            18 Days
          </div>
          <p className="text-[11px] text-[#1E1035]/50">
            Consecutive on-time punches
          </p>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1E1035]/60">Avg Shift Duration</span>
            <Clock className="w-4 h-4 text-[#7B2CBF]" />
          </div>
          <div className="text-2xl font-extrabold text-[#7B2CBF]">
            8.4 hrs
          </div>
          <p className="text-[11px] text-[#1E1035]/50">
            Per scheduled workday
          </p>
        </Card>
      </div>

      {/* Performance Charts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Weekly Hours Distribution"
            subtitle="Verified hours logged across August 2026"
            icon={<BarChart3 size={18} />}
          />

          <div className="space-y-4 pt-2">
            {[
              { label: 'Week 1 (Aug 1 - Aug 7)', hours: 41.5, target: 40 },
              { label: 'Week 2 (Aug 8 - Aug 14)', hours: 40.0, target: 40 },
              { label: 'Week 3 (Aug 15 - Aug 21)', hours: 38.5, target: 40 },
            ].map((week) => {
              const percent = Math.min(100, Math.round((week.hours / week.target) * 100));
              return (
                <div key={week.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1E1035]">{week.label}</span>
                    <span className="font-mono font-bold text-[#7B2CBF]">
                      {week.hours} / {week.target} hrs ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F7F4FA] h-2.5 rounded-full overflow-hidden border border-[#E8E2F0]">
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

        <Card>
          <CardHeader
            title="Leave Utilization Summary"
            subtitle="Annual allocation and remaining time off"
            icon={<PieChart size={18} />}
          />

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-blue-900">Paid Leave (Vacation)</h4>
                <p className="text-[11px] text-blue-800">18 days available / 18 credited</p>
              </div>
              <span className="text-sm font-extrabold text-blue-900">100% Left</span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-orange-900">Sick Leave (Medical)</h4>
                <p className="text-[11px] text-orange-800">10 days available / 10 credited</p>
              </div>
              <span className="text-sm font-extrabold text-orange-900">100% Left</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#1E1035]">Unpaid Discretionary Leave</h4>
                <p className="text-[11px] text-[#1E1035]/60">0 days utilized this year</p>
              </div>
              <span className="text-sm font-extrabold text-[#7B2CBF]">0 Days</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
