'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  CreditCard,
  Download,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle2,
  Lock,
  Eye,
  Building,
  Printer,
  X,
} from 'lucide-react';
import { Payslip, SalaryStructure } from '@/types/hrms';

export function EmployeeSalaryView() {
  const { employee } = useEmployee();
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!employee) return;
    setIsLoading(true);
    fetch(`/api/salary?employeeId=${employee.employeeId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSalaryStructure(data.salaryStructure);
          setPayslips(data.payslips);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [employee]);

  if (!employee) return null;

  return (
    <div id="dayflow-employee-salary-view" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Payroll & Earnings
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Salary Structure & Payslip Archives
            </h1>
            <p className="text-xs text-slate-500">
              Review your monthly compensation breakdown, statutory tax deductions, and verified pay stubs.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Confidential Employee Record</span>
          </div>
        </div>
      </div>

      {/* 2. Salary Breakdown Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Gross Monthly Pay
          </span>
          <div className="text-2xl font-bold text-slate-900">
            ${salaryStructure
              ? (
                  salaryStructure.baseMonthly +
                  salaryStructure.hra +
                  salaryStructure.specialAllowance +
                  salaryStructure.performanceBonus
                ).toLocaleString()
              : '20,300'}
          </div>
          <p className="text-[11px] text-slate-500">
            Base + HRA + Special Allowances
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Statutory Deductions
          </span>
          <div className="text-2xl font-bold text-rose-600">
            -${salaryStructure
              ? (
                  salaryStructure.providentFund +
                  salaryStructure.professionalTax +
                  salaryStructure.healthInsurance
                ).toLocaleString()
              : '2,000'}
          </div>
          <p className="text-[11px] text-slate-500">
            PF + Health Insurance + Prof Tax
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Net Take-Home Salary
          </span>
          <div className="text-2xl font-bold text-emerald-950">
            ${salaryStructure ? salaryStructure.netMonthly.toLocaleString() : '16,720'}
          </div>
          <p className="text-[11px] text-emerald-700">
            Credited directly to Bank on 30th/31st
          </p>
        </div>
      </div>

      {/* 3. Detailed Component Breakdown Table */}
      {salaryStructure && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Component-Wise Compensation Breakdown
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Currency: {salaryStructure.currency}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
                1. Earnings / Allowances
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-semibold text-slate-900">
                    ${salaryStructure.baseMonthly.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">House Rent Allowance (HRA)</span>
                  <span className="font-semibold text-slate-900">
                    ${salaryStructure.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Special Allowance</span>
                  <span className="font-semibold text-slate-900">
                    ${salaryStructure.specialAllowance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Performance Incentive</span>
                  <span className="font-semibold text-slate-900">
                    ${salaryStructure.performanceBonus.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 font-bold text-slate-900 text-sm">
                  <span>Total Earnings</span>
                  <span>
                    $
                    {(
                      salaryStructure.baseMonthly +
                      salaryStructure.hra +
                      salaryStructure.specialAllowance +
                      salaryStructure.performanceBonus
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider pb-1 border-b border-slate-100">
                2. Statutory Deductions
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Provident Fund (Employee PF)</span>
                  <span className="font-semibold text-rose-600">
                    -${salaryStructure.providentFund.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Health / Medical Insurance</span>
                  <span className="font-semibold text-rose-600">
                    -${salaryStructure.healthInsurance.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Professional Tax</span>
                  <span className="font-semibold text-rose-600">
                    -${salaryStructure.professionalTax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-6 font-bold text-rose-700 text-sm">
                  <span>Total Deductions</span>
                  <span>
                    -$
                    {(
                      salaryStructure.providentFund +
                      salaryStructure.healthInsurance +
                      salaryStructure.professionalTax
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Payslip Archive History List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Monthly Payslip Archives
            </h2>
            <p className="text-xs text-slate-500">
              Download and view authenticated PDF salary slips generated by Odoo Payroll
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Gross Pay</th>
                <th className="py-3 px-4">Deductions</th>
                <th className="py-3 px-4">Net Paid</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payslips.map(ps => (
                <tr key={ps.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>{ps.month}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    ${ps.grossPay.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-rose-600">
                    -${ps.totalDeductions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                    ${ps.netPay.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{ps.payDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 capitalize">
                      {ps.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPayslip(ps)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Interactive Payslip Viewer Modal */}
      {selectedPayslip && (
        <div
          id="dayflow-payslip-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official Salary Slip — {selectedPayslip.month}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dayflow HRMS Payroll Engine • Reference #{selectedPayslip.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payslip Document Body */}
            <div className="mt-6 p-6 rounded-xl bg-slate-50/70 border border-slate-200 space-y-6 text-xs">
              {/* Company & Employee Identity */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">DAYFLOW CORP</h4>
                  <p className="text-slate-500">Every workday, perfectly aligned.</p>
                  <p className="text-slate-500">Odoo Hackathon 2026 Edition</p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-900 block">{employee.name}</span>
                  <span className="text-slate-500 font-mono block">ID: {employee.employeeId}</span>
                  <span className="text-slate-500 block">{employee.jobPosition}</span>
                </div>
              </div>

              {/* Earnings & Deductions Columns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-bold text-slate-900 block mb-2">EARNINGS</span>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Basic Pay:</span>
                      <span className="font-mono text-slate-900">
                        ${selectedPayslip.breakdown.basic.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>HRA:</span>
                      <span className="font-mono text-slate-900">
                        ${selectedPayslip.breakdown.hra.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Special Allowance:</span>
                      <span className="font-mono text-slate-900">
                        ${selectedPayslip.breakdown.specialAllowance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Incentives:</span>
                      <span className="font-mono text-slate-900">
                        ${selectedPayslip.breakdown.bonus.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-2">DEDUCTIONS</span>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Provident Fund:</span>
                      <span className="font-mono text-rose-600">
                        -${selectedPayslip.breakdown.providentFund.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (TDS):</span>
                      <span className="font-mono text-rose-600">
                        -${selectedPayslip.breakdown.taxDeducted.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Health Insurance:</span>
                      <span className="font-mono text-rose-600">
                        -${selectedPayslip.breakdown.healthInsurance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Take-Home */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Net Paid to Account
                  </span>
                  <span className="text-xl font-bold text-emerald-700">
                    ${selectedPayslip.netPay.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <span>Paid on: {selectedPayslip.payDate}</span>
                  <span className="block text-emerald-600 font-semibold">
                    ✓ Verified by Bank Transfer
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
