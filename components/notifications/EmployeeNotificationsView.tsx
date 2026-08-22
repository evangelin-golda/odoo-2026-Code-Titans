'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEmployee } from '@/context/EmployeeContext';
import { useToast } from '@/components/ui/Toast';
import {
  Bell,
  CheckCircle2,
  Clock,
  CalendarDays,
  CreditCard,
  Megaphone,
  CheckCheck,
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';

export function EmployeeNotificationsView() {
  const { employee, refreshNotificationsCount } = useEmployee();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<any[]>([
    {
      id: '1',
      title: 'Paid Leave Balance Refreshed',
      message: 'Your annual leave quota for August 2026 has been credited with 18 days.',
      timestamp: '2 hours ago',
      read: false,
      category: 'leave',
    },
    {
      id: '2',
      title: 'August Direct Deposit Ready',
      message: 'Your monthly pay statement for August 2026 has been calculated and submitted for payout on Aug 31.',
      timestamp: '1 day ago',
      read: false,
      category: 'payroll',
    },
    {
      id: '3',
      title: 'Q3 Goal Assessment Open',
      message: 'Please complete your self-evaluation form in the HR workspace by next Friday.',
      timestamp: '3 days ago',
      read: true,
      category: 'announcement',
    },
  ]);

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'unread') return !item.read;
    return item.category === filterCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F4FA] border border-[#E8E2F0] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7B2CBF] bg-[#7B2CBF]/10 px-2.5 py-0.5 rounded-md">
              Communication Center
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#1E1035] tracking-tight mt-1.5">
            Notifications & Corporate Alerts
          </h2>
          <p className="text-xs text-[#1E1035]/70 max-w-lg mt-0.5 leading-relaxed">
            Stay updated with leave approvals, monthly salary stubs, company-wide announcements, and policy notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="md"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck size={16} />}
            className="w-full md:w-auto"
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'leave', label: 'Leave Updates' },
          { id: 'payroll', label: 'Payroll' },
          { id: 'announcement', label: 'Notices' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterCategory(tab.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
              filterCategory === tab.id
                ? 'bg-[#7B2CBF] text-white border-[#7B2CBF] shadow-xs'
                : 'bg-white text-[#1E1035]/70 border-[#E8E2F0] hover:bg-[#F7F4FA]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List Card */}
      <Card>
        <CardHeader
          title="Recent System Alerts"
          subtitle={`Showing ${filteredNotifications.length} messages`}
          icon={<Bell size={18} />}
        />

        <div className="divide-y divide-[#E8E2F0]">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#1E1035]/50">
              No notifications found matching the selected filter.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkSingleRead(item.id)}
                className={`p-4 transition-colors cursor-pointer flex items-start gap-4 ${
                  !item.read ? 'bg-[#7B2CBF]/5 hover:bg-[#7B2CBF]/10' : 'hover:bg-[#F7F4FA]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    item.category === 'payroll'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.category === 'leave'
                      ? 'bg-purple-50 text-[#7B2CBF] border-purple-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {item.category === 'payroll' ? (
                    <CreditCard size={18} />
                  ) : item.category === 'leave' ? (
                    <CalendarDays size={18} />
                  ) : (
                    <Megaphone size={18} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-[#1E1035]">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#1E1035]/40 whitespace-nowrap">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#1E1035]/70 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {!item.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7B2CBF] mt-2 shrink-0" />
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
