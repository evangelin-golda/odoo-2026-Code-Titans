'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { WorkMode, UserRole } from '@/types/hrms';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Lock,
  Eye,
  EyeOff,
  Laptop,
  Building,
  Home,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Users,
  Shield,
} from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const { register, loginWithOAuth, isLoading } = useEmployee();

  const [accountType, setAccountType] = useState<UserRole>('employee');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Core Engineering');
  const [jobPosition, setJobPosition] = useState('Software Engineer');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Core Engineering',
    'Product & Design',
    'Infrastructure & Cloud',
    'Quality Assurance',
    'HR & People Operations',
    'Marketing & Growth',
    'Finance & Legal',
    'Operations & Support',
  ];

  // Switch role handler
  const handleAccountTypeChange = (type: UserRole) => {
    setAccountType(type);
    if (type === 'hr') {
      setDepartment('HR & People Operations');
      setJobPosition('HR Operations Partner');
    } else {
      setDepartment('Core Engineering');
      setJobPosition('Software Engineer');
    }
  };

  // OAuth SSO handler
  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setOauthLoading(provider);

    try {
      const targetEmail = email.trim() || (provider === 'google' ? 'bharani.flow@gmail.com' : 'dev@dayflow.internal');
      const targetName = name.trim() || (provider === 'google' ? 'Bharani Flow' : 'Developer Account');

      const res = await loginWithOAuth({
        provider,
        email: targetEmail,
        name: targetName,
        rolePreference: accountType === 'hr' ? 'hr' : 'employee',
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || `Failed to sign up with ${provider}.`);
      }
    } catch (err: any) {
      setError(err?.message || `OAuth registration error.`);
    } finally {
      setOauthLoading(null);
    }
  };

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
  const strengthColors = [
    'bg-slate-200',
    'bg-rose-500',
    'bg-amber-500',
    'bg-sky-500',
    'bg-emerald-500',
    'bg-emerald-600',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full legal name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid corporate email address.');
      return;
    }

    if (password && password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both password entries.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to Dayflow HRMS terms and employee privacy policies.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+1 (555) 000-0000',
        department,
        jobPosition: jobPosition.trim() || (accountType === 'hr' ? 'HR Partner' : 'Software Engineer'),
        workMode,
        role: accountType,
        password: password || 'demo123',
      });

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Network error occurred during registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Account Type Selector (Employee vs HR Admin) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Account Workspace Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => handleAccountTypeChange('employee')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
              accountType === 'employee'
                ? 'bg-white text-sky-900 shadow-xs border border-sky-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-sky-600" />
            <span>Employee Account</span>
          </button>

          <button
            type="button"
            onClick={() => handleAccountTypeChange('hr')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all cursor-pointer ${
              accountType === 'hr'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>HR / Admin Account</span>
          </button>
        </div>
      </div>

      {/* OAuth SSO Quick Sign-Up (Google) */}
      <div className="space-y-2">
        <button
          type="button"
          disabled={oauthLoading !== null || isSubmitting || isLoading}
          onClick={() => handleOAuthSignIn('google')}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
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
          <span>Sign up with Google</span>
        </button>

        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t border-slate-200" />
          <span className="absolute bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or Complete Details
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium leading-relaxed">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Corporate Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Jordan Taylor"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Corporate Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jordan.taylor@dayflow.internal"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Department & Job Position */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Department <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none transition-all cursor-pointer"
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Job Position / Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={jobPosition}
                onChange={e => setJobPosition(e.target.value)}
                placeholder={accountType === 'hr' ? 'HR Operations Partner' : 'Software Engineer'}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Contact Phone Number */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Work / Contact Phone
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 321-9988"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Work Mode Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Work Mode Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'hybrid', label: 'Hybrid', icon: Laptop, desc: 'Office + Remote' },
              { id: 'office', label: 'In-Office', icon: Building, desc: 'HQ Location' },
              { id: 'remote', label: 'Remote', icon: Home, desc: '100% Remote' },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = workMode === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setWorkMode(item.id as WorkMode)}
                  className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500 text-sky-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mx-auto mb-1 ${
                      isSelected ? 'text-sky-600' : 'text-slate-400'
                    }`}
                  />
                  <div className="text-[11px] font-bold">{item.label}</div>
                  <div className="text-[9px] text-slate-500">{item.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Create Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">Password Strength:</span>
              <span className="font-semibold text-slate-700">
                {strengthLabels[strengthScore]}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`h-full transition-all ${
                    strengthScore >= step ? strengthColors[strengthScore] : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Terms and Policy agreement */}
        <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={e => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 shrink-0"
          />
          <span className="text-[11px] text-slate-600 leading-tight">
            I agree to Dayflow&apos;s{' '}
            <span className="text-sky-600 font-medium hover:underline">Employee Code of Conduct</span>,{' '}
            <span className="text-sky-600 font-medium hover:underline">Attendance Grace Policy</span>, and{' '}
            <span className="text-sky-600 font-medium hover:underline">Strict Data Isolation Terms</span>.
          </span>
        </label>

        {/* Submit Register Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading || !name.trim() || !email.trim()}
          className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer ${
            accountType === 'hr'
              ? 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-600'
              : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-900'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Registering {accountType === 'hr' ? 'HR Administrator' : 'Employee'} Profile...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Create {accountType === 'hr' ? 'HR / Admin' : 'Employee'} Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      {onSwitchToLogin && (
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an active account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
