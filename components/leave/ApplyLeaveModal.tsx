'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { LeaveType } from '../../types/dayflowTypes';

export function ApplyLeaveModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { employee, refreshEmployeeData } = useEmployee();
  const { showToast } = useToast();

  const [leaveType, setLeaveType] = useState<LeaveType>('paid');
  const [startDate, setStartDate] = useState('2026-08-28');
  const [endDate, setEndDate] = useState('2026-08-29');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen || !employee) return null;

  const calculateDays = () => {
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

    if (!remarks.trim()) {
      setErrorMessage('Please provide a reason or remarks for your leave.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          leaveType,
          startDate,
          endDate,
          remarks,
          totalDays: estimatedDays,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Leave application submitted for approval!', 'success');
        await refreshEmployeeData();
        onClose();
        setRemarks('');
      } else {
        setErrorMessage(data.error || 'Failed to submit leave application');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apply for Leave / Time-Off"
      subtitle="Submit a request for management and HR approval"
      maxWidth="md"
      footer={
        <>
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        <Select
          label="Leave Category"
          required
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value as LeaveType)}
          options={[
            { label: 'Paid Leave (Annual / Vacation)', value: 'paid' },
            { label: 'Sick Leave (Medical / Health)', value: 'sick' },
            { label: 'Unpaid Leave (Personal / Sabbatical)', value: 'unpaid' },
          ]}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="p-3 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-between text-xs">
          <span className="text-[#1E1035]/70 font-medium">Calculated Working Days:</span>
          <span className="font-bold text-[#7B2CBF] text-sm font-mono">
            {estimatedDays} {estimatedDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[#1E1035] flex items-center justify-between">
            <span>Remarks & Reason</span>
            <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            placeholder="Provide a clear description of the leave purpose..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-xs text-[#1E1035] p-3 rounded-lg border border-[#E8E2F0] focus:ring-2 focus:ring-[#7B2CBF]/20 focus:border-[#7B2CBF] outline-none"
          />
        </div>
      </form>
    </Modal>
  );
}
