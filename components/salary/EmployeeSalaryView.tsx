'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  CreditCard,
  Lock,
  Download,
  FileText,
  DollarSign,
  Building2,
  Calendar,
  CheckCircle2,
  Printer,
  Info,
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Modal } from '../ui/Modal';

export function EmployeeSalaryView() {
  const { employee } = useEmployee();
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null);

  const salary = {
    baseSalary: 8500,
    hra: 1500,
    specialAllowance: 1000,
    transportAllowance: 350,
    grossSalary: 11350,
    pfDeduction: 680,
    taxDeduction: 1362,
    otherDeductions: 0,
    netSalary: 9308,
    bankName: 'Chase Bank NA',
    accountNumber: '•••• •••• 9921',
    ifscCode: 'CHASUS33XX',
    panNumber: 'USA-TAX-8891',
  };

  const pastSlips = [
    {
      id: 'slip-1',
      monthYear: 'August 2026',
      grossSalary: 11350,
      pfDeduction: 680,
      taxDeduction: 1362,
      netSalary: 9308,
      paymentStatus: 'Scheduled',
      paymentDate: '2026-08-31',
    },
    {
      id: 'slip-2',
      monthYear: 'July 2026',
      grossSalary: 11350,
      pfDeduction: 680,
      taxDeduction: 1362,
      netSalary: 9308,
      paymentStatus: 'Paid',
      paymentDate: '2026-07-31',
    },
    {
      id: 'slip-3',
      monthYear: 'June 2026',
      grossSalary: 11350,
      pfDeduction: 680,
      taxDeduction: 1362,
      netSalary: 9308,
      paymentStatus: 'Paid',
      paymentDate: '2026-06-30',
    },
  ];

  if (!employee) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Banner with Read-Only indicator */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Salary & Compensation
            </span>
            <span className="text-xs text-[#1E1035]/40">•</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E8E2F0] text-[#1E1035]/70 flex items-center gap-1">
              <Lock size={11} />
              <span>Read-Only Access</span>
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            My Payroll & Earnings
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Transparent breakdown of your agreed base pay, house rent allowance, statutory tax withholdings, and monthly payment stubs.
          </p>
        </div>

        {/* Current Month Net Pay Box */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-xl border border-[#E8E2F0] shadow-xs text-left sm:text-right w-full md:w-auto">
          <span className="text-[11px] font-bold text-[#1E1035]/60 uppercase tracking-wider block">
            August 2026 Net Take-Home
          </span>
          <p className="text-2xl font-extrabold text-[#7B2CBF] mt-0.5">
            ${salary.netSalary.toLocaleString()}{' '}
            <span className="text-xs font-medium text-[#1E1035]/60">USD</span>
          </p>
          <div className="flex items-center sm:justify-end gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
            <CheckCircle2 size={13} />
            <span>Scheduled for Direct Deposit Aug 31</span>
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2.5">
        <Info size={16} className="text-[#7B2CBF] shrink-0" />
        <span>
          <strong>Notice:</strong> Per organization policy, salary structures and compensation parameters are administered strictly by HR Administration.
        </span>
      </div>

      {/* Main Salary Structure Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Itemized Salary Structure */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title="Current Salary Structure"
              subtitle="Monthly earnings and statutory deductions"
              icon={<CreditCard size={18} />}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-[#E8E2F0]">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                  Total Gross Earnings
                </span>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                  ${salary.grossSalary.toLocaleString()}
                </p>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Pre-tax monthly compensation
                </span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider block">
                  Total Deductions
                </span>
                <p className="text-2xl font-extrabold text-rose-900 mt-1">
                  -${(salary.pfDeduction + salary.taxDeduction + salary.otherDeductions).toLocaleString()}
                </p>
                <span className="text-[11px] text-rose-700 block mt-0.5">
                  PF contributions & tax withholding
                </span>
              </div>
            </div>

            {/* Detailed Row Items */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1035]/60">
                Earnings Components
              </h4>
              <div className="space-y-2 text-xs divide-y divide-[#E8E2F0]">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#1E1035]/80 font-medium">Base Salary</span>
                  <span className="font-bold text-[#1E1035] font-mono">
                    ${salary.baseSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#1E1035]/80 font-medium">House Rent Allowance (HRA)</span>
                  <span className="font-bold text-[#1E1035] font-mono">
                    ${salary.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#1E1035]/80 font-medium">Special Allowance</span>
                  <span className="font-bold text-[#1E1035] font-mono">
                    ${salary.specialAllowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[#1E1035]/80 font-medium">Transport Allowance</span>
                  <span className="font-bold text-[#1E1035] font-mono">
                    ${salary.transportAllowance.toLocaleString()}
                  </span>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1035]/60 pt-3">
                Deductions & Withholdings
              </h4>
              <div className="space-y-2 text-xs divide-y divide-[#E8E2F0]">
                <div className="flex items-center justify-between py-2 text-rose-700">
                  <span className="font-medium">Provident Fund (PF) Deduction</span>
                  <span className="font-bold font-mono">
                    -${salary.pfDeduction.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 text-rose-700">
                  <span className="font-medium">Income Tax (TDS) Withholding</span>
                  <span className="font-bold font-mono">
                    -${salary.taxDeduction.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Banking & Disbursement Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Disbursement Account"
              subtitle="Direct deposit destination on file"
              icon={<Building2 size={18} />}
            />

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-[#1E1035]/60 block mb-0.5">Bank Institution</span>
                <p className="font-bold text-[#1E1035] text-sm">{salary.bankName}</p>
              </div>

              <div>
                <span className="text-[#1E1035]/60 block mb-0.5">Account Number</span>
                <p className="font-mono font-bold text-[#1E1035]">{salary.accountNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#1E1035]/60 block mb-0.5">Routing Code</span>
                  <p className="font-mono font-semibold text-[#1E1035]">{salary.ifscCode}</p>
                </div>
                <div>
                  <span className="text-[#1E1035]/60 block mb-0.5">Tax PAN / ID</span>
                  <p className="font-mono font-semibold text-[#1E1035]">{salary.panNumber}</p>
                </div>
              </div>

              <div className="p-3 bg-[#F7F4FA] border border-[#E8E2F0] rounded-lg">
                <span className="text-[11px] text-[#1E1035]/70 block">
                  To update direct deposit routing, submit a verified form to HR Administration.
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Pay Frequency Info */}
          <Card className="bg-[#F7F4FA] border border-[#E8E2F0]">
            <div className="flex items-center gap-2 mb-2 text-[#7B2CBF]">
              <Calendar size={18} />
              <h4 className="text-xs font-bold text-[#1E1035]">Payout Schedule</h4>
            </div>
            <p className="text-xs text-[#1E1035]/70 leading-relaxed">
              Standard payout disbursement occurs on the final business day of each calendar month.
            </p>
          </Card>
        </div>
      </div>

      {/* Pay Stubs History Table */}
      <Card>
        <CardHeader
          title="Past Pay Slips & Statements"
          subtitle="Downloadable salary statements for income verification"
          icon={<FileText size={18} />}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pay Period</TableHead>
              <TableHead>Gross Pay</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Disbursement</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Disbursement Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastSlips.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-bold text-xs text-[#1E1035]">
                  {record.monthYear}
                </TableCell>
                <TableCell className="text-xs font-mono font-medium">
                  ${record.grossSalary.toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-mono text-rose-700 font-medium">
                  -${(record.pfDeduction + record.taxDeduction).toLocaleString()}
                </TableCell>
                <TableCell className="text-xs font-bold font-mono text-[#7B2CBF]">
                  ${record.netSalary.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      record.paymentStatus === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {record.paymentStatus}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-[#1E1035]/70">
                  {record.paymentDate}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedSlip(record)}
                    leftIcon={<FileText size={14} />}
                  >
                    View Slip
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pay Slip Modal */}
      {selectedSlip && (
        <Modal
          isOpen={Boolean(selectedSlip)}
          onClose={() => setSelectedSlip(null)}
          title={`Pay Slip – ${selectedSlip.monthYear}`}
          subtitle={`Employee: ${employee.name} (${employee.employeeId})`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] text-[#1E1035]/50">
                Digitally generated by Dayflow HRMS
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => alert(`Printing pay slip for ${selectedSlip.monthYear}`)}
                  leftIcon={<Printer size={14} />}
                >
                  Print
                </Button>
                <Button
                  size="sm"
                  onClick={() => alert(`Downloading PDF statement for ${selectedSlip.monthYear}`)}
                  leftIcon={<Download size={14} />}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          }
        >
          <div className="p-6 space-y-6 bg-[#FFFFFF] border border-[#E8E2F0] rounded-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2F0]">
              <div>
                <h3 className="text-lg font-extrabold text-[#1E1035]">DAYFLOW HRMS</h3>
                <p className="text-xs text-[#1E1035]/60">Salary Slip for {selectedSlip.monthYear}</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-[#7B2CBF]">CONFIDENTIAL</p>
                <p className="text-[#1E1035]/50">Status: {selectedSlip.paymentStatus}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-[#F7F4FA] p-3.5 rounded-lg border border-[#E8E2F0]">
              <div>
                <span className="text-[#1E1035]/50 block">Name:</span>
                <span className="font-bold text-[#1E1035]">{employee.name}</span>
              </div>
              <div>
                <span className="text-[#1E1035]/50 block">Employee ID:</span>
                <span className="font-bold text-[#1E1035]">{employee.employeeId}</span>
              </div>
              <div>
                <span className="text-[#1E1035]/50 block">Department:</span>
                <span className="font-bold text-[#1E1035]">{employee.department}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-[#E8E2F0] rounded-lg overflow-hidden">
                <div className="bg-[#F7F4FA] px-3 py-2 font-bold text-[#1E1035] border-b border-[#E8E2F0]">
                  Earnings
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between">
                    <span>Base Salary</span>
                    <span className="font-mono font-bold">${salary.baseSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HRA</span>
                    <span className="font-mono font-bold">${salary.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Allowance</span>
                    <span className="font-mono font-bold">${salary.specialAllowance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#E8E2F0] font-bold text-emerald-800">
                    <span>Gross Earnings</span>
                    <span className="font-mono">${selectedSlip.grossSalary.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border border-[#E8E2F0] rounded-lg overflow-hidden">
                <div className="bg-[#F7F4FA] px-3 py-2 font-bold text-[#1E1035] border-b border-[#E8E2F0]">
                  Deductions
                </div>
                <div className="p-3 space-y-2">
                  <div className="flex justify-between text-rose-700">
                    <span>PF Contribution</span>
                    <span className="font-mono font-bold">-${selectedSlip.pfDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Income Tax</span>
                    <span className="font-mono font-bold">-${selectedSlip.taxDeduction.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-6 border-t border-[#E8E2F0] font-bold text-rose-800">
                    <span>Total Deductions</span>
                    <span className="font-mono">-${(selectedSlip.pfDeduction + selectedSlip.taxDeduction).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#1E1035]/70 uppercase tracking-wider">
                  Net Disbursement Amount
                </span>
                <p className="text-xs text-[#1E1035]/50">Transferred via ACH Direct Deposit</p>
              </div>
              <span className="text-2xl font-extrabold text-[#7B2CBF] font-mono">
                ${selectedSlip.netSalary.toLocaleString()} USD
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
