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
  Globe,
} from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToSignup?: () => void;
}

export function LoginForm({
  onSuccess,
  onSwitchToLogin,
  onSwitchToSignup,
}: LoginFormProps & { onSwitchToLogin?: () => void }) {
  const { login, loginWithOAuth, switchDemoUser, setActiveView, isLoading } = useEmployee();

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

  // OAuth Modal prompt
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);

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

  // 3. OAuth Single Sign-On (Google / GitHub)
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setOauthLoading(provider);

    try {
      // Default email for quick SSO or use typed email
      const targetEmail = identifier.trim() || (provider === 'google' ? 'bharani.flow@gmail.com' : 'marcus.vance@dayflow.internal');
      const targetName = provider === 'google' ? 'Bharani Flow' : 'Marcus Vance';

      const res = await loginWithOAuth({
        provider,
        email: targetEmail,
        name: targetName,
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || `Failed to sign in with ${provider}.`);
      }
    } catch (err: any) {
      setError(err?.message || `OAuth authentication error.`);
    } finally {
      setOauthLoading(null);
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
      {/* OAuth SSO Buttons */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Google OAuth */}
          <button
            type="button"
            disabled={oauthLoading !== null || isSubmitting || isLoading}
            onClick={() => handleOAuthSignIn('google')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* GitHub OAuth */}
          <button
            type="button"
            disabled={oauthLoading !== null || isSubmitting || isLoading}
            onClick={() => handleOAuthSignIn('github')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {oauthLoading === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or Work Email Login
          </span>
        </div>
      </div>

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
