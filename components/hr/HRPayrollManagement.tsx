'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  Edit2,
  Download,
  Building,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
  Lock,
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee, SalaryStructure } from '../../types/dayflowTypes';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Avatar } from '../ui/Avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Modal } from '../ui/Modal';

export const HRPayrollManagement: React.FC = () => {
  const { employees, payrollRecords, updateEmployeeFull } = useHRMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Salary editing modal state
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editBase, setEditBase] = useState(0);
  const [editHra, setEditHra] = useState(0);
  const [editSpecial, setEditSpecial] = useState(0);
  const [editTransport, setEditTransport] = useState(0);
  const [editPf, setEditPf] = useState(0);
  const [editTax, setEditTax] = useState(0);
  const [editOther, setEditOther] = useState(0);
  const [editBank, setEditBank] = useState('');
  const [editAccount, setEditAccount] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const departments = Array.from(new Set(employees.map((e) => e.jobDetails.department)));

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.personalDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobDetails.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      departmentFilter === 'all' || emp.jobDetails.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  // Calculate high-level payroll aggregate metrics
  const totalBase = employees.reduce((acc, curr) => acc + curr.salaryStructure.baseSalary, 0);
  const totalGross = employees.reduce((acc, curr) => acc + curr.salaryStructure.grossSalary, 0);
  const totalDeductions = employees.reduce(
    (acc, curr) =>
      acc +
      curr.salaryStructure.pfDeduction +
      curr.salaryStructure.taxDeduction +
      curr.salaryStructure.otherDeductions,
    0
  );
  const totalNet = employees.reduce((acc, curr) => acc + curr.salaryStructure.netSalary, 0);

  const handleOpenEditSalary = (emp: Employee) => {
    setEditingEmployee(emp);
    const s = emp.salaryStructure;
    setEditBase(s.baseSalary);
    setEditHra(s.hra);
    setEditSpecial(s.specialAllowance);
    setEditTransport(s.transportAllowance);
    setEditPf(s.pfDeduction);
    setEditTax(s.taxDeduction);
    setEditOther(s.otherDeductions);
    setEditBank(s.bankName);
    setEditAccount(s.accountNumber);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const gross =
      Number(editBase) + Number(editHra) + Number(editSpecial) + Number(editTransport);
    const totalDed = Number(editPf) + Number(editTax) + Number(editOther);
    const net = gross - totalDed;

    const updatedEmployee: Employee = {
      ...editingEmployee,
      salaryStructure: {
        ...editingEmployee.salaryStructure,
        baseSalary: Number(editBase),
        hra: Number(editHra),
        specialAllowance: Number(editSpecial),
        transportAllowance: Number(editTransport),
        grossSalary: gross,
        pfDeduction: Number(editPf),
        taxDeduction: Number(editTax),
        otherDeductions: Number(editOther),
        netSalary: net,
        bankName: editBank,
        accountNumber: editAccount,
      },
    };

    updateEmployeeFull(updatedEmployee);
    setEditingEmployee(null);
    setSaveSuccessMsg(`Salary structure updated successfully for ${editingEmployee.personalDetails.name}.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Compensation Management
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Payroll & Salary Governance
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Administer base salaries, calculate statutory withholdings, adjust allowances, and ensure accurate direct deposit disbursements.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => alert('Exporting August 2026 Payroll Summary')}
          leftIcon={<FileSpreadsheet size={16} />}
          className="w-full md:w-auto"
        >
          Export Payroll Report (CSV)
        </Button>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Aggregate KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            Total Monthly Gross Payroll
          </span>
          <p className="text-2xl font-extrabold text-[#1E1035] mt-1">
            ${totalGross.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#1E1035]/50 block mt-1">
            Includes base, HRA, & standard allowances
          </span>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            Total Statutory Deductions
          </span>
          <p className="text-2xl font-extrabold text-rose-700 mt-1">
            -${totalDeductions.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#1E1035]/50 block mt-1">
            PF contributions & income tax withholdings
          </span>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-[#1E1035]/60 uppercase tracking-wider block">
            Total Net Disbursement
          </span>
          <p className="text-2xl font-extrabold text-[#7B2CBF] mt-1">
            ${totalNet.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
            Ready for August 31 Payout
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="hr-payroll-search"
            placeholder="Search employee by name, ID, or title..."
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            id="hr-payroll-dept-filter"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { label: 'All Departments', value: 'all' },
              ...departments.map((d) => ({ label: d, value: d })),
            ]}
          />
        </div>
      </Card>

      {/* Payroll Roster Table */}
      <Card>
        <CardHeader
          title="Employee Compensation Table"
          subtitle={`Showing compensation breakdown for ${filteredEmployees.length} staff members`}
          icon={<CreditCard size={18} />}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Base Salary</TableHead>
              <TableHead>HRA</TableHead>
              <TableHead>Allowances</TableHead>
              <TableHead>Gross Salary</TableHead>
              <TableHead>Deductions</TableHead>
              <TableHead>Net Disbursement</TableHead>
              <TableHead>Bank / Account</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => {
              const s = emp.salaryStructure;
              const totalAllowance = s.specialAllowance + s.transportAllowance;
              const totalDed = s.pfDeduction + s.taxDeduction + s.otherDeductions;

              return (
                <TableRow key={emp.id}>
                  {/* Employee */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={emp.personalDetails.profilePicture}
                        name={emp.personalDetails.name}
                        size="sm"
                      />
                      <div>
                        <p className="text-xs font-bold text-[#1E1035]">
                          {emp.personalDetails.name}
                        </p>
                        <p className="text-[11px] text-[#1E1035]/50">
                          {emp.jobDetails.department} • {emp.employeeId}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Base */}
                  <TableCell className="text-xs font-mono font-medium text-[#1E1035]">
                    ${s.baseSalary.toLocaleString()}
                  </TableCell>

                  {/* HRA */}
                  <TableCell className="text-xs font-mono font-medium text-[#1E1035]">
                    ${s.hra.toLocaleString()}
                  </TableCell>

                  {/* Allowances */}
                  <TableCell className="text-xs font-mono font-medium text-[#1E1035]">
                    ${totalAllowance.toLocaleString()}
                  </TableCell>

                  {/* Gross */}
                  <TableCell className="text-xs font-mono font-bold text-[#1E1035]">
                    ${s.grossSalary.toLocaleString()}
                  </TableCell>

                  {/* Deductions */}
                  <TableCell className="text-xs font-mono text-rose-700 font-medium">
                    -${totalDed.toLocaleString()}
                  </TableCell>

                  {/* Net */}
                  <TableCell className="text-xs font-mono font-bold text-[#7B2CBF]">
                    ${s.netSalary.toLocaleString()}
                  </TableCell>

                  {/* Bank */}
                  <TableCell className="text-xs text-[#1E1035]/70">
                    <span className="font-semibold block">{s.bankName}</span>
                    <span className="font-mono text-[11px] text-[#1E1035]/50">{s.accountNumber}</span>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleOpenEditSalary(emp)}
                      leftIcon={<Edit2 size={14} />}
                      className="text-xs text-[#7B2CBF]"
                    >
                      Adjust Pay
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* EDIT SALARY MODAL */}
      {editingEmployee && (
        <Modal
          isOpen={Boolean(editingEmployee)}
          onClose={() => setEditingEmployee(null)}
          title={`Adjust Salary: ${editingEmployee.personalDetails.name}`}
          subtitle={`Employee ID: ${editingEmployee.employeeId} • ${editingEmployee.jobDetails.jobTitle}`}
          maxWidth="lg"
          footer={
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEditingEmployee(null)}
              >
                Cancel
              </Button>
              <Button size="md" onClick={handleSaveSalary}>
                Save Salary Structure
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveSalary} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="p-3.5 bg-[#F7F4FA] rounded-xl border border-[#E8E2F0] flex items-center justify-between text-xs">
              <span className="text-[#1E1035]/70 font-medium">
                Live Calculated Net Take-Home:
              </span>
              <span className="text-base font-extrabold text-[#7B2CBF] font-mono">
                $
                {(
                  Number(editBase) +
                  Number(editHra) +
                  Number(editSpecial) +
                  Number(editTransport) -
                  (Number(editPf) + Number(editTax) + Number(editOther))
                ).toLocaleString()}{' '}
                USD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Base Salary ($)"
                type="number"
                required
                value={editBase}
                onChange={(e) => setEditBase(Number(e.target.value))}
              />
              <Input
                label="House Rent Allowance (HRA) ($)"
                type="number"
                required
                value={editHra}
                onChange={(e) => setEditHra(Number(e.target.value))}
              />
              <Input
                label="Special Allowance ($)"
                type="number"
                required
                value={editSpecial}
                onChange={(e) => setEditSpecial(Number(e.target.value))}
              />
              <Input
                label="Transport Allowance ($)"
                type="number"
                required
                value={editTransport}
                onChange={(e) => setEditTransport(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#E8E2F0]">
              <Input
                label="PF Deduction ($)"
                type="number"
                required
                value={editPf}
                onChange={(e) => setEditPf(Number(e.target.value))}
              />
              <Input
                label="Tax Withholding ($)"
                type="number"
                required
                value={editTax}
                onChange={(e) => setEditTax(Number(e.target.value))}
              />
              <Input
                label="Other Deductions ($)"
                type="number"
                value={editOther}
                onChange={(e) => setEditOther(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E8E2F0]">
              <Input
                label="Disbursement Bank"
                required
                value={editBank}
                onChange={(e) => setEditBank(e.target.value)}
              />
              <Input
                label="Account Number"
                required
                value={editAccount}
                onChange={(e) => setEditAccount(e.target.value)}
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
