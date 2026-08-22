'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  MessageSquare,
  ChevronRight,
  BookOpen,
  Calendar,
  CreditCard,
  Laptop,
} from 'lucide-react';

export function HRAssistantModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  if (!isOpen) return null;

  const quickQuestions = [
    {
      cat: 'leave',
      q: 'How many days of annual leave do I get per year?',
      a: 'Full-time employees receive 18 days of paid annual leave, 10 days of sick leave, and 5 casual leaves per calendar year accrued monthly.',
    },
    {
      cat: 'attendance',
      q: 'What is the grace period for morning check-ins?',
      a: 'Official shift starts at 9:00 AM. A 15-minute grace period (up to 9:15 AM) is permitted. Check-ins after 9:15 AM are marked as Late.',
    },
    {
      cat: 'salary',
      q: 'When is monthly salary disbursed?',
      a: 'Salaries are processed on the 28th and credited directly via NEFT/Direct Deposit on the last working day of each calendar month.',
    },
    {
      cat: 'remote',
      q: 'What is Dayflow’s Work-from-Home policy?',
      a: 'Engineering and design team members are entitled to 2 remote (WFH) days per week with prior manager intimation.',
    },
  ];

  const handleAskQuestion = async (queryText: string) => {
    setIsAsking(true);
    setAiAnswer(null);
    try {
      const res = await fetch(`/api/assistant?q=${encodeURIComponent(queryText)}`);
      const data = await res.json();
      if (data.success) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer('Unable to find policy answer. Please contact HR at hr@dayflow.corp.');
      }
    } catch {
      setAiAnswer('Network error querying HR policies.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div
      id="dayflow-hr-assistant-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dayflow HR Policy Assistant
              </h2>
              <p className="text-xs text-slate-500">
                Instant answers regarding leaves, salary cycles, and workplace guidelines
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

        {/* Search Bar */}
        <div className="mt-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (searchQuery.trim()) handleAskQuestion(searchQuery);
            }}
            className="relative"
          >
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Ask anything (e.g., 'maternity leave duration', 'tax deductions')..."
              className="w-full pl-10 pr-20 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
            />
            <button
              type="submit"
              disabled={isAsking || !searchQuery.trim()}
              className="absolute right-1.5 top-1.5 px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-40 transition-colors"
            >
              {isAsking ? 'Thinking...' : 'Ask'}
            </button>
          </form>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="mt-4 p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-sky-900">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Policy Assistant Guidance:</span>
            </div>
            <p className="leading-relaxed">{aiAnswer}</p>
          </div>
        )}

        {/* Quick FAQs */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Frequently Asked Policy Questions
          </h3>

          <div className="space-y-2">
            {quickQuestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSearchQuery(item.q);
                  setAiAnswer(item.a);
                }}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>{item.q}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Dayflow Code Titans HRMS</span>
          <span>Aligned with Odoo Employee Module Guidelines</span>
        </div>
      </div>
    </div>
  );
}
