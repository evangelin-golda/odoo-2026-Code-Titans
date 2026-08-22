'use client';

import React from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import {
  X,
  Shield,
  LogIn,
  UserPlus,
  Users,
  Sparkles,
} from 'lucide-react';

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { authModalTab, setAuthModalTab } = useEmployee();

  if (!isOpen) return null;

  return (
    <div
      id="dayflow-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dayflow Authentication Portal
              </h2>
              <p className="text-xs text-slate-500">
                Enterprise HRMS Employee Access & Registration
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100/80 rounded-xl my-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthModalTab('login')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              authModalTab === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthModalTab('signup')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
              authModalTab === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-2">
          {authModalTab === 'login' && (
            <LoginForm
              onSuccess={onClose}
              onSwitchToSignup={() => setAuthModalTab('signup')}
            />
          )}

          {authModalTab === 'signup' && (
            <SignupForm
              onSuccess={onClose}
              onSwitchToLogin={() => setAuthModalTab('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
