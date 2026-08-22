'use client';

import React, { useState } from 'react';
import { AttendanceRecord, WorkMode } from '@/types/hrms';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Building,
  ShieldCheck,
  FileText,
  UserCheck,
  TrendingUp,
  MapPin,
  CalendarClock,
  Sparkles,
  ArrowRight,
  Send,
  Coffee,
  Check,
} from 'lucide-react';

interface AttendanceDateModalProps {
  date: string;
  record: AttendanceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckInToday?: (mode: WorkMode) => void;
  onCheckOutToday?: () => void;
  isToday?: boolean;
}

// Known statutory holidays for 2026
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

export function AttendanceDateModal({
  date,
  record,
  isOpen,
  onClose,
  isToday,
}: AttendanceDateModalProps) {
  const [isRegularizing, setIsRegularizing] = useState(false);
  const [regularizeReason, setRegularizeReason] = useState('');
  const [regularizeSubmitted, setRegularizeSubmitted] = useState(false);

  if (!isOpen) return null;

  // Format human-friendly date string
  const dateObj = new Date(date + 'T00:00:00');
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : date;

  const dayOfWeek = !isNaN(dateObj.getTime()) ? dateObj.getDay() : -1;
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const holidayName = HOLIDAYS_2026[date];

  // Duration formatting
  const formatDuration = (mins?: number) => {
    if (!mins) return '0 hrs 0 mins';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h} hr${h !== 1 ? 's' : ''} ${m} min${m !== 1 ? 's' : ''}`;
  };

  const getStatusBadge = (status?: string) => {
    if (holidayName) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          🎉 Holiday: {holidayName}
        </span>
      );
    }

    if (!status) {
      if (isWeekend) {
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Weekend / Non-Working Day
          </span>
        );
      }
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          No Punch Record
        </span>
      );
    }

    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Present (On-Time)
          </span>
        );
      case 'late':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Late Arrival (Within Grace)
          </span>
        );
      case 'half_day':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            Half Day Shift
          </span>
        );
      case 'on_leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
            Approved Leave
          </span>
        );
      case 'absent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Absent / Unlogged
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 capitalize">
            {status}
          </span>
        );
    }
  };

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regularizeReason.trim()) return;
    setRegularizeSubmitted(true);
    setTimeout(() => {
      setIsRegularizing(false);
      setRegularizeSubmitted(false);
      setRegularizeReason('');
    }, 2000);
  };

  return (
    <div
      id="dayflow-attendance-date-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{formattedDate}</h2>
                {isToday && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-500 text-white">
                    Today
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete Shift Breakdown, Punches & Policy Compliance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-5">
          {/* Status & Work Mode Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Day Status:</span>
              {getStatusBadge(record?.status)}
            </div>

            {record && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                {record.workMode === 'remote' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-sky-700 shadow-2xs">
                    <Laptop className="w-3.5 h-3.5" /> Remote Work (WFH)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                    <Building className="w-3.5 h-3.5" /> In-Office HQ
                  </span>
                )}
              </div>
            )}
          </div>

          {/* If record exists, show timestamp cards */}
          {record ? (
            <div className="space-y-4">
              {/* Timing Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Check In Box */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Check-In Punch
                  </span>
                  <div className="text-base font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>{record.checkIn || '—'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    {record.isOnTime ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> On-time arrival
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Grace window applied
                      </span>
                    )}
                  </div>
                </div>

                {/* Check Out Box */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Check-Out Punch
                  </span>
                  <div className="text-base font-mono font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-rose-500" />
                    <span>{record.checkOut || (isToday ? 'Shift in progress' : '—')}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {record.checkOut ? 'Shift officially concluded' : 'Active working session'}
                  </div>
                </div>
              </div>

              {/* Total Working Duration & Quota */}
              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/80 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-600" />
                    <div>
                      <span className="font-bold text-sky-950 block">Logged Working Duration</span>
                      <span className="text-[11px] text-sky-700">Daily threshold: 8.5 hours</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold font-mono text-sky-950 block">
                      {formatDuration(record.durationMinutes)}
                    </span>
                    <span className="text-[10px] font-semibold text-sky-800">
                      {record.durationMinutes
                        ? `${(record.durationMinutes / 60).toFixed(1)} hrs logged`
                        : '0.0 hrs'}
                    </span>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2 rounded-full bg-sky-200 overflow-hidden">
                  <div
                    className="h-full bg-sky-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((record.durationMinutes || 0) / 510) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Visual Shift Timeline */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Punch Timeline Breakdown
                </span>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>In: {record.checkIn || '—'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <Coffee className="w-3 h-3" />
                    <span className="text-[10px]">1h Lunch Break</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Out: {record.checkOut || (isToday ? 'Now' : '—')}</span>
                  </div>
                </div>
              </div>

              {/* Shift Notes / Activities */}
              {record.notes && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Shift Notes & Logs
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">{record.notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* Empty state for days with no punch record */
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-slate-800">
                {holidayName
                  ? `Official Holiday (${holidayName})`
                  : isWeekend
                  ? 'Weekend Non-Working Day'
                  : 'No Recorded Check-in'}
              </h3>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                {holidayName
                  ? 'Paid statutory company holiday. No punches required.'
                  : isWeekend
                  ? 'Standard company working days are Monday through Friday.'
                  : 'No attendance punch was logged for this date. You can request attendance regularization below.'}
              </p>
            </div>
          )}

          {/* Regularization Form / Button */}
          {!isWeekend && !holidayName && (
            <div className="pt-2 border-t border-slate-100">
              {!isRegularizing ? (
                <button
                  type="button"
                  onClick={() => setIsRegularizing(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Request Attendance Regularization for this date</span>
                </button>
              ) : regularizeSubmitted ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Regularization request submitted to HR & Manager!</span>
                </div>
              ) : (
                <form onSubmit={handleRegularizeSubmit} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    Submit Attendance Regularization
                  </span>
                  <textarea
                    rows={2}
                    value={regularizeReason}
                    onChange={e => setRegularizeReason(e.target.value)}
                    placeholder="Provide reason for missing/late punch (e.g., Client meeting offsite, biometric gate malfunction)..."
                    className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    required
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRegularizing(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit Request</span>
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
              <span className="font-semibold text-slate-800">Policy:</span> Core shift is 09:00 AM – 06:00 PM with 15 min grace (09:15 AM). Regularization requests are approved by your direct reporting manager.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
