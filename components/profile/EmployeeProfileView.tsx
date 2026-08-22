'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Shield,
  FileText,
  CreditCard,
  Edit3,
  Download,
  AlertCircle,
  CheckCircle2,
  Lock,
  HeartHandshake,
} from 'lucide-react';
import Image from 'next/image';

export function EmployeeProfileView() {
  const { employee, setOpenEditProfileModal } = useEmployee();
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'salary' | 'documents'>('personal');

  if (!employee) return null;

  return (
    <div id="dayflow-employee-profile-view" className="space-y-6">
      {/* 1. Header Profile Banner (Light Theme) */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border-2 border-sky-500/20 shadow-sm shrink-0">
              {employee.avatarUrl ? (
                <Image
                  src={employee.avatarUrl}
                  alt={employee.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-sky-700 bg-sky-50">
                  {employee.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{employee.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  {employee.employeeId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 capitalize">
                  Active Employee
                </span>
              </div>
              <p className="text-sm font-medium text-slate-600">
                {employee.jobPosition} • {employee.department}
              </p>
              <p className="text-xs text-slate-500 max-w-xl">{employee.bio}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpenEditProfileModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-sm active:scale-95 shrink-0"
          >
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'personal'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Personal Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('job')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'job'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Job & Organization
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'salary'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Salary & Compensation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'documents'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Employee Documents ({employee.documents.length})
          </button>
        </div>
      </div>

      {/* 2. Tab Contents */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Details Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Contact & Residential
              </h2>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Editable by Employee
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Work Email</span>
                <div className="flex items-center gap-2 font-mono font-medium text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <Mail className="w-4 h-4 text-sky-600" />
                  {employee.email}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Primary Phone</span>
                <div className="flex items-center gap-2 font-medium text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <Phone className="w-4 h-4 text-sky-600" />
                  {employee.phone}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Residential Address</span>
                <div className="flex items-start gap-2 font-medium text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <MapPin className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                  <span>{employee.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Emergency Contact
              </h2>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Editable by Employee
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Emergency Contact Name</span>
                <div className="flex items-center gap-2 font-medium text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <User className="w-4 h-4 text-rose-500" />
                  {employee.emergencyContact.name}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Relationship</span>
                <div className="flex items-center gap-2 font-medium text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <HeartHandshake className="w-4 h-4 text-rose-500" />
                  {employee.emergencyContact.relationship}
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Emergency Phone</span>
                <div className="flex items-center gap-2 font-medium text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <Phone className="w-4 h-4 text-rose-500" />
                  {employee.emergencyContact.phone}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'job' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Employment & Role Parameters
            </h2>
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Managed by HR & Odoo Admin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Department</span>
              <span className="font-semibold text-slate-900 text-sm">{employee.department}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Designation / Role</span>
              <span className="font-semibold text-slate-900 text-sm">{employee.jobPosition}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Employment Type</span>
              <span className="font-semibold text-slate-900 text-sm">{employee.employmentType}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Work Arrangement</span>
              <span className="font-semibold text-slate-900 text-sm capitalize">
                {employee.workMode} ({employee.workLocation})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Reporting Manager</span>
              <span className="font-semibold text-slate-900 text-sm">{employee.managerName}</span>
              <span className="text-[10px] text-slate-500 block">{employee.managerEmail}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500 block mb-1">Joining Date</span>
              <span className="font-semibold text-slate-900 text-sm">{employee.joiningDate}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Salary & Statutory Details (Read-Only)
              </h2>
              <p className="text-xs text-slate-500">
                Protected by Odoo HR security record rules
              </p>
            </div>
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Read Only
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-500">Annual Base CTC</span>
              <div className="text-xl font-bold text-slate-900 mt-1">
                ${employee.salary.baseAnnual.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-500">Excluding performance bonuses</span>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200/80">
              <span className="text-xs text-sky-700">Gross Monthly Earnings</span>
              <div className="text-xl font-bold text-sky-950 mt-1">
                ${(employee.salary.baseMonthly + employee.salary.hra + employee.salary.specialAllowance + employee.salary.performanceBonus).toLocaleString()}
              </div>
              <span className="text-[10px] text-sky-700">Base + HRA + Special Allowance</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-xs text-emerald-700">Net Take-Home Salary</span>
              <div className="text-xl font-bold text-emerald-950 mt-1">
                ${employee.salary.netMonthly.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-700">Credited to registered account</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2 text-xs">
            <h3 className="font-bold text-slate-900">Registered Bank & Compliance IDs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="text-slate-500 block">Bank Account:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {employee.salary.bankAccountMasked}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">PAN / Tax ID:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {employee.salary.panMasked}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">PF Account Number:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {employee.salary.pfNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Verified Employee Documents
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {employee.documents.length} files attached
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employee.documents.map(doc => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-sky-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{doc.title}</h3>
                    <p className="text-[10px] text-slate-500">
                      {doc.category} • Uploaded on {doc.uploadDate} ({doc.fileSize})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Downloading verified document: ${doc.title}`)}
                  className="p-2 text-slate-500 hover:text-sky-600 hover:bg-white rounded-lg transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
