'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Shield,
  UserCheck,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  Send,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToLogin, onSwitchToSignup }: LoginFormProps & { onSwitchToLogin?: () => void }) {
  const { login, switchDemoUser, setActiveView, isLoading } = useEmployee();

  // Login Mode: 'otp' (Resend Email Verification) vs 'password'
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // OTP Step: 'email' vs 'code'
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email');
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [detectedRole, setDetectedRole] = useState<'hr' | 'admin' | 'employee'>('employee');
  const [detectedName, setDetectedName] = useState<string>('');
  const [detectedEmployeeId, setDetectedEmployeeId] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('774102');
  const [emailDispatched, setEmailDispatched] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Password Mode
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Send OTP via Resend
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your work email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_otp',
          email: identifier.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDetectedRole(data.role || 'employee');
        setDetectedName(data.employeeName || identifier);
        setDetectedEmployeeId(data.employeeId || 'EMP-USER');
        const code = data.otpCode || data.demoCode || '774102';
        setGeneratedOtp(code);
        setOtpCode(code); // Pre-fill for convenience
        setEmailDispatched(Boolean(data.emailDispatched));
        setOtpStep('code');
      } else {
        setError(data.error || 'Failed to dispatch verification code. Please check your email.');
      }
    } catch {
      setError('Network error sending verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Verify OTP & Route to HR vs Employee Portal
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_otp',
          email: identifier.trim().toLowerCase(),
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const emp = data.employee;
        const isHR = data.isHR;

        // Switch to authenticated employee
        await switchDemoUser(emp.employeeId);

        if (isHR) {
          sessionStorage.setItem('dayflow_admin_verified', 'true');
          sessionStorage.setItem('dayflow_admin_email', emp.email);
          setActiveView('admin');
        } else {
          setActiveView('dashboard');
        }

        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Invalid verification code. Please check and try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Standard Password Login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Please enter your email address or Employee ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login({
        identifier: identifier.trim(),
        password: password || 'demo123',
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setError('Unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-5">
      {/* Auth Method Tabs (Resend OTP vs Password) */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setAuthMethod('otp');
            setError(null);
          }}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            authMethod === 'otp'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-purple-600" />
          <span>Email OTP Verification</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMethod('password');
            setError(null);
          }}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            authMethod === 'password'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Password Sign In</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {/* METHOD 1: Resend Email OTP Verification */}
      {authMethod === 'otp' ? (
        otpStep === 'email' ? (
          /* Step 1: Input Email & Request Code */
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Work Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={identifier}
                  onChange={e => {
                    setIdentifier(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. bharani.flow@gmail.com or name@dayflow.internal"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                The system automatically routes you to the <strong>Employee Workspace</strong> or <strong>HR Admin Portal</strong> based on your account role.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !identifier.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Dispatching Email Verification...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Verification Code</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: Enter 6-Digit Code & Route based on Role */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* Detected Role Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                detectedRole === 'hr' || detectedRole === 'admin'
                  ? 'bg-purple-50 border-purple-200 text-purple-950'
                  : 'bg-sky-50 border-sky-200 text-sky-950'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {detectedRole === 'hr' || detectedRole === 'admin' ? (
                  <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0" />
                ) : (
                  <UserCheck className="w-5 h-5 text-sky-600" />
                )}
                <div>
                  <div className="font-bold flex items-center gap-1.5">
                    <span>{detectedName}</span>
                    <span className="text-[10px] font-mono opacity-70">({detectedEmployeeId})</span>
                  </div>
                  <div className="text-[11px] font-medium opacity-80 mt-0.5">
                    Account: <strong className="uppercase">{detectedRole}</strong> ➜ Destination:{' '}
                    <strong>
                      {detectedRole === 'hr' || detectedRole === 'admin'
                        ? 'HR Admin Portal'
                        : 'Employee Workspace'}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOtpStep('email')}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Email Dispatch Info Pill */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between gap-2 text-slate-600">
              <span className="truncate">
                Sent to: <strong className="font-mono text-slate-800">{identifier}</strong>
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[10px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : `Passcode: ${generatedOtp}`}</span>
              </button>
            </div>

            {/* 6-Digit Code input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-600" />
                  <span>Enter 6-Digit Passcode</span>
                </label>
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedOtp)}
                  className="text-[10px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  Autofill ({generatedOtp})
                </button>
              </div>

              <input
                type="text"
                maxLength={8}
                value={otpCode}
                onChange={e => {
                  setOtpCode(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={generatedOtp}
                required
                className="w-full text-center tracking-widest text-2xl font-mono font-black py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Submit Verification */}
            <button
              type="submit"
              disabled={isSubmitting || !otpCode.trim()}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                detectedRole === 'hr' || detectedRole === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Authenticating & Moving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Verify & Move to{' '}
                    {detectedRole === 'hr' || detectedRole === 'admin'
                      ? 'HR Admin Portal'
                      : 'Employee Workspace'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )
      ) : (
        /* METHOD 2: Standard Password Form */
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Email or Employee ID */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Work Email or Employee ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={e => {
                  setIdentifier(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. bharani.flow@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Security Note */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-600">Keep me signed in</span>
            </label>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>256-bit TLS Encrypted</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading || !identifier.trim()}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating Session...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 text-sky-400" />
                <span>Sign In to Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Switch to Sign Up */}
      {onSwitchToSignup && (
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account yet?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              Sign up now
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
