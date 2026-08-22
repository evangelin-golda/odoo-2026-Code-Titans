'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  User,
  Phone,
  MapPin,
  Mail,
  Building,
  Briefcase,
  Calendar,
  CreditCard,
  FileText,
  Lock,
  Edit2,
  Check,
  X,
  Camera,
  Download,
  Eye,
  Info,
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Modal } from '../ui/Modal';

export function EmployeeProfileView() {
  const { employee, refreshEmployeeData } = useEmployee();
  const { showToast } = useToast();

  const getEmergencyContactStr = () => {
    if (!employee?.emergencyContact) return 'Elena Rivera (+1 555-987-6543)';
    if (typeof employee.emergencyContact === 'object') {
      const ec = employee.emergencyContact as any;
      return `${ec.name || ''} (${ec.relationship || 'Emergency'}: ${ec.phone || ''})`;
    }
    return String(employee.emergencyContact);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: employee?.phone || '+1 (555) 234-5678',
    address: employee?.address || '742 Evergreen Terrace, San Francisco, CA',
    avatarUrl: employee?.avatarUrl || '',
    emergencyContact: getEmergencyContactStr(),
  });

  const [activeDocPreview, setActiveDocPreview] = useState<string | null>(null);

  if (!employee) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/employee/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          phone: formData.phone,
          address: formData.address,
          avatarUrl: formData.avatarUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Personal details updated successfully!', 'success');
        await refreshEmployeeData();
        setIsEditing(false);
      } else {
        showToast(data.error || 'Failed to update profile', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating profile', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      phone: employee.phone || '+1 (555) 234-5678',
      address: employee.address || '742 Evergreen Terrace, San Francisco, CA',
      avatarUrl: employee.avatarUrl || '',
      emergencyContact: 'Elena Rivera (+1 555-987-6543)',
    });
    setIsEditing(false);
  };

  const documents = [
    {
      id: 'doc-1',
      name: 'Full-Time Employment Agreement.pdf',
      type: 'PDF Contract',
      fileSize: '1.8 MB',
      uploadDate: '2026-01-15',
    },
    {
      id: 'doc-2',
      name: 'Non-Disclosure & IP Assignment.pdf',
      type: 'Legal Document',
      fileSize: '840 KB',
      uploadDate: '2026-01-15',
    },
    {
      id: 'doc-3',
      name: 'Direct Deposit Authorization Form.pdf',
      type: 'Banking Record',
      fileSize: '420 KB',
      uploadDate: '2026-01-16',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Profile Master Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <Avatar
              src={isEditing ? formData.avatarUrl : employee.avatarUrl}
              name={employee.name}
              size="xl"
            />
            {isEditing && (
              <div className="absolute -bottom-1 -right-1 bg-[#7B2CBF] text-white p-1.5 rounded-full shadow-md">
                <Camera size={14} />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
                {employee.workMode === 'remote' ? 'Remote Full-Time' : 'Full-Time Employee'}
              </span>
              <span className="text-xs text-[#1E1035]/40">•</span>
              <span className="text-xs font-bold text-[#1E1035]/70">
                {employee.employeeId}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1">
              {employee.name}
            </h2>
            <p className="text-xs text-[#1E1035]/70 mt-0.5">
              {employee.jobPosition} • {employee.department}
            </p>
            <p className="text-xs text-[#1E1035]/50 mt-1 flex items-center gap-1.5">
              <MapPin size={12} className="text-[#7B2CBF]" />
              <span>San Francisco HQ — Workstation 4B</span>
            </p>
          </div>
        </div>

        {/* Edit mode toggle buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!isEditing ? (
            <Button
              id="edit-profile-btn"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit2 size={15} />}
              className="w-full md:w-auto"
            >
              Edit Contact Info
            </Button>
          ) : (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCancel}
                leftIcon={<X size={14} />}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                leftIcon={<Check size={14} />}
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editing Notice Banner */}
      {isEditing && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-start gap-3">
          <Info size={16} className="text-[#7B2CBF] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Editing Policy (Role: Employee Self-Service)</p>
            <p className="text-indigo-800/80 mt-0.5">
              Per HRMS governance rules, you can update your phone number, residential address, emergency contact, and avatar. Job designation and salary parameters are managed by HR.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. PERSONAL DETAILS SECTION */}
        <Card id="section-personal-details">
          <CardHeader
            title="Personal Details"
            subtitle="Contact information and basic personal identifiers"
            icon={<User size={18} />}
          />

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1E1035]/60 flex items-center gap-1.5 mb-1">
                  <span>Full Name</span>
                  <Lock size={12} className="text-[#1E1035]/40" />
                </label>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                  {employee.name}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E1035]/60 flex items-center gap-1.5 mb-1">
                  <span>Employee ID</span>
                  <Lock size={12} className="text-[#1E1035]/40" />
                </label>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                  {employee.employeeId}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1E1035]/60 flex items-center gap-1.5 mb-1">
                <span>Corporate Email</span>
                <Lock size={12} className="text-[#1E1035]/40" />
              </label>
              <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                {employee.email}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {isEditing ? (
                  <Input
                    label="Phone Number (Editable)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    leftIcon={<Phone size={15} />}
                    required
                  />
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                      Phone Number
                    </label>
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8E2F0] text-xs font-semibold text-[#1E1035] flex items-center gap-2">
                      <Phone size={14} className="text-[#7B2CBF]" />
                      <span>{employee.phone || formData.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {isEditing ? (
                  <Input
                    label="Emergency Contact (Editable)"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Name and Phone"
                  />
                ) : (
                  <div>
                    <label className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                      Emergency Contact
                    </label>
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8E2F0] text-xs font-semibold text-[#1E1035]">
                      {formData.emergencyContact}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              {isEditing ? (
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-[#1E1035]">
                    Residential Address (Editable)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full text-xs text-[#1E1035] p-2.5 rounded-lg border border-[#E8E2F0] focus:ring-2 focus:ring-[#7B2CBF]/20 focus:border-[#7B2CBF] outline-none"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                    Residential Address
                  </label>
                  <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-[#E8E2F0] text-xs font-semibold text-[#1E1035] flex items-start gap-2">
                    <MapPin size={14} className="text-[#7B2CBF] shrink-0 mt-0.5" />
                    <span>{employee.address || formData.address}</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Card>

        {/* 2. JOB DETAILS SECTION */}
        <Card id="section-job-details">
          <CardHeader
            title="Job Details"
            subtitle="Department, designation, and reporting structure"
            icon={<Briefcase size={18} />}
            action={
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F7F4FA] border border-[#E8E2F0] text-[#1E1035]/60 flex items-center gap-1">
                <Lock size={11} />
                <span>Read-Only</span>
              </span>
            }
          />

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                  Department
                </span>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                  {employee.department}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                  Job Title
                </span>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                  {employee.jobPosition}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                  Employment Type
                </span>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                  Full-time
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                  Date of Joining
                </span>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035] flex items-center gap-2">
                  <Calendar size={14} className="text-[#7B2CBF]" />
                  <span>{(employee as any).joinDate || (employee as any).joiningDate || '2024-03-15'}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                Reporting Manager
              </span>
              <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                {employee.managerName || 'Sarah Jenkins (HR Lead)'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                  Work Location
                </span>
                <div className="p-2.5 rounded-lg bg-[#F7F4FA] border border-[#E8E2F0] text-xs font-bold text-[#1E1035]">
                  San Francisco HQ — Workstation 4B
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#1E1035]/60 block mb-1">
                  Status
                </span>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 3. SALARY STRUCTURE SECTION */}
        <Card id="section-salary-structure">
          <CardHeader
            title="Salary Structure"
            subtitle="Approved monthly compensation and statutory deductions"
            icon={<CreditCard size={18} />}
            action={
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F7F4FA] border border-[#E8E2F0] text-[#1E1035]/60 flex items-center gap-1">
                <Lock size={11} />
                <span>Read-Only</span>
              </span>
            }
          />

          <div className="space-y-3.5">
            <div className="p-4 rounded-xl bg-[#F7F4FA] border border-[#E8E2F0] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E1035]/60">
                  Monthly Net Take-Home
                </span>
                <h4 className="text-2xl font-extrabold text-[#7B2CBF] mt-0.5">
                  $9,308
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#1E1035]/60">Gross Compensation</span>
                <p className="text-sm font-bold text-[#1E1035]">
                  $11,350
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-[#E8E2F0]/60">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#1E1035]/70">Base Salary</span>
                <span className="font-bold text-[#1E1035]">$8,500</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#1E1035]/70">House Rent Allowance (HRA)</span>
                <span className="font-bold text-[#1E1035]">$1,500</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#1E1035]/70">Special Allowance</span>
                <span className="font-bold text-[#1E1035]">$1,000</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-rose-700">
                <span>Provident Fund (PF) Deduction</span>
                <span className="font-bold">-$680</span>
              </div>
              <div className="flex items-center justify-between py-1.5 text-rose-700">
                <span>Estimated Tax Withholding</span>
                <span className="font-bold">-$1,362</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FFFFFF] border border-[#E8E2F0] text-[11px] text-[#1E1035]/70 flex items-center justify-between">
              <span>Disbursement Bank:</span>
              <span className="font-bold text-[#1E1035]">
                Chase Bank NA (•••• •••• 9921)
              </span>
            </div>
          </div>
        </Card>

        {/* 4. DOCUMENTS SECTION */}
        <Card id="section-documents">
          <CardHeader
            title="Documents & Agreements"
            subtitle="Verified employment agreements, contracts, and tax filings"
            icon={<FileText size={18} />}
          />

          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-xl border border-[#E8E2F0] bg-[#F7F4FA]/50 hover:bg-[#F7F4FA] transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-[#FFFFFF] border border-[#E8E2F0] flex items-center justify-center text-[#7B2CBF] shrink-0">
                    <FileText size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#1E1035] truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-[#1E1035]/60">
                      {doc.type} • {doc.fileSize} • Uploaded {doc.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveDocPreview(doc.name)}
                    className="p-1.5 text-xs text-[#1E1035]/70 hover:text-[#7B2CBF]"
                    title="View Document"
                  >
                    <Eye size={15} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => alert(`Downloading ${doc.name}`)}
                    className="p-1.5 text-xs"
                    title="Download PDF"
                  >
                    <Download size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Document Preview Modal */}
      {activeDocPreview && (
        <Modal
          isOpen={Boolean(activeDocPreview)}
          onClose={() => setActiveDocPreview(null)}
          title="Document Viewer"
          subtitle={activeDocPreview}
          maxWidth="lg"
          footer={
            <Button onClick={() => setActiveDocPreview(null)}>
              Done
            </Button>
          }
        >
          <div className="p-8 text-center space-y-4 bg-[#F7F4FA] rounded-xl border border-[#E8E2F0]">
            <div className="w-16 h-16 rounded-2xl bg-[#FFFFFF] border border-[#E8E2F0] text-[#7B2CBF] flex items-center justify-center mx-auto shadow-sm">
              <FileText size={32} />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#1E1035]">{activeDocPreview}</h4>
              <p className="text-xs text-[#1E1035]/60 mt-1">
                Digitally verified corporate document on file with Dayflow HR Governance.
              </p>
            </div>
            <div className="p-3 bg-[#FFFFFF] border border-[#E8E2F0] rounded-lg text-left text-xs font-mono text-[#1E1035]/70">
              SHA-256 Checksum: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
