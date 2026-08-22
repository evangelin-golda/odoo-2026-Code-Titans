'use client';

import React, { useState } from 'react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { LeaveRequest, LeaveStatus } from '../../types/dayflowTypes';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Avatar } from '../ui/Avatar';
import { LeaveStatusBadge, LeaveTypeBadge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Modal } from '../ui/Modal';

export const HRLeaveApprovals: React.FC = () => {
  const { leaveRequests, approveLeave, rejectLeave } = useHRMS();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal review state
  const [activeReviewRequest, setActiveReviewRequest] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.remarks.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;

  const handleOpenReview = (req: LeaveRequest, action: 'approve' | 'reject') => {
    setActiveReviewRequest(req);
    setReviewAction(action);
    setReviewComment(
      action === 'approve'
        ? 'Approved. Please coordinate coverage with your team.'
        : 'Unfortunately, this conflicts with critical project milestones.'
    );
  };

  const handleConfirmDecision = () => {
    if (!activeReviewRequest) return;

    if (reviewAction === 'approve') {
      approveLeave(activeReviewRequest.id, reviewComment);
    } else {
      rejectLeave(activeReviewRequest.id, reviewComment);
    }

    setActiveReviewRequest(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Leave Governance
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Leave Approvals & Management
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Review submitted employee time-off requests, authorize coverage, provide feedback remarks, and maintain workforce capacity.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] p-2 rounded-xl border border-[#E8E2F0] shadow-xs">
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Pending
            </span>
            <span className="text-base font-extrabold text-amber-900">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Approved
            </span>
            <span className="text-base font-extrabold text-emerald-900">{approvedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
              Rejected
            </span>
            <span className="text-base font-extrabold text-rose-900">{rejectedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            id="hr-leave-search"
            placeholder="Search by employee, ID, or remarks..."
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            id="hr-leave-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { label: `All Requests (${leaveRequests.length})`, value: 'all' },
              { label: `Pending Action (${pendingCount})`, value: 'pending' },
              { label: `Approved (${approvedCount})`, value: 'approved' },
              { label: `Rejected (${rejectedCount})`, value: 'rejected' },
            ]}
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-[#7B2CBF] text-white border-[#7B2CBF]'
                  : 'bg-[#F7F4FA] text-[#1E1035]/70 border-[#E8E2F0] hover:bg-[#FFFFFF]'
              }`}
            >
              Only Pending ({pendingCount})
            </button>
          </div>
        </div>
      </Card>

      {/* Main Leave Requests Table */}
      <Card>
        <CardHeader
          title="Submitted Leave Requests"
          subtitle={`Showing ${filteredRequests.length} applications`}
          icon={<CheckSquare size={18} />}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Leave Type</TableHead>
              <TableHead>Duration / Dates</TableHead>
              <TableHead>Total Days</TableHead>
              <TableHead>Employee Remarks</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-[#1E1035]/50">
                  No leave requests found matching the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  {/* Employee */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={req.employeeAvatar}
                        name={req.employeeName}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1E1035]">
                          {req.employeeName}
                        </p>
                        <p className="text-[11px] font-mono text-[#7B2CBF]">
                          {req.employeeId}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Leave Type */}
                  <TableCell>
                    <LeaveTypeBadge type={req.leaveType} />
                  </TableCell>

                  {/* Dates */}
                  <TableCell className="text-xs font-semibold text-[#1E1035] whitespace-nowrap">
                    {req.startDate} → {req.endDate}
                  </TableCell>

                  {/* Days */}
                  <TableCell className="text-xs font-bold text-[#1E1035]">
                    {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                  </TableCell>

                  {/* Remarks */}
                  <TableCell className="text-xs text-[#1E1035]/75 max-w-xs">
                    <p className="line-clamp-2">{req.remarks}</p>
                    {req.hrComments && (
                      <span className="block mt-1 text-[11px] text-[#7B2CBF] italic">
                        HR: "{req.hrComments}"
                      </span>
                    )}
                  </TableCell>

                  {/* Applied Date */}
                  <TableCell className="text-xs text-[#1E1035]/50 whitespace-nowrap">
                    {req.appliedOn}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <LeaveStatusBadge status={req.status} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleOpenReview(req, 'approve')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1"
                        >
                          Approve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenReview(req, 'reject')}
                          className="text-xs text-rose-600 hover:bg-rose-50 border-rose-200 px-2.5 py-1"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#1E1035]/40 italic">
                        Resolved
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Review & Feedback Modal */}
      {activeReviewRequest && (
        <Modal
          isOpen={Boolean(activeReviewRequest)}
          onClose={() => setActiveReviewRequest(null)}
          title={
            reviewAction === 'approve'
              ? `Approve Leave: ${activeReviewRequest.employeeName}`
              : `Reject Leave: ${activeReviewRequest.employeeName}`
          }
          subtitle={`${activeReviewRequest.leaveType.toUpperCase()} Leave • ${activeReviewRequest.totalDays} Days (${activeReviewRequest.startDate} to ${activeReviewRequest.endDate})`}
          maxWidth="md"
          footer={
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setActiveReviewRequest(null)}
              >
                Cancel
              </Button>
              <Button
                size="md"
                onClick={handleConfirmDecision}
                className={
                  reviewAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }
              >
                Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] space-y-1.5">
              <span className="font-bold text-[#1E1035] block">
                Employee Reason:
              </span>
              <p className="text-[#1E1035]/80 italic leading-relaxed">
                "{activeReviewRequest.remarks}"
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="font-bold text-[#1E1035] block">
                HR Officer Comments / Feedback Remarks:
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Enter feedback or instructions that will be visible to the employee..."
                className="w-full text-xs text-[#1E1035] p-3 rounded-lg border border-[#E8E2F0] focus:ring-2 focus:ring-[#7B2CBF]/20 focus:border-[#7B2CBF] outline-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
