'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Clock,
  CalendarCheck,
  CreditCard,
  Lock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  activeTab: 'login' | 'signup';
}

export function AuthLayout({
  children,
  title,
  subtitle,
  activeTab,
}: AuthLayoutProps) {
  const highlights = [
    {
      icon: Clock,
      title: 'Real-time Shift Clock & Grace Tracking',
      desc: 'Automatic grace period logic and office/remote punch logs.',
    },
    {
      icon: CalendarCheck,
      title: 'Time Off & Leave Management',
      desc: 'Dynamic category balances with multi-tier approval workflows.',
    },
    {
      icon: CreditCard,
      title: 'Salary & Deductions Transparency',
      desc: 'Itemized compensation breakdowns and statutory deductions.',
    },
    {
      icon: Lock,
      title: 'Strict Employee Data Isolation',
      desc: 'Zero cross-tenant data leakage with role boundary enforcement.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Bar / Back to Portal */}
      <div className="max-w-6xl w-full mx-auto mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Employee Workspace</span>
        </Link>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium hidden sm:flex">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Neon PostgreSQL v16 Connected</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Hero Column (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white p-8 lg:p-10 flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center ring-1 ring-white/20 shadow-inner">
                <svg
                  className="w-6 h-6 text-sky-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-white">DAYFLOW</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 uppercase">
                    HRMS
                  </span>
                </div>
                <p className="text-xs text-slate-300">Every workday, perfectly aligned.</p>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Next-Gen Human Resource Portal
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
                Designed for modern teams and seamless employee self-service.
              </h1>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2">
              {highlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <div key={i} className="flex items-start gap-3 text-left">
                    <div className="p-2 rounded-xl bg-white/10 text-sky-400 shrink-0 mt-0.5 ring-1 ring-white/10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{h.title}</div>
                      <div className="text-[11px] text-slate-400 leading-snug">{h.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Security / Trust Card */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold text-sky-400">99.8%</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wide">Punctuality Score</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-lg font-bold text-emerald-400">SOC-2</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wide">Enterprise Grade</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                End-to-End Encryption
              </span>
              <span>Dayflow HRMS v0.1.0</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              </div>

              {/* Toggle Link */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <Link
                  href="/login"
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'signup'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Form Content */}
            <div>{children}</div>
          </div>

          {/* Footer Note */}
          <div className="max-w-md w-full mx-auto pt-6 text-center text-[11px] text-slate-400 border-t border-slate-100 mt-6">
            Protected by Dayflow Identity & Role Protection. Compliant with Odoo HR & PostgreSQL Schemas.
          </div>
        </div>
      </div>
    </div>
  );
}
