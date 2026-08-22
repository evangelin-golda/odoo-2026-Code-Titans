'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { EmployeeDashboard } from '../dashboard/EmployeeDashboard';
import { EmployeeProfileView } from '../profile/EmployeeProfileView';
import { EmployeeAttendanceView } from '../attendance/EmployeeAttendanceView';
import { EmployeeLeaveView } from '../leave/EmployeeLeaveView';
import { EmployeeSalaryView } from '../salary/EmployeeSalaryView';
import { EmployeeNotificationsView } from '../notifications/EmployeeNotificationsView';
import { EmployeeReportsView } from '../reports/EmployeeReportsView';
import { HRAssistantModal } from '../assistant/HRAssistantModal';
import { ApplyLeaveModal } from '../leave/ApplyLeaveModal';
import { EditProfileModal } from '../profile/EditProfileModal';
import { Loader2 } from 'lucide-react';

export function AppShell() {
  const {
    activeView,
    isLoading,
    openApplyLeaveModal,
    setOpenApplyLeaveModal,
    openEditProfileModal,
    setOpenEditProfileModal,
    openHRAssistantModal,
    setOpenHRAssistantModal,
  } = useEmployee();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div id="dayflow-app-root" className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Sidebar drawer content */}
            <div className="relative z-50 w-72 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
              <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          id="dayflow-main-viewport"
          className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                <p className="text-sm font-medium">Synchronizing Dayflow Employee Workspace...</p>
              </div>
            ) : (
              <>
                {activeView === 'dashboard' && <EmployeeDashboard />}
                {activeView === 'profile' && <EmployeeProfileView />}
                {activeView === 'attendance' && <EmployeeAttendanceView />}
                {activeView === 'leave' && <EmployeeLeaveView />}
                {activeView === 'salary' && <EmployeeSalaryView />}
                {activeView === 'notifications' && <EmployeeNotificationsView />}
                {activeView === 'reports' && <EmployeeReportsView />}
                {activeView === 'assistant' && <EmployeeDashboard />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {openApplyLeaveModal && (
        <ApplyLeaveModal
          isOpen={openApplyLeaveModal}
          onClose={() => setOpenApplyLeaveModal(false)}
        />
      )}

      {openEditProfileModal && (
        <EditProfileModal
          isOpen={openEditProfileModal}
          onClose={() => setOpenEditProfileModal(false)}
        />
      )}

      {openHRAssistantModal && (
        <HRAssistantModal
          isOpen={openHRAssistantModal}
          onClose={() => setOpenHRAssistantModal(false)}
        />
      )}
    </div>
  );
}
