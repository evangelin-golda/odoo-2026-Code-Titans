'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit2,
  Eye,
  UserCheck,
  Building,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShieldCheck,
  Check,
  X,
  CreditCard,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Employee, EmploymentType, EmploymentStatus } from '../../types/dayflowTypes';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Avatar } from '../ui/Avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Modal } from '../ui/Modal';

export const HREmployeeManagement: React.FC = () => {
  const { employees, addEmployee, updateEmployeeFull, impersonateEmployee } = useHRMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Add Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpAddress, setNewEmpAddress] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');
  const [newEmpTitle, setNewEmpTitle] = useState('Software Engineer');
  const [newEmpType, setNewEmpType] = useState<EmploymentType>('Full-time');
  const [newEmpManager, setNewEmpManager] = useState('Marcus Vance');
  const [newEmpLocation, setNewEmpLocation] = useState('San Francisco HQ');
  const [newEmpBaseSalary, setNewEmpBaseSalary] = useState(8500);
  const [newEmpHra, setNewEmpHra] = useState(1500);
  const [newEmpSpecial, setNewEmpSpecial] = useState(1000);
  const [newEmpBank, setNewEmpBank] = useState('Chase Bank NA');
  const [newEmpAccount, setNewEmpAccount] = useState('•••• •••• 9921');
  const [formError, setFormError] = useState('');

  // Filtering employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.personalDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.personalDetails.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobDetails.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      departmentFilter === 'all' || emp.jobDetails.department === departmentFilter;
    const matchesStatus =
      statusFilter === 'all' || emp.jobDetails.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = Array.from(new Set(employees.map((e) => e.jobDetails.department)));

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newEmpName.trim() || !newEmpEmail.trim()) {
      setFormError('Full name and email are required.');
      return;
    }

    const gross = Number(newEmpBaseSalary) + Number(newEmpHra) + Number(newEmpSpecial) + 350;
    const pf = Math.round(Number(newEmpBaseSalary) * 0.08);
    const tax = Math.round(gross * 0.12);
    const net = gross - pf - tax;

    addEmployee({
      role: 'employee',
      employeeId: `EMP-${1000 + employees.length + 1}`,
      personalDetails: {
        name: newEmpName,
        employeeId: `EMP-${1000 + employees.length + 1}`,
        email: newEmpEmail,
        phone: newEmpPhone || '+1 (555) 000-0000',
        address: newEmpAddress || 'San Francisco, CA',
        profilePicture: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
      },
      jobDetails: {
        department: newEmpDept,
        jobTitle: newEmpTitle,
        employmentType: newEmpType,
        joinDate: new Date().toISOString().split('T')[0],
        reportingManager: newEmpManager,
        workLocation: newEmpLocation,
        workEmail: newEmpEmail,
        status: 'Active',
      },
      salaryStructure: {
        baseSalary: Number(newEmpBaseSalary),
        hra: Number(newEmpHra),
        specialAllowance: Number(newEmpSpecial),
        transportAllowance: 350,
        grossSalary: gross,
        pfDeduction: pf,
        taxDeduction: tax,
        otherDeductions: 0,
        netSalary: net,
        currency: 'USD',
        payFrequency: 'Monthly',
        bankName: newEmpBank,
        accountNumber: newEmpAccount,
        ifscCode: 'CHASUS33XX',
        panNumber: 'USA-TAX-8891',
      },
      documents: [],
    });

    setIsAddModalOpen(false);
    // Reset
    setNewEmpName('');
    setNewEmpEmail('');
  };

  const handleSaveEditEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    // Recalculate gross and net
    const s = editingEmployee.salaryStructure;
    const gross = Number(s.baseSalary) + Number(s.hra) + Number(s.specialAllowance) + Number(s.transportAllowance);
    const pf = Number(s.pfDeduction);
    const tax = Number(s.taxDeduction);
    const other = Number(s.otherDeductions);
    const net = gross - pf - tax - other;

    const updated = {
      ...editingEmployee,
      salaryStructure: {
        ...s,
        grossSalary: gross,
        netSalary: net,
      },
    };

    updateEmployeeFull(updated);
    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Workforce Directory
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Employee Records & Management
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Manage staff profiles, edit job designations, configure comprehensive salary structures, and provision corporate access.
          </p>
        </div>

        <Button
          id="hr-add-employee-btn"
          size="lg"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<UserPlus size={18} />}
          className="w-full md:w-auto"
        >
          Add New Employee
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            id="hr-employee-search"
            placeholder="Search by name, ID, or title..."
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Select
            id="hr-filter-department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { label: 'All Departments', value: 'all' },
              ...departments.map((d) => ({ label: d, value: d })),
            ]}
          />

          <Select
            id="hr-filter-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'All Statuses', value: 'all' },
              { label: 'Active', value: 'Active' },
              { label: 'On Leave', value: 'On Leave' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
          />
        </div>
      </Card>

      {/* Employee Table Directory */}
      <Card>
        <CardHeader
          title="Staff Roster"
          subtitle={`Showing ${filteredEmployees.length} of ${employees.length} total employees`}
          icon={<Users size={18} />}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Job Details</TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead>Employment Status</TableHead>
              <TableHead>Monthly Net Pay</TableHead>
              <TableHead className="text-right">HR Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp.id}>
                {/* Employee Name + Avatar */}
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
                        Joined {emp.jobDetails.joinDate}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Employee ID */}
                <TableCell className="text-xs font-mono font-bold text-[#7B2CBF]">
                  {emp.employeeId}
                </TableCell>

                {/* Job Details */}
                <TableCell>
                  <div>
                    <span className="text-xs font-bold text-[#1E1035] block">
                      {emp.jobDetails.jobTitle}
                    </span>
                    <span className="text-[11px] text-[#1E1035]/60 block">
                      {emp.jobDetails.department} • {emp.jobDetails.employmentType}
                    </span>
                  </div>
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[#1E1035]/80">
                      <Mail size={12} className="text-[#7B2CBF]" />
                      <span>{emp.personalDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#1E1035]/60">
                      <Phone size={12} className="text-[#7B2CBF]" />
                      <span>{emp.personalDetails.phone}</span>
                    </div>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      emp.jobDetails.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : emp.jobDetails.status === 'On Leave'
                        ? 'bg-purple-50 text-[#7B2CBF] border border-purple-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        emp.jobDetails.status === 'Active'
                          ? 'bg-emerald-500'
                          : emp.jobDetails.status === 'On Leave'
                          ? 'bg-purple-500'
                          : 'bg-rose-500'
                      }`}
                    />
                    <span>{emp.jobDetails.status}</span>
                  </span>
                </TableCell>

                {/* Net Pay */}
                <TableCell className="text-xs font-bold font-mono text-[#1E1035]">
                  ${emp.salaryStructure.netSalary.toLocaleString()}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewingEmployee(emp)}
                      title="View Details"
                      className="p-1.5 text-xs text-[#1E1035]/70 hover:text-[#7B2CBF]"
                    >
                      <Eye size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingEmployee(JSON.parse(JSON.stringify(emp)))}
                      title="Edit (Personal, Job, Salary)"
                      className="p-1.5 text-xs text-[#7B2CBF] hover:bg-purple-50"
                    >
                      <Edit2 size={15} />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => impersonateEmployee(emp.employeeId)}
                      title="Switch to this employee view"
                      className="text-xs px-2 py-1"
                    >
                      Switch
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* VIEW DETAILS MODAL */}
      {viewingEmployee && (
        <Modal
          isOpen={Boolean(viewingEmployee)}
          onClose={() => setViewingEmployee(null)}
          title={`Employee Profile: ${viewingEmployee.personalDetails.name}`}
          subtitle={`${viewingEmployee.employeeId} • ${viewingEmployee.jobDetails.jobTitle}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingEmployee(JSON.parse(JSON.stringify(viewingEmployee)));
                  setViewingEmployee(null);
                }}
                leftIcon={<Edit2 size={14} />}
              >
                Edit Profile
              </Button>
              <Button size="sm" onClick={() => setViewingEmployee(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-5 text-xs">
            {/* Header info */}
            <div className="p-4 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center gap-4">
              <Avatar
                src={viewingEmployee.personalDetails.profilePicture}
                name={viewingEmployee.personalDetails.name}
                size="lg"
              />
              <div>
                <h3 className="text-base font-bold text-[#1E1035]">
                  {viewingEmployee.personalDetails.name}
                </h3>
                <p className="text-xs text-[#1E1035]/70">
                  {viewingEmployee.jobDetails.department} • {viewingEmployee.jobDetails.jobTitle}
                </p>
                <p className="text-[11px] text-[#1E1035]/50 mt-0.5">
                  Reporting to {viewingEmployee.jobDetails.reportingManager} ({viewingEmployee.jobDetails.workLocation})
                </p>
              </div>
            </div>

            {/* Grid summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-3.5 rounded-lg border border-[#E8E2F0]">
                <h4 className="font-bold text-[#7B2CBF] uppercase tracking-wider text-[11px]">
                  Contact & Personal
                </h4>
                <p><strong>Email:</strong> {viewingEmployee.personalDetails.email}</p>
                <p><strong>Phone:</strong> {viewingEmployee.personalDetails.phone}</p>
                <p><strong>Address:</strong> {viewingEmployee.personalDetails.address}</p>
                <p><strong>Emergency:</strong> {viewingEmployee.personalDetails.emergencyContact || 'None'}</p>
              </div>

              <div className="space-y-2 p-3.5 rounded-lg border border-[#E8E2F0]">
                <h4 className="font-bold text-[#7B2CBF] uppercase tracking-wider text-[11px]">
                  Salary & Banking
                </h4>
                <p><strong>Base:</strong> ${viewingEmployee.salaryStructure.baseSalary.toLocaleString()}</p>
                <p><strong>Gross:</strong> ${viewingEmployee.salaryStructure.grossSalary.toLocaleString()}</p>
                <p><strong>Net Take-Home:</strong> ${viewingEmployee.salaryStructure.netSalary.toLocaleString()}</p>
                <p><strong>Bank:</strong> {viewingEmployee.salaryStructure.bankName} ({viewingEmployee.salaryStructure.accountNumber})</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editingEmployee && (
        <Modal
          isOpen={Boolean(editingEmployee)}
          onClose={() => setEditingEmployee(null)}
          title={`Edit Employee Record: ${editingEmployee.personalDetails.name}`}
          subtitle={`HR Officer full edit access for ${editingEmployee.employeeId}`}
          maxWidth="xl"
          footer={
            <>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setEditingEmployee(null)}
              >
                Cancel
              </Button>
              <Button size="md" onClick={handleSaveEditEmployee}>
                Save All Changes
              </Button>
            </>
          }
        >
          <form onSubmit={handleSaveEditEmployee} className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
            {/* 1. Personal Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#7B2CBF] uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} />
                <span>Personal Details</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  required
                  value={editingEmployee.personalDetails.name}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      personalDetails: {
                        ...editingEmployee.personalDetails,
                        name: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={editingEmployee.personalDetails.email}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      personalDetails: {
                        ...editingEmployee.personalDetails,
                        email: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  label="Phone Number"
                  value={editingEmployee.personalDetails.phone}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      personalDetails: {
                        ...editingEmployee.personalDetails,
                        phone: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  label="Residential Address"
                  value={editingEmployee.personalDetails.address}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      personalDetails: {
                        ...editingEmployee.personalDetails,
                        address: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* 2. Job Details */}
            <div className="space-y-3 pt-3 border-t border-[#E8E2F0]">
              <h4 className="text-xs font-bold text-[#7B2CBF] uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase size={14} />
                <span>Job & Employment Details</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Department"
                  required
                  value={editingEmployee.jobDetails.department}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      jobDetails: {
                        ...editingEmployee.jobDetails,
                        department: e.target.value,
                      },
                    })
                  }
                />
                <Input
                  label="Job Title / Designation"
                  required
                  value={editingEmployee.jobDetails.jobTitle}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      jobDetails: {
                        ...editingEmployee.jobDetails,
                        jobTitle: e.target.value,
                      },
                    })
                  }
                />
                <Select
                  label="Employment Status"
                  value={editingEmployee.jobDetails.status}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      jobDetails: {
                        ...editingEmployee.jobDetails,
                        status: e.target.value as EmploymentStatus,
                      },
                    })
                  }
                  options={[
                    { label: 'Active', value: 'Active' },
                    { label: 'On Leave', value: 'On Leave' },
                    { label: 'Inactive', value: 'Inactive' },
                  ]}
                />
                <Input
                  label="Reporting Manager"
                  value={editingEmployee.jobDetails.reportingManager}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      jobDetails: {
                        ...editingEmployee.jobDetails,
                        reportingManager: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* 3. Salary Structure */}
            <div className="space-y-3 pt-3 border-t border-[#E8E2F0]">
              <h4 className="text-xs font-bold text-[#7B2CBF] uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard size={14} />
                <span>Salary Structure & Bank Data</span>
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Base Salary ($)"
                  type="number"
                  required
                  value={editingEmployee.salaryStructure.baseSalary}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salaryStructure: {
                        ...editingEmployee.salaryStructure,
                        baseSalary: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="HRA ($)"
                  type="number"
                  required
                  value={editingEmployee.salaryStructure.hra}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salaryStructure: {
                        ...editingEmployee.salaryStructure,
                        hra: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="Special Allowance ($)"
                  type="number"
                  required
                  value={editingEmployee.salaryStructure.specialAllowance}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salaryStructure: {
                        ...editingEmployee.salaryStructure,
                        specialAllowance: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="PF Deduction ($)"
                  type="number"
                  required
                  value={editingEmployee.salaryStructure.pfDeduction}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salaryStructure: {
                        ...editingEmployee.salaryStructure,
                        pfDeduction: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="Tax Withholding ($)"
                  type="number"
                  required
                  value={editingEmployee.salaryStructure.taxDeduction}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salaryStructure: {
                        ...editingEmployee.salaryStructure,
                        taxDeduction: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="Bank Account"
                  required
                  value={editingEmployee.salaryStructure.accountNumber}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      salaryStructure: {
                        ...editingEmployee.salaryStructure,
                        accountNumber: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* ADD EMPLOYEE MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        subtitle="Initialize profile, job assignment, and salary compensation"
        maxWidth="lg"
        footer={
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button size="md" onClick={handleAddEmployee}>
              Create Employee Record
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddEmployee} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Rachel Adams"
              value={newEmpName}
              onChange={(e) => setNewEmpName(e.target.value)}
            />
            <Input
              label="Corporate Email"
              type="email"
              required
              placeholder="e.g. r.adams@dayflow.io"
              value={newEmpEmail}
              onChange={(e) => setNewEmpEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Department"
              value={newEmpDept}
              onChange={(e) => setNewEmpDept(e.target.value)}
              options={[
                { label: 'Engineering', value: 'Engineering' },
                { label: 'Human Resources', value: 'Human Resources' },
                { label: 'Product & Design', value: 'Product & Design' },
                { label: 'Finance & Operations', value: 'Finance & Operations' },
                { label: 'Marketing & Sales', value: 'Marketing & Sales' },
              ]}
            />
            <Input
              label="Job Designation"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={newEmpTitle}
              onChange={(e) => setNewEmpTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Employment Type"
              value={newEmpType}
              onChange={(e) => setNewEmpType(e.target.value as EmploymentType)}
              options={[
                { label: 'Full-time', value: 'Full-time' },
                { label: 'Contract', value: 'Contract' },
                { label: 'Part-time', value: 'Part-time' },
              ]}
            />
            <Input
              label="Reporting Manager"
              value={newEmpManager}
              onChange={(e) => setNewEmpManager(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#E8E2F0]">
            <Input
              label="Base Salary ($)"
              type="number"
              value={newEmpBaseSalary}
              onChange={(e) => setNewEmpBaseSalary(Number(e.target.value))}
            />
            <Input
              label="HRA ($)"
              type="number"
              value={newEmpHra}
              onChange={(e) => setNewEmpHra(Number(e.target.value))}
            />
            <Input
              label="Special Allow. ($)"
              type="number"
              value={newEmpSpecial}
              onChange={(e) => setNewEmpSpecial(Number(e.target.value))}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
