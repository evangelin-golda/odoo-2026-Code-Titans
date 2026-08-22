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
  Filter,
} from 'lucide-react';
import { NotificationItem } from '@/types/hrms';

export function EmployeeNotificationsView() {
  const { employee, refreshNotificationsCount } = useEmployee();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchNotifications = useCallback(async () => {
    if (!employee) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notifications?employeeId=${employee.employeeId}`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        refreshNotificationsCount();
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [employee, refreshNotificationsCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id?: string) => {
    if (!employee) return;
    try {
      const res = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: employee.employeeId,
          notificationId: id,
          markAllAsRead: !id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(id ? 'Notification marked as read' : 'All notifications marked as read', 'success');
        fetchNotifications();
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating notification status', 'error');
    }
  };

  const filteredNotifications = notifications.filter(item => {
    if (filterCategory === 'all') return true;
    return item.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'attendance':
        return <Clock className="w-4 h-4 text-sky-600" />;
      case 'leave':
        return <CalendarDays className="w-4 h-4 text-emerald-600" />;
      case 'payroll':
        return <CreditCard className="w-4 h-4 text-violet-600" />;
      case 'announcement':
      default:
        return <Megaphone className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div id="dayflow-employee-notifications-view" className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Communication Center
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Employee Notifications & Alerts
            </h1>
            <p className="text-xs text-slate-500">
              Stay informed on leave approvals, attendance alerts, and official HR announcements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleMarkAsRead()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-xs"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        </div>
      </div>

      {/* 2. Category Filter & Notifications List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['all', 'attendance', 'leave', 'payroll', 'announcement'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  filterCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat === 'all' ? 'All Alerts' : cat}
              </button>
            ))}
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">No notifications in this category.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(item => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !item.isRead
                    ? 'bg-sky-50/50 border-sky-200 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200/60 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{item.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      {item.timestamp}
                    </span>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleMarkAsRead(item.id);
                    }}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-semibold shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
