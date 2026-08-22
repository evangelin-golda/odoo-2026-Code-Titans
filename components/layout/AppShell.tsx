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
import { AdminPortalView } from '../admin/AdminPortalView';
import { AdminEmailVerificationModal } from '../admin/AdminEmailVerificationModal';
import { HRAssistantModal } from '../assistant/HRAssistantModal';
import { ApplyLeaveModal } from '../leave/ApplyLeaveModal';
import { EditProfileModal } from '../profile/EditProfileModal';
import { AuthModal } from '../auth/AuthModal';
import { LoginForm } from '../auth/LoginForm';
import { SignupForm } from '../auth/SignupForm';
import { Loader2, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { DayflowLogo } from '../ui/DayflowLogo';

export function AppShell() {
  const {
    employee,
    activeView,
    setActiveView,
    isLoading,
    openApplyLeaveModal,
    setOpenApplyLeaveModal,
    openEditProfileModal,
    setOpenEditProfileModal,
    openHRAssistantModal,
    setOpenHRAssistantModal,
    openAuthModal,
    setOpenAuthModal,
    openAdminAuthModal,
    setOpenAdminAuthModal,
  } = useEmployee();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unauthTab, setUnauthTab] = useState<'login' | 'signup'>('login');

  return (
    <div id="dayflow-app-root" className="min-h-screen bg-[#FFFFFF] text-[#1E1035] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Only when logged in) */}
        {employee && (
          <div className="hidden lg:block shrink-0">
            <Sidebar />
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {employee && isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#1E1035]/40 backdrop-blur-xs transition-opacity"
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
          className="flex-1 overflow-y-auto bg-[#FFFFFF] p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-[#1E1035]/60">
                <Loader2 className="w-8 h-8 text-[#7B2CBF] animate-spin" />
                <p className="text-xs font-semibold">Synchronizing Dayflow Employee Workspace...</p>
              </div>
            ) : !employee ? (
              /* Unauthenticated Landing View */
              <div className="max-w-xl mx-auto py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center space-y-3 mb-8">
                  <div className="flex justify-center mb-2">
                    <DayflowLogo size={44} showText={false} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7B2CBF]/10 text-[#7B2CBF] border border-[#7B2CBF]/20 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Dayflow HRMS Suite
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#1E1035] tracking-tight">
                    Every workday, perfectly aligned.
                  </h1>
                  <p className="text-xs text-[#1E1035]/70 max-w-md mx-auto leading-relaxed">
                    Sign in with your employee account or authenticate with corporate credentials to access timesheets, leave approvals, and pay slips.
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-[#E8E2F0] shadow-xl p-6 sm:p-8">
                  {/* Segmented Tab Switch */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F4FA] rounded-2xl mb-6 text-xs font-bold border border-[#E8E2F0]">
                    <button
                      type="button"
                      onClick={() => setUnauthTab('login')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        unauthTab === 'login'
                          ? 'bg-white text-[#7B2CBF] shadow-xs'
                          : 'text-[#1E1035]/60 hover:text-[#1E1035]'
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Employee Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnauthTab('signup')}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all cursor-pointer ${
                        unauthTab === 'signup'
                          ? 'bg-white text-[#7B2CBF] shadow-xs'
                          : 'text-[#1E1035]/60 hover:text-[#1E1035]'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account</span>
                    </button>
                  </div>

                  {unauthTab === 'login' ? (
                    <LoginForm onSwitchToSignup={() => setUnauthTab('signup')} />
                  ) : (
                    <SignupForm onSwitchToLogin={() => setUnauthTab('login')} />
                  )}
                </div>
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
                {activeView === 'admin' && <AdminPortalView />}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {openAuthModal && (
        <AuthModal
          isOpen={openAuthModal}
          onClose={() => setOpenAuthModal(false)}
        />
      )}

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

      {openAdminAuthModal && (
        <AdminEmailVerificationModal
          isOpen={openAdminAuthModal}
          onClose={() => setOpenAdminAuthModal(false)}
          onSuccess={() => {
            setOpenAdminAuthModal(false);
            setActiveView('admin');
          }}
        />
      )}
    </div>
  );
}
