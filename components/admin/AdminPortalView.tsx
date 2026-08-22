'use client';

import React, { useState, useEffect } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  Users,
  Clock,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  Building2,
  Laptop,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Check,
  X,
  Send,
  Sparkles,
  Lock,
  LogOut,
  RefreshCw,
  DollarSign,
  UserCheck,
  UserPlus,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  CalendarClock,
  ShieldAlert,
} from 'lucide-react';
import { EmployeeProfile, LeaveRequest, AttendanceRecord } from '@/types/hrms';
import Image from 'next/image';

interface AdminOverviewData {
  totalEmployees: number;
  presentToday: number;
  remoteToday: number;
  onLeaveToday: number;
  lateToday: number;
  pendingLeavesCount: number;
  totalMonthlyPayroll: number;
  roster: Array<{ employee: EmployeeProfile; todayRecord: AttendanceRecord | null }>;
  pendingLeaves: LeaveRequest[];
  employees: EmployeeProfile[];
}

export function AdminPortalView() {
  const { setActiveView } = useEmployee();

  const [activeTab, setActiveTab] = useState<'roster' | 'leaves' | 'directory' | 'payroll' | 'security'>('roster');
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Leave approval action state
  const [processingLeaveId, setProcessingLeaveId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Add Employee Modal state
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');
  const [newEmpRole, setNewEmpRole] = useState('Associate Engineer');
  const [newEmpWorkMode, setNewEmpWorkMode] = useState<'office' | 'remote' | 'hybrid'>('hybrid');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  const adminEmail = typeof window !== 'undefined'
    ? sessionStorage.getItem('dayflow_admin_email') || 'sarah.chen@dayflow.internal'
    : 'sarah.chen@dayflow.internal';

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json();
      if (json.success && json.overview) {
        setData(json.overview);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApproveLeave = async (leaveId: string) => {
    setProcessingLeaveId(leaveId);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'approve_leave',
          leaveId,
          adminName: 'HR Administration',
          comments: 'Approved by HR Administrator',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionSuccessMsg('Leave request successfully approved!');
        setTimeout(() => setActionSuccessMsg(null), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingLeaveId(null);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    setProcessingLeaveId(leaveId);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject_leave',
          leaveId,
          adminName: 'HR Administration',
          comments: 'Declined due to team sprint coverage requirements.',
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionSuccessMsg('Leave request rejected.');
        setTimeout(() => setActionSuccessMsg(null), 3000);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingLeaveId(null);
    }
  };

  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpEmail.trim()) return;

    setIsAddingEmployee(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_employee',
          name: newEmpName.trim(),
          email: newEmpEmail.trim().toLowerCase(),
          phone: newEmpPhone.trim(),
          department: newEmpDept,
          jobPosition: newEmpRole,
          workMode: newEmpWorkMode,
        }),
      });
      const resData = await res.json();
      if (resData.success) {
        setActionSuccessMsg(`Employee ${newEmpName} successfully registered!`);
        setTimeout(() => setActionSuccessMsg(null), 3000);
        setIsAddEmployeeOpen(false);
        setNewEmpName('');
        setNewEmpEmail('');
        setNewEmpPhone('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddingEmployee(false);
    }
  };

  const handleLockAdminSession = () => {
    sessionStorage.removeItem('dayflow_admin_verified');
    sessionStorage.removeItem('dayflow_admin_email');
    setActiveView('dashboard');
  };

  // Filtered employees for directory tab
  const filteredEmployees = (data?.employees || []).filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobPosition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'all' || emp.department.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesDept;
  });

  const attendanceRate = data?.totalEmployees
    ? Math.round(((data.presentToday + data.onLeaveToday) / data.totalEmployees) * 100)
    : 100;

  return (
    <div id="dayflow-admin-portal" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner with Verified Admin Info */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Background ambient elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                HR & Admin Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Email Verified: {adminEmail}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Workforce Operations & Oversight
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Real-time employee monitoring, pending leave approvals, company directory management, and monthly payroll disbursement.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <Briefcase className="w-3.5 h-3.5 text-sky-400" />
              <span>Switch to My Employee Workspace</span>
            </button>

            <button
              type="button"
              onClick={handleLockAdminSession}
              className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all border border-rose-500 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Management Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Headcount
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1">
              {data?.totalEmployees || 3} Staff
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Active full-time contracts</p>
          </div>
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Present Today */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Checked In Today
            </span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {data?.presentToday || 0} / {data?.totalEmployees || 3}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              {data?.remoteToday || 0} remote • {data?.lateToday || 0} late
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Leaves Queue */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Approvals
            </span>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {data?.pendingLeavesCount || 0} Requests
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Requires manager/HR action</p>
          </div>
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Monthly Payroll Total */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Monthly Payroll
            </span>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              ${((data?.totalMonthlyPayroll || 37082)).toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Base salary disbursement</p>
          </div>
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Admin Portal Tabs & Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'roster'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Live Attendance Roster</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leaves')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'leaves'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-amber-600" />
              <span>Leave Approval Queue</span>
              {Boolean(data?.pendingLeavesCount) && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {data?.pendingLeavesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-sky-600" />
              <span>Staff Directory ({data?.totalEmployees || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payroll')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'payroll'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4 text-purple-600" />
              <span>Company Payroll</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Security & Roles</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddEmployeeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Attendance Roster */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">Today's Company Shift Roster</h3>
                <p className="text-xs text-slate-500">Live employee check-ins, punch durations, and active locations.</p>
              </div>
              <button
                type="button"
                onClick={fetchAdminData}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer w-fit"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Live Status</span>
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Department & Role</th>
                    <th className="py-3.5 px-4">Check-In</th>
                    <th className="py-3.5 px-4">Check-Out</th>
                    <th className="py-3.5 px-4">Active Duration</th>
                    <th className="py-3.5 px-4">Work Location</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(data?.roster || []).map(item => {
                    const emp = item.employee;
                    const rec = item.todayRecord;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative shrink-0">
                              {emp.avatarUrl ? (
                                <Image src={emp.avatarUrl} alt={emp.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-700">
                                  {emp.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{emp.name}</div>
                              <div className="text-[11px] font-mono text-slate-500">{emp.employeeId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-slate-800">{emp.jobPosition}</div>
                          <div className="text-[11px] text-slate-500">{emp.department}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">
                          {rec?.checkIn && rec.checkIn !== '-' ? rec.checkIn : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          {rec?.checkOut && rec.checkOut !== '-' ? rec.checkOut : rec?.checkIn ? 'In Progress' : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {rec?.durationMinutes ? `${(rec.durationMinutes / 60).toFixed(1)} hrs` : '0.0 hrs'}
                        </td>
                        <td className="py-3.5 px-4 capitalize">
                          <span className="inline-flex items-center gap-1 text-slate-700">
                            {rec?.workMode === 'remote' ? (
                              <>
                                <Laptop className="w-3.5 h-3.5 text-sky-600" /> Remote (WFH)
                              </>
                            ) : (
                              <>
                                <Building2 className="w-3.5 h-3.5 text-slate-500" /> Office HQ
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {rec ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                                rec.status === 'present'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : rec.status === 'late'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : rec.status === 'half_day'
                                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                  : rec.status === 'on_leave'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {rec.status.replace('_', ' ')}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                              Not Checked In
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Leave Approvals Queue */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending Leave Approval Requests</h3>
              <p className="text-xs text-slate-500">
                Review and approve employee time-off applications with single-click actions.
              </p>
            </div>

            {data?.pendingLeaves && data.pendingLeaves.length > 0 ? (
              <div className="space-y-3">
                {data.pendingLeaves.map(req => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{req.employeeName}</span>
                        <span className="font-mono text-xs text-slate-500">({req.employeeId})</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                          {req.leaveType.toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {req.daysCount} Working Day{req.daysCount > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex items-center gap-1.5">
                        <CalendarClock className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold">{req.startDate} to {req.endDate}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500">Applied on {req.appliedDate}</span>
                      </div>

                      {req.reason && (
                        <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/80 max-w-2xl leading-relaxed">
                          <span className="font-bold text-slate-900">Reason: </span>
                          {req.reason}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={processingLeaveId === req.id}
                        onClick={() => handleRejectLeave(req.id)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        type="button"
                        disabled={processingLeaveId === req.id}
                        onClick={() => handleApproveLeave(req.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve Leave</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">All Clear! No Pending Requests</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All employee leave applications have been processed. New submissions will appear here automatically.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Staff Directory */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff by name, ID, title, email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={departmentFilter}
                  onChange={e => setDepartmentFilter(e.target.value)}
                  className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="all">All Departments</option>
                  <option value="core engineering">Core Engineering</option>
                  <option value="product & design">Product & Design</option>
                  <option value="infrastructure & cloud">Infrastructure & Cloud</option>
                </select>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map(emp => (
                <div
                  key={emp.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                        {emp.avatarUrl ? (
                          <Image src={emp.avatarUrl} alt={emp.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-700">
                            {emp.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm leading-tight">{emp.name}</h4>
                        <div className="text-xs text-slate-500 font-medium">{emp.jobPosition}</div>
                        <span className="inline-block font-mono text-[10px] text-purple-700 font-bold mt-0.5">
                          {emp.employeeId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        emp.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : emp.role === 'hr'
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {emp.role}
                    </span>
                  </div>

                  {/* Info pills */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-semibold text-slate-800">{emp.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Work Mode:</span>
                      <span className="font-semibold text-slate-800 capitalize">{emp.workMode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Monthly Salary:</span>
                      <span className="font-mono font-bold text-slate-900">
                        ${(emp.salary?.baseMonthly || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="truncate">{emp.email}</span>
                    <span className="font-semibold text-purple-600 shrink-0">Joined {emp.joiningDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Company Payroll */}
        {activeTab === 'payroll' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Company Payroll & Statutory Compensation</h3>
              <p className="text-xs text-slate-500">
                Monthly wage breakdown, statutory deductions, tax withholdings, and employee compensations.
              </p>
            </div>

            {/* Breakdown summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                <span className="text-purple-700 font-bold uppercase tracking-wider block text-[10px]">
                  Total Monthly Outflow
                </span>
                <div className="text-2xl font-extrabold text-purple-950 font-mono">
                  ${((data?.totalMonthlyPayroll || 37082)).toLocaleString()}.00
                </div>
                <span className="text-purple-700 text-[11px]">Calculated across active employee contracts</span>
              </div>

              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs space-y-1">
                <span className="text-sky-700 font-bold uppercase tracking-wider block text-[10px]">
                  Annualized Company Budget
                </span>
                <div className="text-2xl font-extrabold text-sky-950 font-mono">
                  ${((data?.totalMonthlyPayroll || 37082) * 12).toLocaleString()}.00
                </div>
                <span className="text-sky-700 text-[11px]">FY 2026 Allocated Workforce Budget</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                <span className="text-emerald-700 font-bold uppercase tracking-wider block text-[10px]">
                  Next Scheduled Payday
                </span>
                <div className="text-2xl font-extrabold text-emerald-950 font-mono">
                  August 31, 2026
                </div>
                <span className="text-emerald-700 text-[11px]">Direct Bank Wire Transfer (Automated)</span>
              </div>
            </div>

            {/* Compensation Table */}
            <div className="rounded-2xl border border-slate-200 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Employee</th>
                    <th className="py-3.5 px-4">Base Monthly</th>
                    <th className="py-3.5 px-4">HRA & Allowances</th>
                    <th className="py-3.5 px-4">PF & Health Deduction</th>
                    <th className="py-3.5 px-4">Net Monthly Payout</th>
                    <th className="py-3.5 px-4">Pay Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {(data?.employees || []).map(emp => {
                    const sal = emp.salary;
                    const hra = sal?.hra || 0;
                    const special = sal?.specialAllowance || 0;
                    const pf = sal?.providentFund || 0;
                    const ins = sal?.healthInsurance || 0;
                    const net = sal?.netMonthly || 0;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-4 font-sans font-bold text-slate-900">
                          {emp.name} <span className="text-slate-400 font-mono text-[11px]">({emp.employeeId})</span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          ${(sal?.baseMonthly || 0).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-emerald-700">
                          +${(hra + special).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-rose-600">
                          -${(pf + ins).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-purple-900">
                          ${net.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-sans">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Verified / Ready
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Security & Roles */}
        {activeTab === 'security' && (
          <div className="space-y-4 max-w-3xl">
            <div>
              <h3 className="text-base font-bold text-slate-900">HR Admin Security & Authorization Tiers</h3>
              <p className="text-xs text-slate-500">
                Authorized administrator accounts with privileges to approve leaves and inspect compensation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    SC
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Sarah Chen (sarah.chen@dayflow.internal)</div>
                    <div className="text-[11px] text-slate-500">Lead HR Partner & Administrator • Full Approval Rights</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active Admin
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                    MV
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Marcus Vance (marcus.vance@dayflow.internal)</div>
                    <div className="text-[11px] text-slate-500">Infrastructure & System Administrator • Database Access</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                  System Admin
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-slate-800">Security Requirement:</span> All HR and Admin operations require verified email authorization with 6-digit cryptographic OTP token challenge.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {isAddEmployeeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Register New Employee</h3>
                  <p className="text-xs text-slate-500">Add an employee profile to Dayflow company roster</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEmployeeOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Hayes"
                    value={newEmpName}
                    onChange={e => setNewEmpName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.hayes@dayflow.internal"
                    value={newEmpEmail}
                    onChange={e => setNewEmpEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Department</label>
                  <select
                    value={newEmpDept}
                    onChange={e => setNewEmpDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Infrastructure & Cloud">Infrastructure & Cloud</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer"
                    value={newEmpRole}
                    onChange={e => setNewEmpRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Work Mode</label>
                  <select
                    value={newEmpWorkMode}
                    onChange={e => setNewEmpWorkMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="hybrid">Hybrid (Office & Remote)</option>
                    <option value="office">In-Office HQ</option>
                    <option value="remote">Fully Remote</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 321-7654"
                    value={newEmpPhone}
                    onChange={e => setNewEmpPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingEmployee}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingEmployee ? 'Registering...' : 'Register Employee'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
