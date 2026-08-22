'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  ShieldAlert,
  ShieldCheck,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  UserCheck,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface AdminEmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminEmailVerificationModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminEmailVerificationModalProps) {
  const { employee } = useEmployee();

  // Pre-fill with current employee email if it looks like HR, otherwise default to Sarah Chen
  const defaultEmail = employee?.role === 'hr' || employee?.role === 'admin'
    ? employee.email
    : 'sarah.chen@dayflow.internal';

  const [email, setEmail] = useState(defaultEmail);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCodeAvailable, setDemoCodeAvailable] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('Please enter an authorized HR/Admin email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_verification_code',
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDemoCodeAvailable(data.demoCode || '774102');
        setStep('code');
      } else {
        setErrorMsg(data.error || 'This email address is not authorized for HR/Admin access.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!code.trim()) {
      setErrorMsg('Please enter the 6-digit security code.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_email',
          email: email.trim().toLowerCase(),
          code: code.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('dayflow_admin_verified', 'true');
        sessionStorage.setItem('dayflow_admin_email', email.trim().toLowerCase());
        onSuccess();
      } else {
        setErrorMsg(data.error || 'Invalid verification code.');
      }
    } catch {
      setErrorMsg('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFillCode = () => {
    if (demoCodeAvailable) {
      setCode(demoCodeAvailable);
    } else {
      setCode('774102');
    }
  };

  return (
    <div
      id="dayflow-admin-verification-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-900 overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Icon & Title */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
            <Lock className="w-3 h-3" /> Privileged Access Control
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            HR & Admin Verification Gate
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            To view company rosters, approve employee leaves, and manage payroll, please verify an authorized HR/Admin email.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* Step 1: Email Verification Form */}
        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-600" />
                <span>Authorized HR / Administrator Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@dayflow.internal"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              />
            </div>

            {/* Quick Demo Pre-sets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Select Authorized Demo Accounts:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEmail('sarah.chen@dayflow.internal')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer text-xs ${
                    email === 'sarah.chen@dayflow.internal'
                      ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">Sarah Chen</div>
                  <div className="text-[10px] text-slate-500">HR Partner (Lead)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEmail('marcus.vance@dayflow.internal')}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer text-xs ${
                    email === 'marcus.vance@dayflow.internal'
                      ? 'bg-purple-50 border-purple-300 text-purple-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">Marcus Vance</div>
                  <div className="text-[10px] text-slate-500">System Admin</div>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Dispatching Security OTP...</span>
              ) : (
                <>
                  <span>Send Security Verification Code</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Enter 6-Digit OTP Code */
          <form onSubmit={handleVerifyCode} className="mt-5 space-y-4">
            <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-xs text-purple-900 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Code sent to:</span>
                  <div className="font-mono text-slate-800">{email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-[11px] font-semibold text-purple-700 hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                  <span>Enter 6-Digit Verification Code</span>
                </label>
                <button
                  type="button"
                  onClick={handleQuickFillCode}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  Autofill Code ({demoCodeAvailable || '774102'})
                </button>
              </div>

              <input
                type="text"
                maxLength={8}
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="774102"
                required
                className="w-full text-center tracking-widest text-lg font-mono font-extrabold py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              />
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying Authorization...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Unlock HR Portal</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Dayflow Enterprise Single Sign-On (SSO) & Multi-Factor Authentication
        </div>
      </div>
    </div>
  );
}
