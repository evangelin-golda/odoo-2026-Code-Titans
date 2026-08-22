'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  CalendarDays,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { LeaveStatusBadge, LeaveTypeBadge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';

export function EmployeeLeaveView() {
  const { employee, setOpenApplyLeaveModal } = useEmployee();
  const { showToast } = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaveData = useCallback(async () => {
    if (!employee) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leaves?employeeId=${employee.employeeId}`);
      const data = await res.json();
      if (data.success && data.requests) {
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
        `/api/leaves?employeeId=${employee.employeeId}&leaveId=${requestId}`,
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

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === 'all') return true;
    return req.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const paidApproved = requests
    .filter((r) => (r.leaveType === 'paid' || r.type === 'paid') && r.status === 'approved')
    .reduce((acc, curr) => acc + (curr.totalDays || 1), 0);

  const sickApproved = requests
    .filter((r) => (r.leaveType === 'sick' || r.type === 'sick') && r.status === 'approved')
    .reduce((acc, curr) => acc + (curr.totalDays || 1), 0);

  const unpaidApproved = requests
    .filter((r) => (r.leaveType === 'unpaid' || r.type === 'unpaid') && r.status === 'approved')
    .reduce((acc, curr) => acc + (curr.totalDays || 1), 0);

  const paidRemaining = Math.max(0, 18 - paidApproved);
  const sickRemaining = Math.max(0, 10 - sickApproved);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Banner with Balances & CTA */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Time-Off & Leave Management
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Leave Requests & Balances
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Submit time-off requests for paid leave, medical sick leave, or unpaid personal leaves with fast-track HR review.
          </p>
        </div>

        <Button
          id="open-apply-leave-btn"
          size="lg"
          onClick={() => setOpenApplyLeaveModal(true)}
          leftIcon={<PlusCircle size={18} />}
          className="w-full md:w-auto"
        >
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
              Paid Leave Balance
            </span>
            <p className="text-2xl font-extrabold text-[#7B2CBF] mt-1">
              {paidRemaining} <span className="text-xs font-medium text-[#1E1035]/50">/ 18 days left</span>
            </p>
            <span className="text-[11px] text-[#1E1035]/50 block mt-1">
              {paidApproved} days utilized this year
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
            PL
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
              Sick Leave Balance
            </span>
            <p className="text-2xl font-extrabold text-orange-600 mt-1">
              {sickRemaining} <span className="text-xs font-medium text-[#1E1035]/50">/ 10 days left</span>
            </p>
            <span className="text-[11px] text-[#1E1035]/50 block mt-1">
              {sickApproved} days utilized this year
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center font-bold">
            SL
          </div>
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
              Unpaid Leave Utilized
            </span>
            <p className="text-2xl font-extrabold text-slate-700 mt-1">
              {unpaidApproved} <span className="text-xs font-medium text-[#1E1035]/50">days</span>
            </p>
            <span className="text-[11px] text-[#1E1035]/50 block mt-1">
              Subject to HR & payroll policy
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
            UL
          </div>
        </Card>
      </div>

      {/* Leave Application History Table */}
      <Card>
        <CardHeader
          title="My Leave Request History"
          subtitle="Real-time status updates and HR review comments"
          icon={<CalendarDays size={18} />}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Date Range</TableHead>
              <TableHead>Total Days</TableHead>
              <TableHead>Remarks / Reason</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Approval Status</TableHead>
              <TableHead>HR Review & Feedback</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-[#1E1035]/50">
                  No leave requests filed yet. Click "Apply for Leave" above to create one.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <LeaveTypeBadge type={req.leaveType || req.type || 'paid'} />
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-[#1E1035] whitespace-nowrap">
                    {req.startDate} → {req.endDate}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-[#1E1035]">
                    {req.totalDays || 1} {req.totalDays === 1 ? 'day' : 'days'}
                  </TableCell>
                  <TableCell className="text-xs text-[#1E1035]/75 max-w-xs">
                    {req.remarks || req.reason}
                  </TableCell>
                  <TableCell className="text-xs text-[#1E1035]/60 whitespace-nowrap">
                    {req.appliedOn || req.createdAt || '2026-08-20'}
                  </TableCell>
                  <TableCell>
                    <LeaveStatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-xs text-[#1E1035]/70 max-w-xs">
                    {req.hrComments || req.reviewComments ? (
                      <div>
                        <span className="font-semibold text-[#1E1035] block">
                          {req.reviewedBy || 'HR Lead'}
                        </span>
                        <span className="italic text-[11px]">"{req.hrComments || req.reviewComments}"</span>
                      </div>
                    ) : (
                      <span className="text-[#1E1035]/40 italic">Awaiting HR review</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'pending' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelRequest(req.id)}
                        className="text-xs text-rose-600 hover:bg-rose-50 p-1"
                        title="Cancel this request"
                      >
                        <Trash2 size={14} />
                      </Button>
                    ) : (
                      <span className="text-[11px] text-[#1E1035]/40">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
