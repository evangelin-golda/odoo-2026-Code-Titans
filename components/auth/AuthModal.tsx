'use client';

import React, { useState } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  X,
  UserCheck,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  User,
  KeyRound,
} from 'lucide-react';
import Image from 'next/image';

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { switchDemoUser } = useEmployee();
  const { showToast } = useToast();

  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const personas = [
    {
      id: 'EMP-1001',
      name: 'Alex Rivera',
      role: 'Senior Software Engineer',
      dept: 'Engineering & UI',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'EMP-1002',
      name: 'Sarah Chen',
      role: 'Lead UI/UX Designer',
      dept: 'Design & UX',
      avatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'EMP-1003',
      name: 'Marcus Vance',
      role: 'DevOps & Reliability Engineer',
      dept: 'Infrastructure',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSelectPersona = async (employeeId: string) => {
    setIsSubmitting(true);
    try {
      await switchDemoUser(employeeId);
      showToast(`Switched active session to ${employeeId}`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error switching persona', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customEmail, password: customPassword }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        await switchDemoUser(data.user.employeeId);
        showToast(`Logged in as ${data.user.name}`, 'success');
        onClose();
      } else {
        showToast(data.error || 'Invalid credentials', 'error');
      }
    } catch {
      showToast('Authentication failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="dayflow-auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Employee Session & Personas
              </h2>
              <p className="text-xs text-slate-500">
                Switch profiles to verify strict data isolation & role boundaries
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

        {/* Persona Switcher List */}
        <div className="mt-4 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Quick Persona Switcher (Demo Employees)
          </span>

          <div className="space-y-2">
            {personas.map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectPersona(p.id)}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-sky-50/60 hover:border-sky-300 cursor-pointer transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <Image
                      src={p.avatar}
                      alt={p.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200">
                        {p.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{p.role} • {p.dept}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Password Login Option */}
        <form onSubmit={handleCustomLogin} className="mt-6 pt-4 border-t border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Or Sign In with Corporate Email
          </span>

          <div className="space-y-2 text-xs">
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                placeholder="alex.morgan@dayflow.corp"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                placeholder="Password (demo: any)"
                value={customPassword}
                onChange={e => setCustomPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !customEmail}
            className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-40 transition-colors"
          >
            Authenticate Employee Session
          </button>
        </form>
      </div>
    </div>
  );
}
