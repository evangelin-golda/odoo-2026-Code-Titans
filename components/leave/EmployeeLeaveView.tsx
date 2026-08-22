'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Filter,
  Trash2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { LeaveBalance, LeaveRequest } from '@/types/hrms';

export function EmployeeLeaveView() {
  const { employee, setOpenApplyLeaveModal } = useEmployee();
  const { showToast } = useToast();

  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaveData = useCallback(async () => {
    if (!employee) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leave?employeeId=${employee.employeeId}`);
      const data = await res.json();
      if (data.success) {
        setBalances(data.balances);
        setRequests(data.requests);
      }
    } catch (err) {
      console.error('Error fetching leave data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [employee]);

  useEffect(() => {
    fetchLeaveData();
  }, [fetchLeaveData]);

  const handleCancelRequest = async (requestId: string) => {
    if (!employee) return;
    if (!confirm('Are you sure you want to cancel this pending leave request?')) return;

    try {
      const res = await fetch(
        `/api/leave?employeeId=${employee.employeeId}&leaveId=${requestId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (data.success) {
        showToast('Leave request cancelled successfully', 'success');
        fetchLeaveData();
      } else {
        showToast(data.error || 'Failed to cancel request', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error cancelling request', 'error');
    }
  };

  const filteredRequests = requests.filter(req => {
    if (filterStatus === 'all') return true;
    return req.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div id="dayflow-employee-leave-view" className="space-y-6">
      {/* 1. Header with Apply Leave Action */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Time Off & Absence Management
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Leave Balances & Applications
            </h1>
            <p className="text-xs text-slate-500">
              Apply for planned vacations, sick leaves, and monitor manager approvals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenApplyLeaveModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* 2. Leave Balances Grid (Light Theme Cards with Progress Bars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {balances.map(b => {
          const usedPct = b.totalAllowed > 0 ? (b.used / b.totalAllowed) * 100 : 0;
          return (
            <div
              key={b.type}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {b.name}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {b.totalAllowed} Total
                </span>
              </div>

              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {b.available}{' '}
                  <span className="text-xs font-normal text-slate-500">Days Available</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {b.used} Used • {b.pending} Pending
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, 100 - usedPct))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{b.used} days taken</span>
                  <span>{b.available} remaining</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Leave Requests Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Submitted Leave Applications
            </h2>
            <p className="text-xs text-slate-500">
              Review application details and manager approval status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">No leave applications found for selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Days</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 uppercase">
                      {req.leaveType}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {req.startDate} to {req.endDate}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{req.appliedDate}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          req.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => handleCancelRequest(req.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 p-1 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Cancel Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400">Processed</span>
                      )}
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
