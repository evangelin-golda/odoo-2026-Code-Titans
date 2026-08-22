'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  X,
  CalendarDays,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { LeaveType } from '@/types/hrms';

export function ApplyLeaveModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { employee, refreshEmployeeData } = useEmployee();
  const { showToast } = useToast();

  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayType, setHalfDayType] = useState<'first_half' | 'second_half'>('first_half');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !employee) return null;

  // Calculate estimated days
  const calculateDays = () => {
    if (isHalfDay) return 0.5;
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const estimatedDays = calculateDays();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    if (estimatedDays <= 0) {
      setErrorMessage('End date cannot be prior to start date.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          leaveType,
          startDate,
          endDate: isHalfDay ? startDate : endDate,
          isHalfDay,
          halfDayType: isHalfDay ? halfDayType : undefined,
          reason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Leave application submitted for approval!', 'success');
        await refreshEmployeeData();
        onClose();
        // Reset form
        setStartDate('');
        setEndDate('');
        setReason('');
        setIsHalfDay(false);
      } else {
        setErrorMessage(data.error || 'Failed to submit leave application');
        showToast(data.error || 'Submission failed', 'error');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="dayflow-apply-leave-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Apply for Leave / Time Off
              </h2>
              <p className="text-xs text-slate-500">
                Submit an absence request for manager review
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Leave Category
            </label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as LeaveType)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            >
              <option value="annual">Annual Paid Leave (Vacation)</option>
              <option value="sick">Medical / Sick Leave</option>
              <option value="casual">Casual / Emergency Leave</option>
              <option value="remote_wfh">Remote / Work-from-Home Request</option>
              <option value="maternity_paternity">Maternity / Paternity Leave</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          {/* Half day toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 block">
                Half-Day Request
              </span>
              <span className="text-[11px] text-slate-500 block">
                Take only 0.5 day (morning or afternoon shift)
              </span>
            </div>
            <input
              type="checkbox"
              checked={isHalfDay}
              onChange={e => setIsHalfDay(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
            />
          </div>

          {/* Date range inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isHalfDay ? 'Date' : 'Start Date'}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => {
                  setStartDate(e.target.value);
                  if (isHalfDay) setEndDate(e.target.value);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
            </div>

            {!isHalfDay ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shift Half
                </label>
                <select
                  value={halfDayType}
                  onChange={e => setHalfDayType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                >
                  <option value="first_half">First Half (Morning 9am-1pm)</option>
                  <option value="second_half">Second Half (Afternoon 2pm-6pm)</option>
                </select>
              </div>
            )}
          </div>

          {/* Days summary calculation pill */}
          {estimatedDays > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <span>Total Requested Duration:</span>
              <span className="font-bold">
                {estimatedDays} {estimatedDays === 1 ? 'Working Day' : 'Working Days'}
              </span>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for Absence
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Please provide brief context for your reporting manager..."
              className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || estimatedDays <= 0}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
